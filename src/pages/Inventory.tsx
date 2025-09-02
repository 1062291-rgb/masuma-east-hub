import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Filter, Package, AlertTriangle, CheckCircle } from "lucide-react";

const inventoryData = [
  {
    id: "1",
    partNumber: "TOF-001",
    name: "Toyota Oil Filter",
    category: "Filters",
    stock: 45,
    minStock: 10,
    price: 850,
    supplier: "Masuma Japan",
    status: "in-stock"
  },
  {
    id: "2",
    partNumber: "BPS-205",
    name: "Brake Pads Set",
    category: "Brakes",
    stock: 8,
    minStock: 15,
    price: 2400,
    supplier: "Masuma Japan", 
    status: "low-stock"
  },
  {
    id: "3",
    partNumber: "AF-300",
    name: "Air Filter",
    category: "Filters",
    stock: 2,
    minStock: 20,
    price: 650,
    supplier: "Masuma Japan",
    status: "critical"
  },
  {
    id: "4",
    partNumber: "SP-400",
    name: "Spark Plugs (Set of 4)",
    category: "Engine",
    stock: 32,
    minStock: 12,
    price: 1200,
    supplier: "Masuma Japan",
    status: "in-stock"
  },
  {
    id: "5",
    partNumber: "TO-500",
    name: "Transmission Oil",
    category: "Oils",
    stock: 18,
    minStock: 8,
    price: 1800,
    supplier: "Masuma Japan",
    status: "in-stock"
  },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getStatusBadge = (status: string, stock: number) => {
    switch (status) {
      case "critical":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Critical ({stock})
          </Badge>
        );
      case "low-stock":
        return (
          <Badge className="bg-warning text-warning-foreground flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Low ({stock})
          </Badge>
        );
      default:
        return (
          <Badge className="bg-success text-success-foreground flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            In Stock ({stock})
          </Badge>
        );
    }
  };

  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(inventoryData.map(item => item.category))];
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const lowStockItems = inventoryData.filter(item => item.status !== "in-stock").length;

  return (
    <div className="flex-1 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Manage your spare parts inventory and stock levels
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="masuma" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add New Part
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventoryData.reduce((sum, item) => sum + item.stock, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by part name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-background border border-input rounded-md text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Parts Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.partNumber}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {getStatusBadge(item.status, item.stock)}
                  </TableCell>
                  <TableCell>KES {item.price.toLocaleString()}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="pos" size="sm">
                        Add to Sale
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}