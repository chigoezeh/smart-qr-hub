# Smart QR Hub - Developer API Documentation

Version: 1.0.0  
Base URL: `https://your-domain.com/api/v1`

## Authentication

All API requests require authentication using an API key. Include your API key in the `Authorization` header:

```
Authorization: Bearer sk_live_your_api_key_here
```

### Getting an API Key

1. Log in to your Smart QR Hub dashboard
2. Navigate to Settings → API Keys
3. Click "Generate New API Key"
4. Save your key securely (it won't be shown again)

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid request parameters",
    "details": { ... }
  }
}
```

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Invalid or missing API key
- `403 Forbidden` - Access forbidden
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## QR Codes API

### List QR Codes

Get all QR codes for your workspace.

**Endpoint:** `GET /api/v1/qr`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 50, max: 100)

**Example Request:**
```bash
curl -X GET https://your-domain.com/api/v1/qr?page=1&limit=50 \
  -H "Authorization: Bearer sk_live_your_api_key"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shortCode": "abc123",
      "title": "My QR Code",
      "contentType": "url",
      "destinationUrl": "https://example.com",
      "isDynamic": true,
      "status": "active",
      "currentScans": 42,
      "maxScans": null,
      "isPasswordProtected": false,
      "scanUrl": "https://your-domain.com/q/abc123",
      "createdAt": "2026-02-24T10:00:00.000Z",
      "updatedAt": "2026-02-24T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### Create QR Code

Create a new QR code.

**Endpoint:** `POST /api/v1/qr`

**Request Body:**
```json
{
  "title": "My QR Code",
  "contentType": "url",
  "contentData": { "url": "https://example.com" },
  "destinationUrl": "https://example.com",
  "isDynamic": true,
  "status": "active",
  "password": "optional_password",
  "maxScans": 1000,
  "expiresAt": "2026-12-31T23:59:59Z",
  "facebookPixelId": "123456789",
  "googleTagManagerId": "GTM-XXXXXX"
}
```

**Required Fields:**
- `contentType` - Type of content (url, text, vcard, email, sms, phone, wifi, event, location, whatsapp)
- `contentData` - Content data specific to the type

**Optional Fields:**
- `title` - Friendly name for the QR code
- `destinationUrl` - Destination URL for URL-type QR codes
- `isDynamic` - Whether the QR code is dynamic (default: true)
- `status` - Status (active, paused, archived)
- `password` - Password protection
- `maxScans` - Maximum number of scans allowed
- `expiresAt` - Expiration date (ISO 8601)
- `schedules` - Time-based routing rules
- `languageRoutes` - Language-based routing
- `iosUrl` - iOS-specific destination
- `androidUrl` - Android-specific destination
- `geofence` - Geographic restrictions
- `facebookPixelId` - Facebook Pixel ID for tracking
- `googleTagManagerId` - Google Tag Manager ID

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "shortCode": "abc123",
    "title": "My QR Code",
    "contentType": "url",
    "scanUrl": "https://your-domain.com/q/abc123",
    "status": "active",
    "createdAt": "2026-02-24T10:00:00.000Z"
  }
}
```

### Get QR Code

Get details of a specific QR code.

**Endpoint:** `GET /api/v1/qr/:id`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "shortCode": "abc123",
    "title": "My QR Code",
    "contentType": "url",
    "contentData": { "url": "https://example.com" },
    "destinationUrl": "https://example.com",
    "isDynamic": true,
    "status": "active",
    "scanUrl": "https://your-domain.com/q/abc123",
    "currentScans": 42,
    "maxScans": null,
    "isPasswordProtected": false,
    "createdAt": "2026-02-24T10:00:00.000Z",
    "updatedAt": "2026-02-24T10:00:00.000Z"
  }
}
```

### Update QR Code

Update an existing QR code.

**Endpoint:** `PATCH /api/v1/qr/:id`

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "destinationUrl": "https://new-url.com",
  "status": "paused",
  "maxScans": 2000
}
```

### Delete QR Code

Delete a QR code permanently.

**Endpoint:** `DELETE /api/v1/qr/:id`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "deleted": true,
    "id": 1
  }
}
```

### Get QR Code Analytics

Get analytics data for a specific QR code.

**Endpoint:** `GET /api/v1/qr/:id/analytics`

