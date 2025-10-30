import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    // Do not leak secrets; only indicate presence
    hasShopifyApiKey: Boolean(process.env.SHOPIFY_API_KEY),
    hasShopifyApiSecret: Boolean(process.env.SHOPIFY_API_SECRET),
    shopifyAppHostName: process.env.SHOPIFY_APP_URL || null,
    nextauthUrl: process.env.NEXTAUTH_URL || null,
    hasNextauthSecret: Boolean(process.env.NEXTAUTH_SECRET),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    hasSupabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  });
}


