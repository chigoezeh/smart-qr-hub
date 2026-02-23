# Smart-Link Hub 🚀

> **Enterprise QR Code Platform** - The Contactless Interaction Platform

Transform QR codes from simple redirects into intelligent, data-driven customer touchpoints. Smart-Link Hub is a multi-tenant SaaS platform that goes beyond basic QR generation to provide deep analytics, smart routing, security controls, and developer-friendly APIs.

## ✨ Key Features

### Phase 1: Multi-Tenant Foundation ✅ **IMPLEMENTED**

- **🔐 Enterprise Authentication** - Powered by Clerk with OAuth support
- **🏢 Workspace Management** - Multi-tenant architecture with role-based access control
- **👥 Team Collaboration** - Owner, Admin, Member, and Viewer roles
- **📊 Enhanced Dashboard** - Real-time analytics with workspace isolation
- **🔄 Dynamic QR Codes** - Change destination URLs without reprinting
- **📱 OS-Based Routing** - Automatic iOS/Android detection and routing
- **🎯 Smart Redirects** - Separate destinations for different platforms

### Phase 2-7: Advanced Features 🚧 **PLANNED**

<details>
<summary><strong>Phase 2: Deep Analytics & Smart Routing</strong></summary>

- **🌍 Geolocation Tracking** - Country, city, and coordinates via ipapi.com
- **⏰ Time-Based Routing** - Different URLs for breakfast vs. dinner hours
- **🌐 Language Detection** - Auto-route to localized content
- **📈 Retargeting Pixels** - Facebook Pixel & Google Tag Manager integration
- **📉 Interactive Charts** - Visual analytics with maps and graphs
- **📤 CSV Export** - Download analytics data
- **⚡ Real-Time Dashboard** - Live scan events via SSE

</details>

<details>
<summary><strong>Phase 3: Security & Access Control</strong></summary>

- **🔒 Password Protection** - PIN-protected QR codes
- **📍 Geo-Fencing** - Location-based access control
- **⏳ Expiration Dates** - Time-limited codes
- **🎫 Max Scan Limits** - Self-destructing after N scans
- **⏸️ Pause/Archive** - Temporarily disable codes
- **📜 Version History** - Track URL changes over time

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

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide with Clerk configuration
- **[db/schema.ts](db/schema.ts)** - Database schema reference
- **Phase Roadmap** - See below

## 🗄️ Database Schema

**10 Tables:**

1. `workspaces` - Multi-tenant isolation
2. `workspace_members` - Team roles and permissions
3. `api_keys` - Developer API access
4. `qr_codes` - Enhanced with 29 columns (security, design, routing)
5. `scans` - Analytics with geolocation and UTM tracking
6. `landing_pages` - Bio-link and vCard pages
7. `landing_page_links` - Page content blocks
8. `landing_page_clicks` - Click tracking
9. `webhooks` - Event subscriptions
10. `qr_code_versions` - Version control history

## 📅 Roadmap

| Phase | Feature | Status | ETA |
|-------|---------|--------|-----|
| 1 | Multi-Tenant Auth & Foundation | ✅ Complete | - |
| 2 | Deep Analytics & Smart Routing | 🚧 Next | Week 3-4 |
| 3 | Security & Access Control | 📋 Planned | Week 5 |
| 4 | Micro-Landing Pages | 📋 Planned | Week 6-7 |
| 5 | Developer API & Webhooks | 📋 Planned | Week 8-9 |
| 6 | AI-Powered QR Design | 📋 Planned | Week 10 |
| 7 | Barcode Support | 📋 Planned | Week 11 |

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
