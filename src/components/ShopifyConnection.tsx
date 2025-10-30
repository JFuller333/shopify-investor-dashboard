import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShopifyConnectionProps {
  onConnect: (storeUrl: string) => void;
  onDisconnect: () => void;
  connected: boolean;
  storeUrl?: string;
}

export const ShopifyConnection: React.FC<ShopifyConnectionProps> = ({
  onConnect,
  onDisconnect,
  connected,
  storeUrl
}) => {
  const [inputStoreUrl, setInputStoreUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!inputStoreUrl) {
      toast({
        title: "Store URL Required",
        description: "Please enter your Shopify store URL",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Clean up the store URL
      let cleanUrl = inputStoreUrl.trim();
      if (!cleanUrl.includes('.')) {
        cleanUrl = `${cleanUrl}.myshopify.com`;
      }
      if (!cleanUrl.startsWith('http')) {
        cleanUrl = `https://${cleanUrl}`;
      }

      // Test the connection
      const testResponse = await fetch(`/api/shopify/products?shop=${cleanUrl}`);
      
      if (testResponse.ok) {
        onConnect(cleanUrl);
        toast({
          title: "Success!",
          description: "Successfully connected to your Shopify store",
        });
      } else {
        throw new Error("Failed to connect to store");
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to the Shopify store. Please check your URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
    setInputStoreUrl("");
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Shopify store",
    });
  };

  const openShopifyStore = () => {
    if (storeUrl) {
      window.open(storeUrl, '_blank');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Shopify Integration
        </CardTitle>
        <CardDescription>
          Connect your Shopify store to sync real product and sales data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-url">Store URL</Label>
              <Input
                id="store-url"
                placeholder="your-store.myshopify.com"
                value={inputStoreUrl}
                onChange={(e) => setInputStoreUrl(e.target.value)}
                disabled={isConnecting}
              />
              <p className="text-xs text-muted-foreground">
                Enter your Shopify store URL (e.g., your-store.myshopify.com)
              </p>
            </div>
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Store className="h-4 w-4 mr-2" />
                  Connect Store
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Connected</p>
                <p className="text-xs text-green-600">{storeUrl}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openShopifyStore}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Store
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="flex-1"
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>What this enables:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Real product data in your projects</li>
            <li>Live inventory tracking</li>
            <li>Sales performance metrics</li>
            <li>Customer order data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
