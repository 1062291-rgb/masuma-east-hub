import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Search,
  Settings,
  Users,
  CreditCard,
  Truck,
  BarChart3,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "POS", href: "/pos", icon: CreditCard },
  { name: "VIN Picker", href: "/vin-picker", icon: Search },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gradient">MASUMA</h2>
            <p className="text-xs text-muted-foreground">East Africa</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth text-sm",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Branch & Currency Selector */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <select className="w-full p-2 text-sm bg-input border border-border rounded-md text-foreground">
            <option>Nairobi Branch</option>
            <option>Kampala Branch</option>
            <option>Dar es Salaam Branch</option>
          </select>
          <select className="w-full p-2 text-sm bg-input border border-border rounded-md text-foreground">
            <option>KES - Kenyan Shilling</option>
            <option>UGX - Uganda Shilling</option>
            <option>TZS - Tanzania Shilling</option>
            <option>USD - US Dollar</option>
          </select>
        </div>
      </div>
    </div>
  );
}