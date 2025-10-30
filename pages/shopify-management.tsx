import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShopifyConnection } from "@/components/ShopifyConnection";
import { Store, Package, ShoppingCart, Users, TrendingUp, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShopifyData {
  products: any[];
  orders: any[];
  customers: any[];
}

export default function ShopifyManagement() {
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [shopifyStoreUrl, setShopifyStoreUrl] = useState<string | null>(null);
  const [shopifyData, setShopifyData] = useState<ShopifyData>({
    products: [],
    orders: [],
    customers: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load Shopify connection on component mount
  useEffect(() => {
    const shopifyConnection = localStorage.getItem('shopify-connection');
    if (shopifyConnection) {
      try {
        const { connected, storeUrl } = JSON.parse(shopifyConnection);
        setShopifyConnected(connected);
        setShopifyStoreUrl(storeUrl);
        if (connected && storeUrl) {
          fetchShopifyData(storeUrl);
        }
      } catch (error) {
        console.error('Error loading Shopify connection:', error);
      }
    }
  }, []);

  const handleShopifyConnect = (storeUrl: string) => {
    setShopifyConnected(true);
    setShopifyStoreUrl(storeUrl);
    localStorage.setItem('shopify-connection', JSON.stringify({ connected: true, storeUrl }));
    fetchShopifyData(storeUrl);
    toast({
      title: "Success!",
      description: "Successfully connected to your Shopify store",
    });
  };

  const handleShopifyDisconnect = () => {
    setShopifyConnected(false);
    setShopifyStoreUrl(null);
    setShopifyData({ products: [], orders: [], customers: [] });
    localStorage.removeItem('shopify-connection');
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Shopify store",
    });
  };

  const fetchShopifyData = async (storeUrl: string) => {
    setIsLoading(true);
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch(`/api/shopify/products?shop=${storeUrl}`),
        fetch(`/api/shopify/orders?shop=${storeUrl}`)
      ]);

      const productsData = productsResponse.ok ? await productsResponse.json() : { products: [] };
      const ordersData = ordersResponse.ok ? await ordersResponse.json() : { orders: [] };

      setShopifyData({
        products: productsData.products || [],
        orders: ordersData.orders || [],
        customers: [] // Would need a separate API endpoint for customers
      });
    } catch (error) {
      console.error('Error fetching Shopify data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data from Shopify store",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    if (shopifyStoreUrl) {
      fetchShopifyData(shopifyStoreUrl);
    }
  };

  const openShopifyStore = () => {
    if (shopifyStoreUrl) {
      window.open(`https://${shopifyStoreUrl}`, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Shopify Management</h1>
        <p className="text-muted-foreground">Connect and manage your Shopify store integration</p>
        {shopifyConnected && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button
              variant="outline"
              onClick={openShopifyStore}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Store
            </Button>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="flex justify-center">
        <div className="w-full max-w-md space-y-4">
          <ShopifyConnection
            onConnect={handleShopifyConnect}
            onDisconnect={handleShopifyDisconnect}
            connected={shopifyConnected}
            storeUrl={shopifyStoreUrl || undefined}
          />

          {shopifyConnected && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Status
                </CardTitle>
                <CardDescription>Your Shopify store connection details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Connected</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Store URL:</p>
                  <p className="text-muted-foreground">{shopifyStoreUrl}</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Last Updated:</p>
                  <p className="text-muted-foreground">{new Date().toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Data Overview */}
      {shopifyConnected && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopifyData.products.length}</div>
              <p className="text-xs text-muted-foreground">Total products in store</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopifyData.orders.length}</div>
              <p className="text-xs text-muted-foreground">Recent orders fetched</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${shopifyData.orders.reduce((sum, order) => sum + parseFloat(order.totalPrice?.amount || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total from recent orders</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products List */}
      {shopifyConnected && shopifyData.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Latest products from your Shopify store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shopifyData.products.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                    {product.variants?.[0]?.price && (
                      <span className="text-sm font-medium">
                        ${product.variants[0].price}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {shopifyConnected && shopifyData.orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your Shopify store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shopifyData.orders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Order #{order.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer?.displayName || 'Guest Customer'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${order.totalPrice?.amount} {order.totalPrice?.currencyCode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.lineItems?.[0]?.title || 'Multiple items'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {shopifyConnected && shopifyData.products.length === 0 && shopifyData.orders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground mb-4">
              Your store is connected but no products or orders were found. This might be because:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your store doesn't have any products yet</li>
              <li>• The API permissions need to be updated</li>
              <li>• There was an error fetching the data</li>
            </ul>
            <Button onClick={refreshData} className="mt-4" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
