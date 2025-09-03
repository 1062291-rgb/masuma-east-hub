import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Printer,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { useCustomers } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/lib/supabase";

interface CartItem {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'card' | 'bank_transfer'>('cash');

  const { products, loading: productsLoading } = useProducts();
  const { createSale } = useSales();
  const { customers, loading: customersLoading } = useCustomers();
  const { profile } = useAuth();

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (product.stock_quantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock_quantity) {
        toast.error("Cannot add more items than available in stock");
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.name, 
        partNumber: product.part_number, 
        price: product.price, 
        quantity: 1,
        stock: product.stock_quantity
      }]);
    }
    
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const saleData = {
      customer_id: selectedCustomerId || undefined,
      total_amount: getTotalAmount(),
      currency: profile?.currency || 'KES',
      payment_method: paymentMethod,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }))
    };

    const sale = await createSale(saleData);
    
    if (sale) {
      toast.success(`Payment of ${profile?.currency} ${getTotalAmount().toLocaleString()} processed successfully`);
      
      // Print receipt
      handlePrintReceipt();
      
      // Clear cart
      setCart([]);
      setSelectedCustomerId("");
    } else {
      toast.error("Failed to process payment");
    }
  };

  const handlePrintReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    const receiptContent = `
      <html>
        <head>
          <title>MASUMA Receipt</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 400px; }
            .header { text-align: center; margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 2px solid #000; font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>MASUMA AUTO PARTS</h2>
            <p>East Africa</p>
            <p>Date: ${new Date().toLocaleString()}</p>
            ${selectedCustomerId ? 
              `<p>Customer: ${customers.find(c => c.id === selectedCustomerId)?.name || 'Unknown'}</p>` : 
              '<p>Walk-in Customer</p>'
            }
          </div>
          
          ${cart.map(item => `
            <div class="item">
              <span>${item.name} (${item.partNumber})</span>
            </div>
            <div class="item">
              <span>${item.quantity} x ${profile?.currency} ${item.price.toLocaleString()}</span>
              <span>${profile?.currency} ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
          
          <div class="item total">
            <span>TOTAL</span>
            <span>${profile?.currency} ${getTotalAmount().toLocaleString()}</span>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;
    
    receiptWindow?.document.write(receiptContent);
    receiptWindow?.document.close();
    receiptWindow?.print();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Point of Sale</h2>
          <p className="text-muted-foreground">Process sales and manage transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search parts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="text-center py-8">Loading products...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-smooth"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.part_number}</p>
                          <p className="text-xs text-muted-foreground">Stock: {product.stock_quantity}</p>
                        </div>
                        <span className="font-bold text-primary">
                          {profile?.currency} {product.price.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        variant="pos"
                        size="sm"
                        onClick={() => addToCart(product)}
                        className="w-full"
                        disabled={product.stock_quantity <= 0}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer & Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer">Customer (Optional)</Label>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer or leave empty for walk-in" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Walk-in Customer</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shopping Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Cart is empty. Add some products to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.partNumber}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="font-medium text-sm">
                          {profile?.currency} {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      
                      {cart.indexOf(item) < cart.length - 1 && <Separator />}
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>{profile?.currency} {getTotalAmount().toLocaleString()}</span>
                  </div>
                  
                  <Button
                    variant="masuma"
                    onClick={handlePayment}
                    className="w-full flex items-center"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Process Payment ({paymentMethod.toUpperCase()})
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={handlePrintReceipt}
                    className="w-full"
                    disabled={cart.length === 0}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Receipt
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}