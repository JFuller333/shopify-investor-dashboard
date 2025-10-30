# Shopify Integration Setup Guide

This Next.js application now includes full Shopify integration for authentication and data access.

## 🚀 Features

- **Shopify OAuth Authentication**: Secure login with Shopify stores
- **Product Management**: View and manage Shopify products
- **Order Tracking**: Monitor recent orders and customer data
- **Real-time Data**: Live updates from your Shopify store
- **Professional UI**: Clean, modern interface matching your theme

## 📋 Prerequisites

1. **Shopify Partner Account**: Create a [Shopify Partner account](https://partners.shopify.com/)
2. **Shopify App**: Create a new app in your Partner dashboard
3. **Vercel Account**: For deployment (already configured)

## 🔧 Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Shopify App Configuration
SHOPIFY_API_KEY=your_shopify_api_key_here
SHOPIFY_API_SECRET=your_shopify_api_secret_here
SHOPIFY_APP_URL=https://your-app-domain.vercel.app

# Supabase Configuration (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXTAUTH_URL=https://your-app-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 🛠️ Shopify App Setup

### 1. Create Shopify App

1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Click "Apps" → "Create app"
3. Choose "Public app" or "Custom app"
4. Fill in app details:
   - **App name**: Your app name
   - **App URL**: `https://your-app-domain.vercel.app`
   - **Allowed redirection URL(s)**: `https://your-app-domain.vercel.app/api/auth/shopify/callback`

### 2. Configure App Settings

In your Shopify app settings:

1. **App URL**: `https://your-app-domain.vercel.app`
2. **Allowed redirection URL(s)**: 
   - `https://your-app-domain.vercel.app/api/auth/shopify/callback`
3. **App proxy**: Not needed for this setup
4. **Webhooks**: Optional (can be added later)

### 3. Get API Credentials

1. Go to "App setup" in your Shopify app
2. Copy the **API key** and **API secret key**
3. Add these to your `.env.local` file

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all the environment variables from `.env.local`

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Update Shopify App URLs

After deployment, update your Shopify app settings with the actual Vercel URL:

1. **App URL**: `https://your-app-name.vercel.app`
2. **Allowed redirection URL(s)**: `https://your-app-name.vercel.app/api/auth/shopify/callback`

## 📱 Usage

### 1. Access Shopify Integration

- Navigate to `/shopify` in your app
- Enter your Shopify store domain (e.g., `mystore.myshopify.com`)
- Click "Connect Store"

### 2. OAuth Flow

1. Click "Connect Store" → Redirects to Shopify OAuth
2. Grant permissions to your app
3. Redirects back to your app with store connected
4. View products, orders, and analytics

### 3. API Endpoints

The following API endpoints are available:

- `GET /api/auth/shopify?shop=STORE_DOMAIN` - Initiate OAuth
- `GET /api/auth/shopify/callback` - OAuth callback
- `GET /api/shopify/products?shop=STORE_DOMAIN` - Get products
- `GET /api/shopify/orders?shop=STORE_DOMAIN` - Get orders

## 🔒 Security Notes

- **Session Storage**: Currently using in-memory storage (not suitable for production)
- **Database**: Consider using a proper database for session storage in production
- **HTTPS**: Required for Shopify OAuth (automatically handled by Vercel)
- **API Keys**: Keep your API keys secure and never commit them to version control

## 🐛 Troubleshooting

### Common Issues

1. **"No valid session found"**:
   - Ensure the store domain is correct
   - Check if OAuth was completed successfully
   - Verify API credentials

2. **"Failed to initiate Shopify authentication"**:
   - Check SHOPIFY_API_KEY and SHOPIFY_API_SECRET
   - Verify SHOPIFY_APP_URL matches your deployed URL

3. **CORS errors**:
   - Ensure your Shopify app URLs are correctly configured
   - Check that your app is deployed and accessible

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
DEBUG=shopify:*
```

## 📚 Next Steps

1. **Database Integration**: Replace in-memory session storage with a database
2. **Webhooks**: Add Shopify webhooks for real-time updates
3. **Advanced Features**: Add inventory management, customer analytics
4. **Recharge Integration**: Connect with Recharge for subscription management

## 🆘 Support

- [Shopify API Documentation](https://shopify.dev/api)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
