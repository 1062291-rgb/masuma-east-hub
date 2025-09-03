import { useState, useEffect } from 'react'
import { supabase, Customer } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  useEffect(() => {
    if (profile?.branch_id) {
      fetchCustomers()
    }
  }, [profile?.branch_id])

  const fetchCustomers = async () => {
    if (!profile?.branch_id) return

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('branch_id', profile.branch_id)
        .order('name')

      if (error) {
        console.error('Error fetching customers:', error)
      } else {
        setCustomers(data || [])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single()

      if (error) {
        console.error('Error adding customer:', error)
        return null
      }

      setCustomers(prev => [...prev, data])
      return data
    } catch (error) {
      console.error('Error adding customer:', error)
      return null
    }
  }

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating customer:', error)
        return null
      }

      setCustomers(prev => prev.map(c => c.id === id ? data : c))
      return data
    } catch (error) {
      console.error('Error updating customer:', error)
      return null
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting customer:', error)
        return false
      }

      setCustomers(prev => prev.filter(c => c.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting customer:', error)
      return false
    }
  }

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers,
  }
}