**Query Parameters:**
- `days` (optional) - Number of days to include (default: 30)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": {
      "id": 1,
      "shortCode": "abc123",
      "title": "My QR Code",
      "totalScans": 142
    },
    "period": {
      "days": 30,
      "from": "2026-01-24T10:00:00.000Z",
      "to": "2026-02-24T10:00:00.000Z"
    },
    "summary": {
      "totalScans": 142,
      "uniqueCountries": 15
    },
    "scansByCountry": [
      { "country": "United States", "count": 56 },
      { "country": "United Kingdom", "count": 32 }
    ],
    "scansByDevice": [
      { "deviceType": "mobile", "count": 98 },
      { "deviceType": "desktop", "count": 44 }
    ],
    "scansByOS": [
      { "os": "iOS", "count": 67 },
      { "os": "Android", "count": 52 }
    ],
    "dailyScans": [
      { "date": "2026-02-23", "count": 15 },
      { "date": "2026-02-24", "count": 18 }
    ],
    "recentScans": [ ... ]
  }
}
```

---

## Landing Pages API

### List Landing Pages

Get all landing pages for your workspace.

**Endpoint:** `GET /api/v1/pages`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 50, max: 100)

### Create Landing Page

Create a new landing page.

**Endpoint:** `POST /api/v1/pages`

**Request Body:**
```json
{
  "slug": "my-page",
  "type": "biolink",
  "theme": "default",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Inc",
  "address": "123 Main St",
  "profilePhotoUrl": "https://example.com/photo.jpg",
  "customCss": ".landing-container { background: #fff; }"
}
```

**Required Fields:**
- `slug` - Unique URL slug (lowercase, numbers, hyphens only)
- `type` - Page type (biolink, vcard, custom)

**Optional Fields:**
- `theme` - Theme (default, dark, minimal, gradient, neon)
- `customCss` - Custom CSS styles
- `fullName`, `email`, `phone`, `company`, `address` - vCard fields
- `profilePhotoUrl` - Profile photo URL

### Get Landing Page

Get a landing page with all its links.

**Endpoint:** `GET /api/v1/pages/:id`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "my-page",
    "type": "biolink",
    "theme": "default",
    "url": "https://your-domain.com/l/my-page",
    "links": [
      {
        "id": 1,
        "title": "Visit Website",
        "url": "https://example.com",
        "icon": "🌐",
        "displayOrder": 1
      }
    ],
    "createdAt": "2026-02-24T10:00:00.000Z"
  }
}
```

### Update Landing Page

Update a landing page.

**Endpoint:** `PATCH /api/v1/pages/:id`

### Delete Landing Page

Delete a landing page permanently.

**Endpoint:** `DELETE /api/v1/pages/:id`

### Add Link to Page

Add a link to a landing page.

**Endpoint:** `POST /api/v1/pages/:id/links`

**Request Body:**
```json
{
  "title": "My Link",
  "url": "https://example.com",
  "icon": "🔗",
  "displayOrder": 1
}
```

---

## Analytics API

### Get Workspace Analytics

Get workspace-wide analytics overview.

**Endpoint:** `GET /api/v1/analytics`

**Query Parameters:**
- `days` (optional) - Number of days to include (default: 30)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "workspace": {
      "id": 1,
      "name": "My Workspace"
    },
    "period": {
      "days": 30,
      "from": "2026-01-24T10:00:00.000Z",
      "to": "2026-02-24T10:00:00.000Z"
    },
    "summary": {
      "totalQRCodes": 50,
      "totalScans": 1500,
      "scansInPeriod": 450,
      "totalLandingPages": 10,
      "totalPageClicks": 320
    },
    "topQRCodes": [ ... ],
    "scansByCountry": [ ... ]
  }
}
```

---

## Webhooks API

### List Webhooks

Get all webhooks for your workspace.

**Endpoint:** `GET /api/v1/webhooks`

### Create Webhook

Create a new webhook subscription.

**Endpoint:** `POST /api/v1/webhooks`

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["qr.created", "qr.scanned", "page.created"]
}
```

**Available Events:**
- `qr.created` - QR code created
- `qr.updated` - QR code updated
- `qr.deleted` - QR code deleted
- `qr.scanned` - QR code scanned
- `page.created` - Landing page created
- `page.updated` - Landing page updated
- `page.deleted` - Landing page deleted

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "url": "https://your-app.com/webhook",
    "events": ["qr.created", "qr.scanned"],
    "secret": "whsec_abc123...",
    "isActive": true,
    "createdAt": "2026-02-24T10:00:00.000Z"
  }
}
```

**Note:** The `secret` is only returned once. Store it securely to verify webhook signatures.

### Webhook Payload Example

When an event occurs, a POST request is sent to your webhook URL:

```json
{
  "event": "qr.scanned",
  "timestamp": "2026-02-24T10:00:00.000Z",
  "data": {
    "qrCode": {
      "id": 1,
      "shortCode": "abc123",
      "title": "My QR Code"
    },
    "scan": {
      "country": "United States",
      "city": "New York",
      "os": "iOS",
      "deviceType": "mobile"
    }
  }
}
```

### Verifying Webhook Signatures

Each webhook request includes an `X-Webhook-Signature` header with an HMAC SHA-256 signature:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === expectedSignature;
}
```

---

## Rate Limiting

API requests are rate-limited per workspace:

- **Free Plan:** 100 requests/minute
- **Pro Plan:** 1,000 requests/minute
- **Enterprise Plan:** Custom limits

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1708776000
```

When rate limited, you'll receive a `429 Too Many Requests` response.

---

## Best Practices

1. **Store API Keys Securely** - Never commit API keys to version control
2. **Handle Errors Gracefully** - Check `success` field in responses
3. **Respect Rate Limits** - Implement exponential backoff on 429 errors
4. **Use Pagination** - Don't fetch all records at once
5. **Verify Webhooks** - Always validate webhook signatures
6. **Monitor API Usage** - Check your API usage in the dashboard

---

## SDKs and Libraries

Official SDKs are available for:

- **Node.js** - `npm install @smart-qr-hub/node`
- **Python** - `pip install smart-qr-hub`
- **PHP** - `composer require smart-qr-hub/php`
- **Ruby** - `gem install smart_qr_hub`

See [GitHub](https://github.com/smart-qr-hub) for full documentation.

---

## Support

- **Documentation:** https://docs.smart-qr-hub.com
- **API Status:** https://status.smart-qr-hub.com
- **Support Email:** api@smart-qr-hub.com
- **Discord Community:** https://discord.gg/smart-qr-hub
