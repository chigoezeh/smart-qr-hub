# Smart-Link Hub 🚀

> **Enterprise QR Code Platform** - The Contactless Interaction Platform

Transform QR codes from simple redirects into intelligent, data-driven customer touchpoints. Smart-Link Hub is a multi-tenant SaaS platform that goes beyond basic QR generation to provide **12 different content types**, deep analytics, smart routing, security controls, and developer-friendly APIs.

## ✨ Key Features

### Phase 1: Multi-Tenant Foundation ✅ **IMPLEMENTED**

- **🔐 Enterprise Authentication** - Powered by Clerk with OAuth support
- **🏢 Workspace Management** - Multi-tenant architecture with role-based access control
- **👥 Team Collaboration** - Owner, Admin, Member, and Viewer roles
- **📊 Enhanced Dashboard** - Real-time analytics with workspace isolation and type filtering
- **🔄 Dynamic QR Codes** - Change destination URLs without reprinting
- **📱 OS-Based Routing** - Automatic iOS/Android detection and routing
- **🎯 Smart Redirects** - Separate destinations for different platforms

### 🎨 Comprehensive Content Types ✅ **NEW!**

Smart-Link Hub now supports **12 different QR code content types** with specialized encoding and validation:

#### 📱 **Contact & Communication**
- **vCard** - Digital business cards with full contact details (name, phone, email, organization, address)
- **Email** - Pre-filled email templates with subject and body
- **SMS** - Text messages with recipient and message
- **Phone** - Direct phone calls with number formatting
- **WhatsApp** - WhatsApp chats with pre-filled messages

#### 🌐 **Web & Social**
- **URL** - Smart web links with advanced routing (time, location, device-based)
- **Social Media** - Direct links to Instagram, Twitter, LinkedIn, TikTok, YouTube, Facebook, Snapchat profiles

#### 📡 **Connectivity & Location**
- **WiFi** - One-tap WiFi connection (SSID, password, encryption type, hidden networks)
- **Location** - Geographic coordinates with Google Maps integration

#### 📅 **Events & Content**
- **Event** - Calendar events with iCalendar format (title, date range, venue, description)
- **Text** - Plain text content for notes, messages, or information
- **Cryptocurrency** - Payment requests with BIP21 URI (Bitcoin, Ethereum, Litecoin, Dogecoin)

#### 🎯 **Advanced Features**
- **Type-Specific Validation** - Ensures data integrity for each content type
- **Smart Routing Support** - URL types leverage conditional routing (time/location/device)
- **Visual Type Indicators** - Color-coded badges and icons in dashboard
- **Type Distribution Analytics** - Real-time charts showing content type usage
- **Advanced Filtering** - Search and filter by content type

### Phase 2-7: Advanced Features 🚧 **IN PROGRESS**

<details>
<summary><strong>Phase 2: Deep Analytics & Smart Routing</strong> ✅ **COMPLETED**</summary>

- **🌍 Geolocation Tracking** - Country, city, and coordinates via ipapi.com
- **⏰ Time-Based Routing** - Different URLs for breakfast vs. dinner hours
- **🌐 Language Detection** - Auto-route to localized content
- **📈 Retargeting Pixels** - Facebook Pixel & Google Tag Manager integration
- **📉 Interactive Charts** - Visual analytics with maps and graphs
- **📤 CSV Export** - Download analytics data
- **⚡ Real-Time Dashboard** - Live scan events via SSE

</details>

<details open>
<summary><strong>Phase 3: Security & Access Control</strong> ✅ **COMPLETED**</summary>

- **🔒 Password Protection** - bcrypt-hashed passwords with verification page
- **📍 Geo-Fencing** - Location-based access control with Haversine distance calculation
- **⏳ Expiration Dates** - Time-limited codes with automatic 410 Gone responses
- **🎫 Max Scan Limits** - Self-destructing codes after N scans with atomic counters
- **⏸️ Status Management** - Active/Paused/Archived states with enforcement
- **🔑 API Key Management** - SHA-256 hashed keys with slh_ prefix for developer access
- **🛡️ Security Indicators** - Visual badges showing protected QR codes in dashboard
- **5-Stage Enforcement** - Status → Expiration → Geofence → Password → Scan Limit
- **📋 Testing Guide** - Comprehensive security testing documentation

</details>

<details>
<summary><strong>Phase 4: Micro-Landing Pages</strong></summary>

