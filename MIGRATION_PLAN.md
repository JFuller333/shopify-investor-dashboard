# Headless Dashboard Migration Plan
## Converting from Next.js Admin App to Remix/Hydrogen-style Headless Dashboard

---

## 📋 **Phase 1: Foundation & Setup** ⏱️ ~3-5 days

### Goal: Set up new project structure alongside existing app

**Tasks:**
1. ✅ Create new Remix project structure
   - Initialize Remix app with TypeScript
   - Set up Tailwind CSS (copy existing config)
   - Configure path aliases (`@/components`, `@/lib`, etc.)

2. ✅ Set up Shopify Admin API service layer
   - Create `app/services/shopify-admin.ts`
   - Set up GraphQL client for Admin API
   - Create base query/mutation utilities
   - Environment variables setup

3. ✅ Copy shared utilities
   - Copy `lib/utils.ts`
   - Copy icon mappings
   - Copy helper functions

4. ✅ Set up UI component library
   - Copy all Radix UI components from `src/components/ui/`
   - Ensure Tailwind config matches exactly

**Deliverable:** New Remix project with Shopify Admin API service layer ready

**No changes to existing app** - This is parallel setup

---

## 📦 **Phase 2: Component Migration** ⏱️ ~5-7 days

### Goal: Migrate all React components with zero style changes

**Tasks:**
1. ✅ Migrate core components
   - `ProjectCard.tsx` → `app/components/ProjectCard.tsx`
   - `Layout.tsx` → `app/components/Layout.tsx`
   - `StatCard.tsx` → `app/components/StatCard.tsx`
   - `ROICalculator.tsx` → `app/components/ROICalculator.tsx`

2. ✅ Migrate modal components
   - `CreateProjectModal.tsx`
   - `EditProjectModal.tsx`

3. ✅ Test component rendering
   - Verify Tailwind classes work identically
   - Check responsive behavior
   - Verify all Radix UI components function

4. ✅ Create component story pages
   - Simple test pages to verify component rendering
   - No data integration yet

**Deliverable:** All components migrated and visually verified identical

**Still no changes to existing app** - Building in parallel

---

## 🔌 **Phase 3: Data Layer Integration** ⏱️ ~7-10 days

### Goal: Replace Next.js API routes with Shopify Admin API calls

**Tasks:**
1. ✅ Analyze current API routes
   - Document what each route does
   - Map to Shopify Admin API queries

2. ✅ Create Shopify Admin API queries
   - Products query (replace `/api/shopify/products`)
   - Orders query (replace `/api/shopify/orders`)
   - Customers query (if needed)

3. ✅ Create Remix loaders/actions
   - `app/routes/investor-dashboard.tsx` loader
   - `app/routes/donor-dashboard.tsx` loader
   - `app/routes/project.$id.tsx` loader
   - Actions for create/edit/delete

4. ✅ Implement data fetching hooks
   - Use Remix's `useLoaderData`
   - Replace `useEffect` + `fetch` patterns
   - Handle loading states

5. ✅ Test data flow
   - Verify data fetching works
   - Test CRUD operations
   - Handle error states

**Deliverable:** Data layer fully functional with Shopify Admin API

---

## 🔐 **Phase 4: Authentication Implementation** ⏱️ ~5-7 days

### Goal: Implement Shopify authentication (OAuth or Private App)

**Tasks:**
1. ✅ Choose authentication method
   - **Option A:** Private App (simpler, single store)
   - **Option B:** OAuth App (multi-store support)
   - **Option C:** App Bridge (if embedding in Shopify admin)

2. ✅ Implement authentication flow
   - Create auth routes in Remix
   - Handle OAuth callback (if using OAuth)
   - Store session/tokens securely

3. ✅ Create authentication utilities
   - Token management
   - Session validation
   - Protected route wrapper

4. ✅ Update API service layer
   - Add authentication headers
   - Handle token refresh
   - Error handling for auth failures

