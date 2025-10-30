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

  const { shop, code, state } = req.query;

  if (!shop || !code) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Complete OAuth flow
    const session = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    if (!session) {
      return res.status(400).json({ error: 'Failed to create session' });
    }

    // Store session data (in production, use a proper database)
    // For now, we'll redirect with success
    const redirectUrl = `${process.env.SHOPIFY_APP_URL}/dashboard?shop=${shop}&installed=true`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Shopify callback error:', error);
    res.status(500).json({ error: 'Failed to complete Shopify authentication' });
  }
}