- **🎨 Bio-Link Builder** - Drag-and-drop link-in-bio pages
- **📇 Digital Business Cards** - vCard generation with one-tap save
- **🎭 Custom Themes** - Pre-built and custom CSS styling
- **📊 Click Tracking** - Per-link analytics
- **🖼️ Rich Media** - Images, videos, and embeds

</details>

<details>
<summary><strong>Phase 5: Developer API</strong></summary>

- **🔑 API Key Management** - Secure programmatic access
- **📚 REST API v1** - Create, read, update, delete QR codes
- **📦 Bulk Operations** - CSV-to-ZIP generation
- **🪝 Webhooks** - Real-time event notifications
- **⚡ Rate Limiting** - Redis-backed request throttling
- **📖 OpenAPI Docs** - Interactive API documentation

</details>

<details>
<summary><strong>Phase 6: AI-Powered Design</strong></summary>

- **🎨 Artistic QR Codes** - Stable Diffusion generated designs
- **🏷️ Logo Embedding** - Brand-safe logo integration
- **🌈 Custom Styling** - Colors, gradients, corner styles
- **✅ Scan Validation** - Automated readability testing

</details>

<details>
<summary><strong>Phase 7: Barcode Support</strong></summary>

- **📊 Multiple Formats** - UPC, EAN, Code128, ISBN, GS1
- **🖨️ Print Layouts** - Avery label templates
- **📦 Inventory Management** - Bulk product code generation

</details>

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Clerk
- **Styling:** Tailwind CSS 4
- **QR Generation:** qrcode, html5-qrcode
- **Encoding Standards:** vCard 3.0, iCalendar, BIP21, geo: URI, WiFi QR
- **Deployment:** Vercel-ready

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-qr-hub.git
cd smart-qr-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

See **[SETUP.md](SETUP.md)** for detailed configuration instructions.

Quick setup:

```bash
# Copy example env file
cp env.example .env.local

# Add your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/smart_qr"

# Add Clerk keys (sign up at https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 4. Run Database Migration

```bash
npx drizzle-kit migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Different QR Code Types

1. **Navigate to Dashboard** → Click "Create New QR Code"
2. **Select Content Type** → Choose from 12 beautiful type cards
3. **Fill Type-Specific Form** → Enter your content details
4. **Watch Live Preview** → QR code updates in real-time
5. **Customize & Download** → Adjust settings and download

### Content Type Examples

#### vCard (Digital Business Card)
```typescript
{
  firstName: "John",
  lastName: "Doe",
  organization: "Acme Inc.",
  title: "CEO",
  phone: "+1-555-0123",
  email: "john@acme.com",
  website: "https://acme.com",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zip: "94102"
  }
}
```
**Output:** `BEGIN:VCARD\nVERSION:3.0\nN:Doe;John\n...END:VCARD`

#### WiFi Credentials
```typescript
{
  ssid: "CoffeeShop_Guest",
  password: "Welcome123!",
  encryption: "WPA",
  hidden: false
}
```
**Output:** `WIFI:T:WPA;S:CoffeeShop_Guest;P:Welcome123!;H:false;;`

#### Calendar Event
```typescript
{
  title: "Team Meeting",
  startDate: "2026-02-25T14:00",
  endDate: "2026-02-25T15:00",
  location: "Conference Room A",
  description: "Quarterly planning session"
}
```
**Output:** `BEGIN:VEVENT\nDTSTART:20260225T140000\n...END:VEVENT`

#### Cryptocurrency Payment
```typescript
{
  currency: "bitcoin",
  address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  amount: 0.001,
  label: "Coffee Payment"
}
```
**Output:** `bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001&label=Coffee%20Payment`

### Dashboard Features

**Filtering & Search**
- Click "Filter: All" to select specific content types
- Use search bar to find QR codes by title, code, or destination
- See filtered count: "Showing 5 of 20 QR codes"

**Type Distribution**
- Visual progress bars show percentage breakdown
- Color-coded by type (blue for URL, purple for vCard, etc.)
- Summary footer shows most popular type

**Type Badges**
- Compact badges show type at a glance
- Icon + type name (e.g., 📧 Email, 📶 WiFi)
- "Smart" indicator for URL types with advanced routing

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide with Clerk configuration
- **[db/schema.ts](db/schema.ts)** - Database schema reference
- **Phase Roadmap** - See below

