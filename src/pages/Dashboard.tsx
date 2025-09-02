import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentSales from "@/components/dashboard/RecentSales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your inventory today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="masuma" size="lg">
            New Sale
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="KES 2,345,240"
          change="+20.1% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          title="Parts in Stock"
          value="8,492"
          change="+180 new items"
          changeType="positive"
          icon={Package}
        />
        <StatsCard
          title="Sales Today"
          value="47"
          change="+12% from yesterday"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Active Customers"
          value="2,350"
          change="+4% from last month"
          changeType="positive"
          icon={Users}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <TrendingUp className="w-12 h-12 mb-4" />
              <div className="text-center">
                <p className="text-lg font-medium">Sales Analytics</p>
                <p className="text-sm">Interactive charts coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <div className="col-span-3">
          <RecentSales />
        </div>
      </div>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
            Low Stock Alert
          </CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Toyota Oil Filter</p>
                  <p className="text-sm text-muted-foreground">Part #: TOF-001</p>
                </div>
                <span className="text-sm font-medium text-destructive">2 left</span>
              </div>
            </div>
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Brake Pads Set</p>
                  <p className="text-sm text-muted-foreground">Part #: BPS-205</p>
                </div>
                <span className="text-sm font-medium text-warning">8 left</span>
              </div>
            </div>
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Air Filter</p>
                  <p className="text-sm text-muted-foreground">Part #: AF-300</p>
                </div>
                <span className="text-sm font-medium text-warning">5 left</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}