5. ✅ Test authentication flow
   - Test login/logout
   - Test token expiration
   - Test protected routes

**Deliverable:** Complete authentication system working

---

## 🗺️ **Phase 5: Routing & Pages Migration** ⏱️ ~7-10 days

### Goal: Migrate all pages and routing from Next.js to Remix

**Tasks:**
1. ✅ Migrate dashboard pages
   - `investor-dashboard.tsx` → `app/routes/investor-dashboard.tsx`
   - `donor-dashboard.tsx` → `app/routes/donor-dashboard.tsx`
   - Update routing logic

2. ✅ Migrate project pages
   - `project/[id].tsx` → `app/routes/project.$id.tsx`
   - Update dynamic routing
   - Test navigation

3. ✅ Migrate other pages
   - `profile.tsx`
   - `shopify-management.tsx`
   - `auth.tsx`
   - Any other pages

4. ✅ Update navigation
   - Update all `Link` components
   - Update all `useRouter` calls to Remix navigation
   - Test all navigation flows

5. ✅ Migrate forms and actions
   - Convert form submissions to Remix actions
   - Handle redirects
   - Handle errors

6. ✅ Integrate components with data
   - Connect migrated components to new data layer
   - Test full user flows

**Deliverable:** All pages migrated and fully functional

---

## 🚀 **Phase 6: Deployment & Optimization** ⏱️ ~5-7 days

### Goal: Deploy to Oxygen and optimize for production

**Tasks:**
1. ✅ Prepare for Oxygen deployment
   - Configure Shopify App settings
   - Set up environment variables
   - Configure build process

2. ✅ Deploy to Oxygen
   - Initial deployment
   - Test production build
   - Verify all functionality

3. ✅ Optimize performance
   - Add edge caching where appropriate
   - Optimize bundle size
   - Add loading states

4. ✅ Final testing
   - End-to-end testing
   - Test all user flows
   - Performance testing

5. ✅ Migration cutover
   - Switch DNS/hosting (if needed)
   - Monitor for issues
   - Rollback plan ready

6. ✅ Cleanup
   - Archive old Next.js codebase
   - Update documentation
   - Team training

**Deliverable:** Fully deployed, production-ready headless dashboard

---

## 📊 **Timeline Summary**

| Phase | Duration | Risk Level | Dependencies |
|-------|----------|------------|--------------|
| Phase 1: Foundation | 3-5 days | Low | None |
| Phase 2: Components | 5-7 days | Low | Phase 1 |
| Phase 3: Data Layer | 7-10 days | Medium | Phase 1, 2 |
| Phase 4: Authentication | 5-7 days | Medium | Phase 1 |
| Phase 5: Routing & Pages | 7-10 days | Medium | Phases 2, 3, 4 |
| Phase 6: Deployment | 5-7 days | Low | All phases |

**Total Estimated Time: 6-8 weeks**

---

## 🎯 **Success Criteria**

Each phase is considered complete when:
- ✅ All tasks completed
- ✅ Tests passing
- ✅ Code reviewed
- ✅ Documentation updated
- ✅ No regressions in existing functionality (where applicable)

---

## 🔄 **Parallel Development Strategy**

- **Phases 1-2:** Can run in parallel with current app (zero impact)
- **Phase 3:** Can test with mock data first
- **Phase 4:** Independent of other features
- **Phase 5:** Requires previous phases
- **Phase 6:** Final integration

---

## 🛠️ **Tools & Resources Needed**

1. Remix documentation
2. Shopify Admin API documentation
3. GraphQL Admin API reference
4. Oxygen deployment docs
5. Testing framework (Vitest/Playwright)

---

## 📝 **Notes**

- Keep existing Next.js app running during migration
- Can deploy Remix app to separate URL for testing
- Rollback plan: Keep Next.js app until Remix is fully tested
- No downtime expected during migration

