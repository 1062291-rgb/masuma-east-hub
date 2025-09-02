import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'admin' | 'manager' | 'cashier'
  branch_id: string
  country: string
  currency: string
  created_at: string
  updated_at: string
}

export interface Branch {
  id: string
  name: string
  address: string
  country: string
  currency: string
  phone: string
  email: string
  manager_id: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  category: string
  brand: string
  part_number: string
  price: number
  cost_price: number
  stock_quantity: number
  min_stock_level: number
  branch_id: string
  supplier_id?: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  kra_pin?: string
  branch_id: string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  customer_id?: string
  cashier_id: string
  branch_id: string
  total_amount: number
  currency: string
  payment_method: 'cash' | 'mpesa' | 'card' | 'bank_transfer'
  status: 'pending' | 'completed' | 'refunded'
  receipt_number: string
  kra_receipt?: string
  created_at: string
  updated_at: string
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface Invoice {
  id: string
  customer_id: string
  branch_id: string
  invoice_number: string
  total_amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  due_date: string
  kra_control_number?: string
  created_at: string
  updated_at: string
}

export interface Quotation {
  id: string
  customer_id: string
  branch_id: string
  quotation_number: string
  total_amount: number
  currency: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  valid_until: string
  created_at: string
  updated_at: string
}