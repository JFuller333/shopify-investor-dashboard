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
    // Get session (in production, retrieve from database)
    const sessionStorage = new MemorySessionStorage();
    const session = await sessionStorage.loadSession(`offline_${shop}`);
    
    if (!session) {
      return res.status(401).json({ error: 'No valid session found' });
    }

    // Create GraphQL client
    const client = new shopify.clients.Graphql({ session });

    // Query products
    const response = await client.query({
      data: {
        query: `
          query getProducts($first: Int!) {
            products(first: $first) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  vendor
                  productType
                  createdAt
                  updatedAt
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                  variants(first: 10) {
                    edges {
                      node {
                        id
                        title
                        price
                        compareAtPrice
                        inventoryQuantity
                        sku
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          first: 50
        }
      }
    });

    const responseData = response.body as any;
    const products = responseData?.data?.products?.edges?.map((edge: any) => edge.node) || [];

    res.status(200).json({ products });
  } catch (error) {
    console.error('Shopify products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
