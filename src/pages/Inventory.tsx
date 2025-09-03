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
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { products, loading } = useProducts();
  const { profile } = useAuth();

  const getStatusBadge = (stock: number, minStock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Out of Stock
        </Badge>
      );
    } else if (stock <= minStock) {
      return (
        <Badge className="bg-warning text-warning-foreground flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Low Stock ({stock})
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-success text-success-foreground flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          In Stock ({stock})
        </Badge>
      );
    }
  };

  const filteredInventory = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map(product => product.category))];
  const totalValue = products.reduce((sum, product) => sum + (product.stock_quantity * product.price), 0);
  const lowStockItems = products.filter(product => product.stock_quantity <= product.min_stock_level).length;

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
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.reduce((sum, product) => sum + product.stock_quantity, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.currency} {totalValue.toLocaleString()}</div>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading inventory...
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono">{product.part_number}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {getStatusBadge(product.stock_quantity, product.min_stock_level)}
                    </TableCell>
                    <TableCell>{profile?.currency} {product.price.toLocaleString()}</TableCell>
                    <TableCell>Masuma Japan</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}