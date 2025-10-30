import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, ShoppingCart, TrendingUp, ExternalLink } from 'lucide-react';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  createdAt: string;
  updatedAt: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: string;
        compareAtPrice: string;
        inventoryQuantity: number;
        sku: string;
      };
    }>;
  };
}

interface ShopifyOrder {
  id: string;
  name: string;
  createdAt: string;
  totalPrice: string;
  currencyCode: string;
  financialStatus: string;
  fulfillmentStatus: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        quantity: number;
        originalUnitPrice: string;
        discountedUnitPrice: string;
        variant: {
          id: string;
          title: string;
          sku: string;
        };
      };
    }>;
  };
}

interface ShopifyIntegrationProps {
  shop?: string;
}

export const ShopifyIntegration = ({ shop }: ShopifyIntegrationProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShopifyData = async () => {
    if (!shop) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch products and orders in parallel
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch(`/api/shopify/products?shop=${shop}`),
        fetch(`/api/shopify/orders?shop=${shop}`)
      ]);

      if (!productsResponse.ok || !ordersResponse.ok) {
        throw new Error('Failed to fetch Shopify data');
      }

      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();

      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const initiateShopifyAuth = () => {
    if (!shop) {
      setError('Please enter a shop domain');
      return;
    }
    
    // Redirect to Shopify OAuth
    window.location.href = `/api/auth/shopify?shop=${shop}`;
  };

  useEffect(() => {
    if (shop) {
      fetchShopifyData();
    }
  }, [shop]);

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(parseFloat(amount));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      'PAID': { variant: 'default', label: 'Paid' },
      'PENDING': { variant: 'secondary', label: 'Pending' },
      'PARTIALLY_PAID': { variant: 'outline', label: 'Partial' },
      'REFUNDED': { variant: 'destructive', label: 'Refunded' },
      'FULFILLED': { variant: 'default', label: 'Fulfilled' },
      'UNFULFILLED': { variant: 'secondary', label: 'Unfulfilled' },
    };

    const config = statusMap[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!shop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shopify Integration
          </CardTitle>
          <CardDescription>
            Connect your Shopify store to track products and orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Shopify store domain to get started (e.g., mystore.myshopify.com)
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Connect Shopify Store
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shopify Store: {shop}
          </CardTitle>
          <CardDescription>
            Connected to your Shopify store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={fetchShopifyData} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh Data
            </Button>
            <Button variant="outline" onClick={() => window.open(`https://${shop}/admin`, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Shopify Admin
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Products Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold truncate">{product.title}</h4>
                      <p className="text-sm text-muted-foreground">{product.vendor}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{product.productType}</Badge>
                        <span className="text-sm font-medium">
                          {product.variants.edges.length} variant{product.variants.edges.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No products found</p>
          )}
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{order.name}</span>
                          {getStatusBadge(order.financialStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.customer.firstName} {order.customer.lastName} • {order.customer.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(order.totalPrice, order.currencyCode)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.lineItems.edges.length} item{order.lineItems.edges.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No orders found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
