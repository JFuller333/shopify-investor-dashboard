import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ShopifyIntegration } from '@/components/ShopifyIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Package, Store } from 'lucide-react';

const ShopifyPage = () => {
  const [shopDomain, setShopDomain] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    if (shopDomain) {
      setIsConnected(true);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShopDomain('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Shopify Integration</h1>
        </div>

        {!isConnected ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Connect Your Shopify Store
              </CardTitle>
              <CardDescription>
                Connect your Shopify store to track products, orders, and analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shop-domain">Shop Domain</Label>
                <Input
                  id="shop-domain"
                  placeholder="mystore.myshopify.com"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter your Shopify store domain (e.g., mystore.myshopify.com)
                </p>
              </div>
              <Button onClick={handleConnect} disabled={!shopDomain}>
                Connect Store
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Connected Store</h2>
                <p className="text-muted-foreground">{shopDomain}</p>
              </div>
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
            <ShopifyIntegration shop={shopDomain} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShopifyPage;
