import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const recentSales = [
  {
    id: "1",
    customer: "John Mwangi",
    email: "john@example.com",
    amount: "KES 15,240",
    items: "Brake Pads, Oil Filter",
  },
  {
    id: "2",
    customer: "Sarah Nakato",
    email: "sarah@example.com",
    amount: "KES 8,560",
    items: "Air Filter, Spark Plugs",
  },
  {
    id: "3",
    customer: "Mike Ochieng",
    email: "mike@example.com",
    amount: "KES 22,180",
    items: "Transmission Oil, Clutch Kit",
  },
  {
    id: "4",
    customer: "Grace Wanjiku",
    email: "grace@example.com",
    amount: "KES 5,750",
    items: "Wiper Blades, Coolant",
  },
];

export default function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {sale.customer.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.customer}</p>
                <p className="text-sm text-muted-foreground">{sale.items}</p>
              </div>
              <div className="ml-auto font-medium">{sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}