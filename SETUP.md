# Smart-Link Hub - Setup Guide

## Phase 1: Multi-Tenant Authentication & Foundation ✅

This guide will help you set up the enterprise Smart-Link Hub platform with Clerk authentication and multi-tenant workspace management.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Git installed

## Step 1: Install Dependencies

Dependencies have already been installed. If you need to reinstall:

```bash
npm install
```

## Step 2: Set Up Clerk Authentication

### 2.1 Create Clerk Account

1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Sign up for a free account
3. Create a new application
4. Choose "Email" and "Password" as authentication methods (you can add more later)

### 2.2 Get Your Clerk Keys

1. In the Clerk dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_...`)
3. Copy your **Secret Key** (starts with `sk_test_...`)

### 2.3 Configure Environment Variables

Update your `.env.local` file with your Clerk keys:

```bash
# Replace these with your actual Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
CLERK_SECRET_KEY="sk_test_YOUR_KEY_HERE"
```

### 2.4 Set Up Clerk Webhook (Optional but Recommended)

This enables automatic workspace creation when users sign up.

1. In Clerk dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Set URL to: `https://your-domain.com/api/webhooks/clerk` (for development, use ngrok)
4. Subscribe to event: `user.created`
5. Copy the **Signing Secret** (starts with `whsec_...`)
6. Add to `.env.local`:

```bash
CLERK_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"
```

**For Local Development with Webhooks:**

```bash
# Install ngrok
npm install -g ngrok

# Run ngrok in a separate terminal
ngrok http 3000

# Use the ngrok URL in Clerk webhook settings
# Example: https://abc123.ngrok.io/api/webhooks/clerk
```

## Step 3: Database Setup

### 3.1 Update Database Connection

Make sure your `.env.local` has the correct PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/smart_qr"
```

### 3.2 Run Migration

The database schema has been updated with 10 new tables for multi-tenancy. Run the migration:

```bash
# Generate migration (already done, but you can regenerate)
npx drizzle-kit generate

# Apply migration to database
npx drizzle-kit migrate
```

**What gets created:**
- `workspaces` - Multi-tenant workspace isolation
- `workspace_members` - User roles and permissions
- `api_keys` - Developer API access
- `qr_codes` - Enhanced with 20+ new fields
- `scans` - Enhanced analytics tracking
- `landing_pages` - Micro-landing page builder
- `landing_page_links` - Bio-link content
- `landing_page_clicks` - Click tracking
- `webhooks` - Integration webhooks
- `qr_code_versions` - Version control for QR codes

### 3.3 Migrate Existing Data (If applicable)

If you have existing QR codes in your database from the old schema, create a default workspace:

```sql
-- Run this in your PostgreSQL client
INSERT INTO workspaces (name, slug, plan) 
VALUES ('Default Workspace', 'default-workspace', 'free')
RETURNING id;

-- Note the returned ID, then update existing codes
-- Replace <workspace_id> with the actual ID from above
UPDATE qr_codes 
SET workspace_id = <workspace_id> 
WHERE workspace_id IS NULL;
```

## Step 4: Run the Application

```bash
npm run dev
```

The app will run on `http://localhost:3000` (or with HTTPS if configured)

## Step 5: Test the Application

### 5.1 Sign Up

1. Navigate to `http://localhost:3000`
2. Click **Sign Up**
3. Create an account
4. You'll be redirected to the onboarding page to create your workspace

### 5.2 Create a Workspace

1. Enter a workspace name (e.g., "My Company")
2. Click **Create Workspace**
3. You'll be redirected to the dashboard

### 5.3 Generate a QR Code

1. Fill out the form in the left column
2. Enter a destination URL
3. (Optional) Add iOS/Android fallback URLs
4. Click **Generate Smart Link**
5. Download the QR code image

### 5.4 Test Scanning

1. Scan the QR code with your phone
2. Check the dashboard - you should see the scan count increase
3. View the status column showing "active"

## New Features Available (Phase 1)

✅ **Multi-Tenant Workspaces**
- Each user can have their own workspace
- Team members with different roles (owner, admin, member, viewer)
- Complete data isolation between workspaces

✅ **Clerk Authentication**
- Modern, secure authentication
- Email/password login
- Social OAuth ready (Google, GitHub, etc.)
- User profile management

✅ **Enhanced Dashboard**
- Shows workspace name and plan
- User account menu (top right)
- Status column for QR codes
- Workspace-filtered analytics

✅ **Foundation for Advanced Features**
- Database schema supports all Phase 2-7 features
- Security fields ready (password, geofence, expiration)
- Analytics fields ready (geolocation, UTM tracking)
- Landing page tables ready
- API key management ready

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  User Authentication (Clerk)                    │
├─────────────────────────────────────────────────┤
│  Workspace Isolation Layer                      │
│  - getCurrentWorkspace()                        │
│  - Role-based permissions                       │
├─────────────────────────────────────────────────┤
│  Application Routes                             │
│  - /dashboard (protected)                       │
│  - /onboarding (protected)                      │
│  - /q/[shortCode] (public)                      │
│  - /api/* (protected with API keys later)       │
├─────────────────────────────────────────────────┤
│  Database Layer (Drizzle ORM)                   │
│  - 10 tables with foreign key relationships     │
│  - Row-level workspace isolation                │
└─────────────────────────────────────────────────┘
```

## Next Steps

Once Phase 1 is working, we can implement:

**Phase 2: Deep Analytics & Smart Routing**
- Geolocation tracking with ipapi.com
- Time-based URL switching
- Language detection routing
- Facebook Pixel & Google Tag Manager integration
- Interactive analytics dashboard with charts

**Phase 3: Security & Access Control**
- Password-protected QR codes
- Geo-fencing (location-based access)
- Expiration dates and max scan limits
- Pause/archive functionality

**Phase 4: Micro-Landing Pages**
- Bio-link page builder
- Digital business cards (vCard)
- Custom themes and styling

**Phase 5: Developer API**
- REST API with authentication
- Bulk QR code generation
- Webhooks for events
- CSV-to-ZIP export

**Phase 6: AI-Powered QR Codes**
- Artistic QR generation with Stability AI
- Logo embedding
- Custom colors and styles

**Phase 7: Barcode Support**
- Multiple barcode formats (UPC, EAN, Code128)
- Print label layout engine

## Troubleshooting

### Clerk Not Loading

- Make sure you've added the correct keys to `.env.local`
- Restart your dev server after updating environment variables
- Check browser console for errors

### Database Migration Fails

- Make sure PostgreSQL is running
- Verify `DATABASE_URL` is correct
- Check if you have permission to create tables
- Run `npx drizzle-kit push` to push schema directly (for development)

### Redirect Loop on Dashboard

- Clear browser cookies and localStorage
- Make sure you've created a workspace in onboarding
- Check that `workspace_members` table has your userId

### Webhooks Not Working

- Make sure you're using HTTPS or ngrok for local development
- Verify the webhook secret matches in Clerk and `.env.local`
- Check webhook logs in Clerk dashboard

## Support

For issues or questions:
1. Check the generated migration file: `drizzle/0000_brown_xorn.sql`
2. Review Clerk documentation: https://clerk.com/docs
3. Check Drizzle ORM docs: https://orm.drizzle.team/

## Database Schema Reference

See [db/schema.ts](db/schema.ts) for the complete schema definition with all tables and relationships.
