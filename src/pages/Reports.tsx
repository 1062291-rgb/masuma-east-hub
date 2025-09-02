import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Download, TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { addDays, format, subDays } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [reportType, setReportType] = useState('sales')
  const [salesData, setSalesData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [loading, setLoading] = useState(true)

  const { profile } = useAuth()

  useEffect(() => {
    if (profile?.branch_id && dateRange?.from && dateRange?.to) {
      fetchReportData()
    }
  }, [profile?.branch_id, dateRange, reportType])

  const fetchReportData = async () => {
    if (!profile?.branch_id || !dateRange?.from || !dateRange?.to) return

    setLoading(true)
    try {
      // Fetch sales data
      const { data: sales } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            *,
            product:products (*)
          )
        `)
        .eq('branch_id', profile.branch_id)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())

      // Process sales data for charts
      const dailySales = sales?.reduce((acc: any, sale: any) => {
        const date = format(new Date(sale.created_at), 'MMM dd')
        acc[date] = (acc[date] || 0) + sale.total_amount
        return acc
      }, {})

      setSalesData(Object.entries(dailySales || {}).map(([date, amount]) => ({
        date,
        amount,
        sales: sales?.filter((s: any) => format(new Date(s.created_at), 'MMM dd') === date).length || 0
      })))

      // Fetch inventory data
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('branch_id', profile.branch_id)

      const categoryData = products?.reduce((acc: any, product: any) => {
        acc[product.category] = (acc[product.category] || 0) + product.stock_quantity
        return acc
      }, {})

      setInventoryData(Object.entries(categoryData || {}).map(([category, quantity]) => ({
        category,
        quantity
      })))

    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = () => {
    // Generate and download report
    const reportContent = `
MASUMA AUTOPARTS EAST AFRICA
${reportType.toUpperCase()} REPORT
Period: ${dateRange?.from ? format(dateRange.from, 'PPP') : ''} - ${dateRange?.to ? format(dateRange.to, 'PPP') : ''}

Generated: ${format(new Date(), 'PPP')}
Branch: ${profile?.branch_id}
Currency: ${profile?.currency}

Sales Summary:
${salesData.map((item: any) => `${item.date}: ${profile?.currency} ${item.amount} (${item.sales} transactions)`).join('\n')}

Total Sales: ${profile?.currency} ${salesData.reduce((sum: number, item: any) => sum + item.amount, 0)}
Total Transactions: ${salesData.reduce((sum: number, item: any) => sum + item.sales, 0)}
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const COLORS = ['#dc2626', '#ea7c69', '#f97316', '#eab308', '#84cc16', '#22c55e']

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const totalSales = salesData.reduce((sum: number, item: any) => sum + item.amount, 0)
  const totalTransactions = salesData.reduce((sum: number, item: any) => sum + item.sales, 0)
  const avgTransactionValue = totalTransactions > 0 ? totalSales / totalTransactions : 0

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-masuma-red">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and analytics</p>
        </div>
        
        <div className="flex gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Report</SelectItem>
              <SelectItem value="inventory">Inventory Report</SelectItem>
              <SelectItem value="customers">Customer Report</SelectItem>
              <SelectItem value="kra">KRA Tax Report</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport} className="bg-masuma-red hover:bg-masuma-red-dark">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.currency} {totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Selected period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Total sales transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.currency} {avgTransactionValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Average sale value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventoryData.reduce((sum: number, item: any) => sum + item.quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total stock units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Trend</CardTitle>
            <CardDescription>Sales performance over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'amount' ? `${profile?.currency} ${value}` : value,
                    name === 'amount' ? 'Revenue' : 'Transactions'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--masuma-red))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Stock distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }: any) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantity"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance Analysis</CardTitle>
          <CardDescription>Detailed breakdown of sales metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Revenue</th>
                  <th className="text-left p-4">Transactions</th>
                  <th className="text-left p-4">Avg Sale Value</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">{item.date}</td>
                    <td className="p-4">{profile?.currency} {item.amount.toLocaleString()}</td>
                    <td className="p-4">{item.sales}</td>
                    <td className="p-4">
                      {profile?.currency} {item.sales > 0 ? (item.amount / item.sales).toFixed(0) : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}