# Smart-Link Hub - Phase 2 Implementation Handoff

## 🎯 Mission
Continue building the enterprise Smart-Link Hub by implementing **Phase 2: Advanced Analytics & Smart Routing**. Phase 1 (multi-tenant architecture + authentication + UI modernization) is complete and functional.

## ✅ What's Already Done

### Phase 1 Complete
- ✅ **Multi-tenant architecture**: 10 tables, 23 indexes, workspace isolation via `workspaceId` FK
- ✅ **Clerk authentication**: Full SSO integration with middleware protection
- ✅ **Workspace management**: Onboarding flow, role-based access (owner/admin/member/viewer)
- ✅ **Database migrations**: Applied successfully via `npm run db:push`
- ✅ **Modern UI**: Gradient designs, lucide-react icons, StatCard & QRTableRow components
- ✅ **Basic QR generation**: Short codes, iOS/Android routing, destination URLs
- ✅ **Database schema**: Pre-built with fields for all 7 phases (schedules, geofence, languageRoutes JSONB fields ready)

### Tech Stack
```json
{
  "framework": "Next.js 16.1.6 (App Router)",
  "runtime": "React 19.2.3",
  "language": "TypeScript 5",
  "database": "PostgreSQL + Drizzle ORM v0.45.1",
  "auth": "@clerk/nextjs v6.38.1",
  "styling": "Tailwind CSS 4",
  "icons": "lucide-react",
  "qr": "qrcode v1.5.4, html5-qrcode v2.3.8",
  "security": "bcrypt v6.0.0, svix (webhooks)"
}
```

### Database Schema (Relevant Tables for Phase 2)

#### `qr_codes` Table
- **Identity**: `id`, `short_code`, `workspace_id` (FK)
- **URLs**: `destination_url`, `ios_url`, `android_url`
- **Analytics Ready**: `title`, `status` (active/paused/archived)
- **Phase 2 Fields** (READY TO USE):
  - `schedules` (jsonb) - for time-based routing
  - `language_routes` (jsonb) - for language-based routing
  - `geofence` (jsonb) - for geo-based routing (Phase 3, but available)
- **Timestamps**: `created_at`, `updated_at`

#### `scans` Table
- **Identity**: `id`, `qr_code_id` (FK), `workspace_id` (FK)
- **Analytics Data**:
  - `scanned_at` (timestamp) - for time-series charts
  - `user_agent` (text) - for OS/device detection
  - `referrer` (text) - for traffic sources
  - `ip_address` (varchar) - for geolocation lookup
- **Geolocation Fields** (EMPTY - Phase 2 Task):
  - `city`, `region`, `country`, `latitude`, `longitude` (all nullable)
- **UTM Tracking**: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`

### Critical Files

#### Redirect Handler
- **Path**: `app/q/[shortCode]/route.ts`
- **Current Logic**: 
  - OS detection via user-agent
  - Records scan with IP address
  - Redirects to iOS/Android/destination URL
- **Phase 2 TODO**: Add geolocation tracking + time-based routing + language routing

#### Dashboard
- **Path**: `app/dashboard/page.tsx`
- **Current State**: Shows QR list, 3 basic stat cards (total QRs, total scans, active codes)
- **Phase 2 TODO**: Add "View Analytics" button to each QR row, create detailed analytics page

#### Components
- `components/StatCard.tsx` - Reusable metric cards (4 icon types, 4 color schemes)
- `components/QRTableRow.tsx` - Enhanced table rows with copy button, status badges
- `components/CreateQRForm.tsx` - QR generation form with collapsible advanced options

## 🎯 Phase 2 Requirements

### 1. Geolocation Tracking ⭐ PRIORITY
**Goal**: Populate `scans` table geolocation fields using IP address

**Implementation Steps**:
1. Install geolocation API client (recommend: `node-ipinfo` or use native `fetch` with ipapi.co)
2. Update `app/q/[shortCode]/route.ts`:
   ```typescript
   // After recording scan, add geolocation lookup
   const geoResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`);
   const geoData = await geoResponse.json();
   
   await db.update(scans)
     .set({
       city: geoData.city,
       region: geoData.region,
       country: geoData.country_name,
       latitude: geoData.latitude,
       longitude: geoData.longitude,
     })
     .where(eq(scans.id, scanRecord.id));
   ```