## 🗄️ Database Schema

**10 Tables:**

1. `workspaces` - Multi-tenant isolation
2. `workspace_members` - Team roles and permissions
3. `api_keys` - Developer API access
4. `qr_codes` - Enhanced with **contentType** and **contentData** for 12 QR types (vCard, WiFi, Email, SMS, etc.)
5. `scans` - Analytics with geolocation and UTM tracking
6. `landing_pages` - Bio-link and vCard pages
7. `landing_page_links` - Page content blocks
8. `landing_page_clicks` - Click tracking
9. `webhooks` - Event subscriptions
10. `qr_code_versions` - Version control history

### QR Code Content System

The `qr_codes` table uses a flexible content type system:

- **`contentType`** (TEXT) - One of 12 types: `url`, `text`, `vcard`, `email`, `sms`, `phone`, `wifi`, `event`, `location`, `whatsapp`, `social`, `crypto`
- **`contentData`** (JSONB) - Structured data specific to each type
- **`destinationUrl`** (TEXT, nullable) - Legacy field for URL-based types with smart routing

**Encoding Formats:**
- **vCard** → vCard 3.0 spec (`BEGIN:VCARD...END:VCARD`)
- **WiFi** → `WIFI:T:WPA;S:ssid;P:password;H:false;;`
- **Event** → iCalendar format (`BEGIN:VEVENT...END:VEVENT`)
- **Location** → `geo:` URI scheme
- **Crypto** → BIP21 URI (`bitcoin:address?amount=X&label=Y`)
- **Email/SMS/Phone** → RFC-compliant schemes (`mailto:`, `sms:`, `tel:`)

## 📅 Roadmap

| Phase | Feature | Status | ETA |
|-------|---------|--------|-----|
| 1 | Multi-Tenant Auth & Foundation | ✅ Complete | - |
| 1.5 | **12 Content Types & Advanced Dashboard** | ✅ **Complete** | - |
| 2 | Deep Analytics & Smart Routing | ✅ **Complete** | - |
| 3 | **Security & Access Control** | ✅ **Complete** | - |
| 4 | Micro-Landing Pages | 📋 Planned | Week 6-7 |
| 5 | Developer API & Webhooks | 📋 Planned | Week 8-9 |
| 6 | AI-Powered QR Design | 📋 Planned | Week 10 |
| 7 | Barcode Support | 📋 Planned | Week 11 |

### Recent Updates (Phase 3 - Security)

**Security & Access Control** ✅
- 5-stage security enforcement pipeline
- Password protection with bcrypt hashing
- Expiration dates with automatic blocking
- Scan limits with atomic counters
- Geofencing with Haversine distance calculation
- API key management with SHA-256 hashing
- Security indicators on dashboard
- Comprehensive testing guide (SECURITY_TESTING.md)

**Previous Updates (Phase 1.5)**

**Content Type System** ✅
- 12 QR content types with specialized forms
- Type-specific encoding (vCard, WiFi, iCalendar, BIP21, etc.)
- Visual type badges and color-coding
- Content validation engine

**Enhanced Dashboard** ✅
- Type distribution analytics with progress bars
- Real-time filtering by content type
- Advanced search across titles, codes, and destinations
- 4th stat card showing unique types and most popular
- Type badges in QR code table

**Developer Experience** ✅
- Comprehensive type definitions (`types/qr-content.ts`)
- Encoding utilities (`lib/qr-encoder.ts`)
- Reusable components (QRTypeBadge, TypeDistribution, DashboardFilters)
- Full TypeScript support

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│          Clerk Authentication               │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│       Workspace Isolation Layer             │
│   (getCurrentWorkspace, permissions)        │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          Next.js App Router                 │
│  /dashboard  /q/[code]  /l/[slug]  /api/*   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│     Drizzle ORM + PostgreSQL                │
│   (10 tables, foreign keys, indexes)        │
└─────────────────────────────────────────────┘
```

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Authentication by [Clerk](https://clerk.com)
- Database toolkit by [Drizzle](https://orm.drizzle.team)
- Styled with [Tailwind CSS](https://tailwindcss.com)

## 📞 Support

- 📧 Email: support@smart-link-hub.com
- 💬 Discord: [Join our community](#)
- 📖 Docs: [docs.smart-link-hub.com](#)

---

**Built with ❤️ for enterprise-grade QR code management**
