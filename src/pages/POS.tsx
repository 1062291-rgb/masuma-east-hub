import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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

interface CartItem {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  quantity: number;
}

const sampleParts = [
  { id: "1", name: "Toyota Oil Filter", partNumber: "TOF-001", price: 850 },
  { id: "2", name: "Brake Pads Set", partNumber: "BPS-205", price: 2400 },
  { id: "3", name: "Air Filter", partNumber: "AF-300", price: 650 },
  { id: "4", name: "Spark Plugs (Set of 4)", partNumber: "SP-400", price: 1200 },
  { id: "5", name: "Transmission Oil", partNumber: "TO-500", price: 1800 },
];

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerName, setCustomerName] = useState("");

  const addToCart = (part: typeof sampleParts[0]) => {
    const existingItem = cart.find(item => item.id === part.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === part.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...part, quantity: 1 }]);
    }
    
    toast.success(`${part.name} added to cart`);
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

  const handlePayment = (method: "cash" | "card") => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    toast.success(`Payment of KES ${getTotalAmount().toLocaleString()} processed via ${method}`);
    
    // Print receipt
    handlePrintReceipt();
    
    // Clear cart
    setCart([]);
    setCustomerName("");
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
            ${customerName ? `<p>Customer: ${customerName}</p>` : ''}
          </div>
          
          ${cart.map(item => `
            <div class="item">
              <span>${item.name} (${item.partNumber})</span>
            </div>
            <div class="item">
              <span>${item.quantity} x KES ${item.price.toLocaleString()}</span>
              <span>KES ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
          
          <div class="item total">
            <span>TOTAL</span>
            <span>KES ${getTotalAmount().toLocaleString()}</span>
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

  const filteredParts = sampleParts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredParts.map((part) => (
                  <div
                    key={part.id}
                    className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-smooth"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{part.name}</h4>
                        <p className="text-sm text-muted-foreground">{part.partNumber}</p>
                      </div>
                      <span className="font-bold text-primary">
                        KES {part.price.toLocaleString()}
                      </span>
                    </div>
                    <Button
                      variant="pos"
                      size="sm"
                      onClick={() => addToCart(part)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name (Optional)</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name..."
                />
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
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      
                      {cart.indexOf(item) < cart.length - 1 && <Separator />}
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>KES {getTotalAmount().toLocaleString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePayment("cash")}
                      className="flex items-center"
                    >
                      <Banknote className="w-4 h-4 mr-2" />
                      Cash
                    </Button>
                    <Button
                      variant="masuma"
                      onClick={() => handlePayment("card")}
                      className="flex items-center"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Card
                    </Button>
                  </div>
                  
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