3. Handle API rate limits/errors gracefully (don't block redirects)

### 2. Analytics Dashboard Page
**Goal**: Create `/dashboard/analytics/[qrCodeId]` with interactive charts

**Required Libraries**:
```bash
npm install recharts date-fns react-simple-maps
```

**Charts to Build**:
1. **Scans Over Time** (Line Chart)
   - X-axis: Date (grouped by day/week/month)
   - Y-axis: Scan count
   - Use `date-fns` for date formatting
   - Add date range selector (7d, 30d, 90d, All time)

2. **OS Breakdown** (Pie Chart)
   - Parse `user_agent` to detect iOS, Android, Desktop, Other
   - Show percentage distribution
   - Color scheme: iOS (blue), Android (green), Desktop (purple), Other (gray)

3. **Geographic Distribution** (World Map)
   - Use `react-simple-maps` with Natural Earth topojson
   - Plot scan locations as dots sized by scan count
   - Hover tooltip showing city + scan count

4. **Top Locations Table**
   - Aggregate scans by city
   - Show: City, Country, Scan Count, Percentage
   - Limit to top 10

**Page Structure**:
```typescript
// app/dashboard/analytics/[qrCodeId]/page.tsx
export default async function AnalyticsPage({ params }) {
  const { qrCodeId } = await params;
  const workspace = await getCurrentWorkspace();
  
  // Verify QR belongs to workspace
  const qrCode = await db.query.qrCodes.findFirst({
    where: and(eq(qrCodes.id, qrCodeId), eq(qrCodes.workspaceId, workspace.id))
  });
  
  // Fetch scans with time range filter
  const scansData = await db.query.scans.findMany({
    where: eq(scans.qrCodeId, qrCodeId),
    orderBy: desc(scans.scannedAt)
  });
  
  // Return page with charts
}
```

### 3. Time-Based Routing (Smart Scheduling)
**Goal**: Route to different URLs based on time/date

**Database Field**: `qr_codes.schedules` (jsonb)
```json
[
  {
    "days": [1, 2, 3, 4, 5],  // Mon-Fri (0=Sunday, 6=Saturday)
    "startTime": "09:00",
    "endTime": "17:00",
    "url": "https://business-hours-url.com"
  },
  {
    "days": [0, 6],  // Weekends
    "startTime": "00:00",
    "endTime": "23:59",
    "url": "https://weekend-url.com"
  }
]
```

**Implementation**:
- Update `CreateQRForm.tsx` to add schedule builder UI
- Update `app/q/[shortCode]/route.ts` to check schedules before redirecting
- Use server timezone or detect user timezone from request headers

### 4. Language-Based Routing
**Goal**: Route based on browser language preference

**Database Field**: `qr_codes.language_routes` (jsonb)
```json
{
  "en": "https://english-site.com",
  "es": "https://spanish-site.com",
  "fr": "https://french-site.com",
  "default": "https://fallback-site.com"
}
```

**Implementation**:
- Parse `Accept-Language` header in redirect route
- Match language codes (support en-US → en fallback)
- Update `CreateQRForm.tsx` with language route inputs

### 5. Enhanced Dashboard Integration
**Updates Needed**:
1. Add "View Analytics" button to `QRTableRow.tsx`:
   ```tsx
   <Link href={`/dashboard/analytics/${qrCode.id}`}>
     <Button variant="ghost" size="sm">
       <BarChart3 className="w-4 h-4 mr-1" />
       Analytics
     </Button>
   </Link>
   ```

2. Add quick stats preview in QRTableRow:
   - Show total scans count inline
   - Maybe last scanned timestamp

3. Update dashboard stat cards:
   - Replace static calculations with real aggregations
   - Add trend indicators (% change from previous period)

## 🐛 Known UI Issues to Fix

### 1. Mobile Responsiveness
- Dashboard table overflows on mobile (needs horizontal scroll or card layout)
- CreateQRForm advanced options need better mobile spacing
- Hero section on homepage needs stacked layout on small screens

### 2. Loading States
- Add skeleton loaders to dashboard while fetching QR codes
- Add loading state to analytics page charts

### 3. Empty States
- Improve empty QR list message with better call-to-action
- Add empty state for analytics when no scans exist

### 4. Error Handling
- Add toast notifications for copy-to-clipboard success/failure
- Display error messages when QR generation fails
- Handle geolocation API failures gracefully

## 📋 Implementation Checklist

### Phase 2 Core Features
- [ ] Install analytics libraries: `npm install recharts date-fns react-simple-maps`
- [ ] Implement geolocation tracking in redirect route
- [ ] Create analytics page at `app/dashboard/analytics/[qrCodeId]/page.tsx`
- [ ] Build Scans Over Time line chart component
- [ ] Build OS Breakdown pie chart component
- [ ] Build Geographic Distribution map component
- [ ] Build Top Locations table component
- [ ] Add time-based routing logic to redirect handler
- [ ] Create schedule builder UI in CreateQRForm
- [ ] Add language-based routing logic to redirect handler
- [ ] Create language route inputs in CreateQRForm
- [ ] Add "View Analytics" button to QRTableRow
- [ ] Update dashboard stats with trend indicators

### UI Improvements
- [ ] Fix mobile responsiveness for dashboard table
- [ ] Add skeleton loaders to dashboard
- [ ] Add skeleton loaders to analytics page
- [ ] Improve empty states with better CTAs
- [ ] Add toast notification system (consider `sonner` library)
- [ ] Test all flows on mobile viewport

### Testing & Polish
- [ ] Test geolocation with VPN/different IPs
- [ ] Test time-based routing across timezones
- [ ] Test language routing with different Accept-Language headers
- [ ] Verify all charts render correctly with various data volumes
- [ ] Check analytics performance with 10k+ scans

## 🚀 Getting Started Commands

```bash
# Install Phase 2 dependencies
npm install recharts date-fns react-simple-maps

# Optional: Toast notifications
npm install sonner

# Run development server
npm run dev

# Check for TypeScript errors
npx tsc --noEmit
```

## 📁 Key Files to Modify

### High Priority
1. `app/q/[shortCode]/route.ts` - Add geolocation + routing logic
2. `app/dashboard/analytics/[qrCodeId]/page.tsx` - CREATE NEW
3. `components/CreateQRForm.tsx` - Add schedule/language inputs
4. `components/QRTableRow.tsx` - Add analytics button

### Medium Priority
5. `app/dashboard/page.tsx` - Update stat cards with trends
6. `components/charts/` - CREATE NEW directory for chart components
7. `lib/analytics.ts` - CREATE NEW for analytics utilities
8. `lib/routing.ts` - CREATE NEW for smart routing logic

## 🎨 Design System (Established)
- **Colors**: Blue gradient (blue-500 to purple-600), green (success), orange (warning)
- **Icons**: lucide-react (already installed)
- **Spacing**: Tailwind defaults, rounded-xl for cards
- **Shadows**: shadow-lg for elevated components
- **Animation**: hover:scale-105 for interactive elements

## 📊 Success Criteria
- [ ] Geolocation data populates for all new scans
- [ ] Analytics page loads in <2 seconds with 1000 scans
- [ ] Charts are interactive and visually appealing
- [ ] Time-based routing redirects correctly based on server time
- [ ] Language routing falls back gracefully when language not configured
- [ ] Mobile UI is fully functional and responsive
- [ ] No TypeScript errors
- [ ] No console errors in browser

## 🔗 Documentation References
- Phase 1 Summary: `PHASE_1_SUMMARY.md`
- Setup Guide: `SETUP.md`
- Database Schema: `db/schema.ts` (lines 1-150)
- Original Requirements: See conversation history for 7-phase roadmap

## ⚠️ Important Notes

1. **Next.js 16 Breaking Change**: Params are now Promises - always `await params`
2. **Workspace Isolation**: ALWAYS filter by `workspace_id` in all queries
3. **Performance**: Use indexes (already created) for scan aggregations
4. **API Rate Limits**: ipapi.co free tier = 1000 requests/day, handle gracefully
5. **Timezone Awareness**: Server runs in UTC, consider user timezone for scheduling

## 💡 Bonus Ideas (If Time Permits)
- Real-time analytics with WebSocket updates
- Export analytics to PDF
- Scan heatmap by hour of day
- Device type breakdown (mobile vs desktop vs tablet)
- Custom date range picker for charts
- Comparison mode (compare two QR codes side-by-side)

---

**Last Updated**: February 23, 2026  
**Handoff From**: Phase 1 completion + UI modernization  
**Handoff To**: Phase 2 analytics implementation
