import { useState, useEffect } from 'react'
import { supabase, Sale, SaleItem, Customer, Product } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface SaleWithItems extends Sale {
  sale_items: (SaleItem & {
    product: Product
  })[]
  customer?: Customer
}

export function useSales() {
  const [sales, setSales] = useState<SaleWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const { profile, user } = useAuth()

  useEffect(() => {
    if (profile?.branch_id) {
      fetchSales()
    }
  }, [profile?.branch_id])

  const fetchSales = async () => {
    if (!profile?.branch_id) return

    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            *,
            product:products (*)
          ),
          customer:customers (*)
        `)
        .eq('branch_id', profile.branch_id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching sales:', error)
      } else {
        setSales(data || [])
      }
    } catch (error) {
      console.error('Error fetching sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSale = async (saleData: {
    customer_id?: string
    total_amount: number
    currency: string
    payment_method: Sale['payment_method']
    items: Array<{
      product_id: string
      quantity: number
      unit_price: number
    }>
  }) => {
    if (!profile?.branch_id || !user?.id) return null

    try {
      // Generate receipt number
      const receiptNumber = `RCP-${Date.now()}`

      // Create the sale
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
          customer_id: saleData.customer_id,
          cashier_id: user.id,
          branch_id: profile.branch_id,
          total_amount: saleData.total_amount,
          currency: saleData.currency,
          payment_method: saleData.payment_method,
          status: 'completed',
          receipt_number: receiptNumber,
        }])
        .select()
        .single()

      if (saleError) {
        console.error('Error creating sale:', saleError)
        return null
      }

      // Create sale items
      const saleItems = saleData.items.map(item => ({
        sale_id: sale.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      }))

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems)

      if (itemsError) {
        console.error('Error creating sale items:', itemsError)
        return null
      }

      // Update product stock
      for (const item of saleData.items) {
        await supabase.rpc('decrease_product_stock', {
          product_id: item.product_id,
          quantity: item.quantity
        })
      }

      await fetchSales()
      return sale
    } catch (error) {
      console.error('Error creating sale:', error)
      return null
    }
  }

  return {
    sales,
    loading,
    createSale,
    refetch: fetchSales,
  }
}