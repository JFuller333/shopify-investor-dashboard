import { NextApiRequest, NextApiResponse } from 'next';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';

// Initialize Shopify API
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: ['read_products', 'read_orders', 'read_customers', 'read_inventory'],
  hostName: process.env.SHOPIFY_APP_URL!,
  apiVersion: ApiVersion.October23,
  isEmbeddedApp: true,
  sessionStorage: new MemorySessionStorage(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shop } = req.query;

  if (!shop) {
    return res.status(400).json({ error: 'Shop parameter is required' });
  }

  try {
    // Create OAuth URL
    const authRoute = await shopify.auth.begin({
      shop: shop as string,
      callbackPath: '/api/auth/shopify/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });

    // Redirect to Shopify OAuth
    res.redirect(authRoute);
  } catch (error) {
    console.error('Shopify auth error:', error);
    res.status(500).json({ error: 'Failed to initiate Shopify authentication' });
  }
}
