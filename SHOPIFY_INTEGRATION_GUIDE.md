# Shopify Integration Guide

## Current Status ✅

Your Next.js app is already set up for Shopify integration with:

- **API Routes**: OAuth authentication and data fetching
- **Frontend Components**: Shopify management interface
- **Project Types**: Shopify option in create/edit modals

## How to Connect Shopify Data to Your Dashboard

### 1. Environment Setup

First, set up your Shopify app credentials in Vercel:

```bash
# In Vercel dashboard, add these environment variables:
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_APP_URL=https://your-app.vercel.app
```

### 2. Shopify App Configuration

1. **Create a Shopify App**:
   - Go to [Shopify Partners](https://partners.shopify.com/)
   - Create a new app
   - Set App URL: `https://your-app.vercel.app`
   - Set Allowed redirection URL: `https://your-app.vercel.app/api/auth/shopify/callback`

2. **Configure Scopes**:
   - `read_products` - To fetch product data
   - `read_orders` - To fetch order data
   - `read_customers` - To fetch customer data
   - `read_inventory` - To fetch inventory data

### 3. Connect Shopify Data to Projects

#### Option A: Manual Connection (Current)
- Users can select "Shopify Store" when creating projects
- Enter their Shopify store URL
- Data is fetched when the project is created

#### Option B: Automatic Integration (Recommended)
- Add a "Connect Shopify" button to the dashboard
- Users authenticate once and all projects can access their store data
- Real-time data updates

### 4. Data Flow

```
Shopify Store → OAuth → Your App → Dashboard
     ↓              ↓         ↓        ↓
  Products    Authentication  API   Project Cards
  Orders      Session Mgmt   Routes   Real Data
  Customers   Data Storage   Fetch    Live Updates
```

### 5. Implementation Steps

#### Step 1: Add Shopify Connection to Dashboard

Add this to your dashboard header:

```tsx
// In pages/donor-dashboard.tsx or pages/investor-dashboard.tsx
const [shopifyConnected, setShopifyConnected] = useState(false);
const [shopifyStore, setShopifyStore] = useState(null);

const connectShopify = () => {
  // Redirect to Shopify OAuth
  window.location.href = `/api/auth/shopify?shop=${shopifyStore}`;
};

const fetchShopifyData = async () => {
  if (shopifyStore) {
    const response = await fetch(`/api/shopify/products?shop=${shopifyStore}`);
    const data = await response.json();
    // Use this data to populate project cards
  }
};
```

#### Step 2: Enhance Project Cards with Shopify Data

```tsx
// Add to project card rendering
{project.shopifyData && (
  <div className="shopify-data">
    <p>Live from Shopify: {project.shopifyData.title}</p>
    <p>Price: ${project.shopifyData.price}</p>
    <p>Inventory: {project.shopifyData.inventory}</p>
  </div>
)}
```

#### Step 3: Real-time Updates

```tsx
// Add to dashboard component
useEffect(() => {
  const interval = setInterval(() => {
    if (shopifyConnected) {
      fetchShopifyData();
    }
  }, 30000); // Update every 30 seconds

  return () => clearInterval(interval);
}, [shopifyConnected]);
```

### 6. Advanced Features

#### A. Product Sync
- Automatically create projects from Shopify products
- Sync inventory levels with project progress
- Update project status based on product availability

#### B. Order Integration
- Show recent orders in project cards
- Calculate project success based on sales
- Display customer feedback and reviews

#### C. Analytics Dashboard
- Revenue tracking from Shopify
- Conversion rates
- Customer acquisition costs
- ROI calculations

### 7. Testing Your Integration

1. **Local Testing**:
   ```bash
   # Use ngrok to expose your local server
   ngrok http 3000
   # Use the ngrok URL as your Shopify app URL
   ```

2. **Production Testing**:
   - Deploy to Vercel
   - Test with a real Shopify store
   - Verify OAuth flow works
   - Check data fetching

### 8. Security Considerations

- Store Shopify access tokens securely
- Implement proper session management
- Use HTTPS for all communications
- Validate all incoming data
- Implement rate limiting

### 9. Next Steps

1. **Set up your Shopify app** with the credentials above
2. **Deploy to Vercel** with environment variables
3. **Test the OAuth flow** with a real store
4. **Enhance the dashboard** with live Shopify data
5. **Add real-time updates** for better user experience

## Example Implementation

Here's how to add a "Connect Shopify" button to your dashboard:

```tsx
// Add this to your dashboard header
<div className="flex items-center gap-4">
  {!shopifyConnected ? (
    <Button onClick={connectShopify}>
      <Store className="h-4 w-4 mr-2" />
      Connect Shopify
    </Button>
  ) : (
    <div className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <span className="text-sm">Connected to {shopifyStore}</span>
    </div>
  )}
</div>
```

This will give you a fully functional Shopify integration that connects real store data to your investment/donation dashboard!
