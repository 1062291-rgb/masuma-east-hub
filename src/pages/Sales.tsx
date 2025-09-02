import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Download, Receipt } from 'lucide-react'
import { useSales } from '@/hooks/useSales'
import { useAuth } from '@/hooks/useAuth'
import { format } from 'date-fns'

export default function Sales() {
  const { sales, loading } = useSales()
  const { profile } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredSales, setFilteredSales] = useState(sales)

  useEffect(() => {
    let filtered = sales

    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter)
    }

    setFilteredSales(filtered)
  }, [sales, searchTerm, statusFilter])

  const generateKRAReceipt = async (saleId: string) => {
    // This would integrate with KRA ETR system
    console.log('Generating KRA receipt for sale:', saleId)
    // Implementation would depend on KRA API requirements
  }

  const downloadReceipt = (sale: any) => {
    // Generate and download receipt PDF
    const receiptContent = `
      MASUMA AUTOPARTS EAST AFRICA
      Receipt No: ${sale.receipt_number}
      Date: ${format(new Date(sale.created_at), 'PPP')}
      Customer: ${sale.customer?.name || 'Walk-in Customer'}
      
      Items:
      ${sale.sale_items.map((item: any) => 
        `${item.product.name} x ${item.quantity} @ ${profile?.currency} ${item.unit_price} = ${profile?.currency} ${item.total_price}`
      ).join('\n')}
      
      Total: ${profile?.currency} ${sale.total_amount}
      Payment Method: ${sale.payment_method.toUpperCase()}
      
      Thank you for your business!
    `
    
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${sale.receipt_number}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0)
  const todaySales = sales.filter(sale => 
    new Date(sale.created_at).toDateString() === new Date().toDateString()
  )
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total_amount, 0)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-masuma-red">Sales Management</h1>
        <p className="text-muted-foreground">Track and manage all sales transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySales.length}</div>
            <p className="text-xs text-muted-foreground">Transactions today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.currency} {totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.currency} {todayTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Revenue today</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
          <CardDescription>View and manage all sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by receipt number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.receipt_number}</TableCell>
                    <TableCell>{format(new Date(sale.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{sale.customer?.name || 'Walk-in Customer'}</TableCell>
                    <TableCell>{sale.sale_items.length} items</TableCell>
                    <TableCell className="capitalize">{sale.payment_method.replace('_', ' ')}</TableCell>
                    <TableCell>{profile?.currency} {sale.total_amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          sale.status === 'completed' ? 'default' :
                          sale.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadReceipt(sale)}
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateKRAReceipt(sale.id)}
                        >
                          KRA
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}