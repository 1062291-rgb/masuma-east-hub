import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Car, Info, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function VinPicker() {
  const [vinNumber, setVinNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVinSearch = async () => {
    if (!vinNumber || vinNumber.length < 17) {
      toast.error("Please enter a valid 17-character VIN");
      return;
    }

    setIsLoading(true);
    
    // Simulate VIN lookup
    setTimeout(() => {
      setIsLoading(false);
      toast.success("VIN decoded successfully!");
    }, 2000);
  };

  return (
    <div className="flex-1 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">VIN Picker</h2>
          <p className="text-muted-foreground">
            Find the exact parts for your vehicle using VIN number
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* VIN Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              VIN Decoder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
              <Input
                id="vin"
                value={vinNumber}
                onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                placeholder="Enter 17-character VIN..."
                maxLength={17}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Characters: {vinNumber.length}/17
              </p>
            </div>

            <Button
              onClick={handleVinSearch}
              disabled={isLoading || vinNumber.length !== 17}
              className="w-full"
              variant="masuma"
              size="lg"
            >
              {isLoading ? (
                "Decoding VIN..."
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Decode VIN
                </>
              )}
            </Button>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 mt-0.5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium mb-1">How to find your VIN:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Dashboard (driver's side, near windshield)</li>
                    <li>• Driver's door jamb</li>
                    <li>• Engine block</li>
                    <li>• Vehicle registration documents</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Masuma VIN Picker Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Masuma VIN Picker</span>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://masuma.ru/#vin-picker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Full Version
                </a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <iframe
                src="https://masuma.ru/#vin-picker"
                className="w-full h-full rounded-lg border-0"
                title="Masuma VIN Picker"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                This embedded VIN picker connects directly to Masuma's database 
                to help you find the exact parts compatible with your vehicle.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information (Sample) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Make & Model</Label>
                <p className="font-medium">Toyota Camry</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Year</Label>
                <p className="font-medium">2019</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Engine</Label>
                <p className="font-medium">2.5L 4-Cylinder</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Transmission</Label>
                <p className="font-medium">8-Speed Automatic</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Drive Type</Label>
                <p className="font-medium">Front Wheel Drive</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Fuel Type</Label>
                <p className="font-medium">Gasoline</p>
              </div>
            </div>

            {/* Compatible Parts */}
            <div className="mt-6">
              <h4 className="font-medium mb-4">Compatible Parts Available</h4>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  "Engine Oil Filter - TOF-2019",
                  "Air Filter - AF-CAM19",
                  "Brake Pads (Front) - BP-CAM19F",
                  "Brake Pads (Rear) - BP-CAM19R",
                  "Spark Plugs (Set of 4) - SP-CAM19",
                  "Transmission Fluid - TF-CAM19"
                ].map((part, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">{part}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}