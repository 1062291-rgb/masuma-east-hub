import { useState, useEffect } from 'react'
import { supabase, Product } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  useEffect(() => {
    if (profile?.branch_id) {
      fetchProducts()
    }
  }, [profile?.branch_id])

  const fetchProducts = async () => {
    if (!profile?.branch_id) return

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('branch_id', profile.branch_id)
        .order('name')

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()

      if (error) {
        console.error('Error adding product:', error)
        return null
      }

      setProducts(prev => [...prev, data])
      return data
    } catch (error) {
      console.error('Error adding product:', error)
      return null
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating product:', error)
        return null
      }

      setProducts(prev => prev.map(p => p.id === id ? data : p))
      return data
    } catch (error) {
      console.error('Error updating product:', error)
      return null
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        return false
      }

      setProducts(prev => prev.filter(p => p.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  }

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  }
}