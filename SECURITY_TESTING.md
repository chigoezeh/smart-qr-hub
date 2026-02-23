# Phase 3 Security Testing Guide

This document outlines comprehensive testing procedures for all security features implemented in Phase 3.

## Security Features Overview

Smart QR Hub now includes 5 security layers that protect QR codes:
1. ✅ Password Protection (bcrypt hashing)
2. ✅ Expiration Dates (automatic time-based blocking)
3. ✅ Scan Limits (counter-based restrictions)
4. ✅ Geofencing (location-based access control)
5. ✅ Status Management (active/paused/archived states)

## Security Enforcement Order

When a QR code is scanned, security checks execute in this order:

```
1. Status Check → 403 if not "active"
2. Expiration Check → 410 Gone if expired
3. Geofencing Check → 403 with distance message if outside radius
4. Password Check → Redirect to /verify/[shortCode] if protected
5. Scan Limit Check → 429 Too Many Requests if limit reached
6. Smart Routing → Proceed to destination
```

## Test Cases

### 1. Password Protection

**Setup:**
- Create a QR code with password protection enabled
- Set password: `SecurePass123`

**Test Cases:**

#### Test 1.1: Protected QR redirects to verification page
- **Action:** Navigate to `/q/[shortCode]` (without password)
- **Expected:** Redirect to `/verify/[shortCode]`
- **Verify:** Verification page displays password form

#### Test 1.2: Wrong password shows error
- **Action:** Enter incorrect password on verification page
- **Expected:** Error message: "Incorrect password. Please try again."
- **Verify:** User remains on verification page

#### Test 1.3: Correct password grants access
- **Action:** Enter correct password: `SecurePass123`
- **Expected:** 
  - Success message
  - Redirect to `/q/[shortCode]?token=XXX`
  - Access to destination URL
- **Verify:** Token stored in sessionStorage

#### Test 1.4: Token persists across sessions
- **Action:** Copy token URL and paste in new tab
- **Expected:** Direct access without re-entering password
- **Verify:** Token validation in route handler

---

### 2. Expiration Dates

**Setup:**
- Create QR code with expiration date

**Test Cases:**

#### Test 2.1: Active QR works before expiration
- **Action:** Set expiration to tomorrow, scan QR
- **Expected:** 200 OK, redirect to destination
- **Verify:** Scan recorded in analytics

#### Test 2.2: Expired QR returns 410 Gone
- **Action:** Set expiration to yesterday, scan QR
- **Expected:** 
  - HTTP 410 Gone response
  - Error message: "This QR code has expired"
- **Verify:** Scan NOT recorded

#### Test 2.3: Expiration at exact time
- **Action:** Set expiration to current time + 2 minutes, wait 3 minutes, scan
- **Expected:** 410 Gone after expiration time passes
- **Verify:** Time comparison uses server time, not client time

---

### 3. Scan Limits

**Setup:**
- Create QR code with max scans limit

**Test Cases:**

#### Test 3.1: Scan counter increments correctly
- **Action:** Set maxScans = 5, scan QR 3 times
- **Expected:** currentScans = 3 in database
- **Verify:** Dashboard shows accurate scan count

#### Test 3.2: QR works until limit reached
- **Action:** Scan QR 5 times (at limit)
- **Expected:** First 5 scans succeed (200 OK)
- **Verify:** All 5 scans recorded in analytics

#### Test 3.3: Scan limit blocks access
- **Action:** Attempt 6th scan (over limit)
- **Expected:** 
  - HTTP 429 Too Many Requests
  - Error message: "Scan limit reached"
- **Verify:** 6th scan NOT recorded

#### Test 3.4: Unlimited scans work
- **Action:** Create QR without maxScans set (null)
- **Expected:** No scan limit enforcement
- **Verify:** Can scan indefinitely

---

### 4. Geofencing

**Setup:**
- Create QR code with geofence enabled
- Set center: Latitude 40.7128, Longitude -74.0060 (New York)
- Set radius: 50 km

**Test Cases:**

#### Test 4.1: Within radius grants access
- **Action:** Scan from location within 50km radius
- **Expected:** 200 OK, redirect to destination
- **Verify:** Haversine distance calculation < 50km

#### Test 4.2: Outside radius blocks access
- **Action:** Scan from location >50km away
- **Expected:**
  - HTTP 403 Forbidden
  - Error message includes actual distance
  - Example: "Access denied. You are 125.3km from allowed location (max: 50km)"
- **Verify:** Distance calculation accurate

#### Test 4.3: No geofence allows all locations
- **Action:** Create QR without geofence (null)
- **Expected:** Access from any location works
- **Verify:** No geofence check in logs

**Implementation Note:**
- Location detection uses IP geolocation API
- Haversine formula calculates great-circle distance
- Distance in kilometers (not miles)

---

### 5. Status Management

**Setup:**
- Create QR codes with different statuses

**Test Cases:**

#### Test 5.1: Active QR works normally
- **Action:** Set status = "active", scan QR
- **Expected:** 200 OK, redirect to destination
- **Verify:** Green "Active" badge in dashboard

#### Test 5.2: Paused QR blocks access
- **Action:** Set status = "paused", scan QR
- **Expected:**
  - HTTP 403 Forbidden
  - Error message: "This QR code is currently paused"
- **Verify:** Yellow "Paused" badge in dashboard

#### Test 5.3: Archived QR blocks access
- **Action:** Set status = "archived", scan QR
- **Expected:**
  - HTTP 403 Forbidden
  - Error message: "This QR code is archived"
- **Verify:** Gray "Archived" badge in dashboard

---

### 6. API Key Management

**Setup:**
- Navigate to `/dashboard/settings`

**Test Cases:**

#### Test 6.1: Generate API key
- **Action:** Click "Generate New API Key", enter name "Production API"
- **Expected:**
  - Key generated with `slh_` prefix
  - 64 hexadecimal characters after prefix
  - Full key shown once with green warning banner
  - Copy button works
- **Verify:** Hash stored in database (SHA-256), not plain key

#### Test 6.2: Key display security
- **Action:** Refresh page after generating key
- **Expected:**
  - Full key no longer visible
  - Preview shows: `slh_...XXXX` (last 4 chars only)
- **Verify:** Cannot retrieve full key again

#### Test 6.3: Delete API key
- **Action:** Click delete button, confirm deletion
- **Expected:**
  - Confirmation dialog appears
  - Key removed from list after confirmation
- **Verify:** Key deleted from database

#### Test 6.4: API key validation (future)
- **Action:** Make API request with generated key
- **Expected:** 
  - Key validates successfully
  - Returns associated workspaceId
  - Updates lastUsedAt timestamp
- **Note:** Full API implementation in Phase 5

---

### 7. Dashboard Security Indicators

**Test Cases:**

#### Test 7.1: Security badges display
- **Action:** Create QR with multiple security features, view dashboard
- **Expected:** 
  - Shield icon with security count in compact badge
  - Hover shows: "Password, Expiring, Geofenced, Limited"
- **Verify:** Badge appears next to QR title

#### Test 7.2: Secured QRs stat
- **Action:** View dashboard stats
- **Expected:**
  - "Secured QRs" stat card shows count
  - Red shield icon
  - Count = QRs with ANY security feature enabled
- **Verify:** Stat updates when security features added

#### Test 7.3: No security shows no badge
- **Action:** Create basic QR without any security
- **Expected:** No security badge displayed
- **Verify:** Clean UI for unsecured QRs

---

## Multi-Security Combination Tests

### Test 8.1: Password + Expiration + Scan Limit
- **Setup:** QR with all 3 features
- **Expected Order:**
  1. Check expiration first
  2. Then password (if not expired)
  3. Then scan limit (after password verified)

### Test 8.2: Geofence + Password
- **Setup:** Location-restricted password-protected QR
- **Expected Order:**
  1. Check geofence first
  2. Then password (if in geo-range)

### Test 8.3: All 5 security features
- **Setup:** QR with status, expiration, geofence, password, scan limit
- **Expected:** Enforces in documented order (1-5)

---

## Database Verification

### Verify security fields in database:

```sql
SELECT 
  id,
  title,
  status,
  is_password_protected,
  expires_at,
  max_scans,
  current_scans,
  geofence
FROM qr_codes
WHERE workspace_id = [your_workspace_id];
```

**Verify:**
- ✅ Passwords stored as bcrypt hashes (never plain text)
- ✅ Timestamps in UTC
- ✅ Geofence stored as JSONB with {latitude, longitude, radiusKm}
- ✅ currentScans increments atomically via SQL

---

## Security Implementation Files

| Feature | Files Modified/Created |
|---------|----------------------|
| Password Protection | `components/SecuritySettings.tsx`<br>`app/verify/[shortCode]/page.tsx`<br>`components/PasswordVerificationForm.tsx`<br>`actions/qr-security.ts` |
| Expiration/Limits | `app/q/[shortCode]/route.ts`<br>`db/schema.ts` |
| Geofencing | `app/q/[shortCode]/route.ts` (Haversine function) |
| API Keys | `components/ApiKeyManager.tsx`<br>`actions/api-keys.ts`<br>`app/dashboard/settings/page.tsx` |
| Dashboard Indicators | `components/SecurityBadges.tsx`<br>`components/QRTableRow.tsx`<br>`app/dashboard/page.tsx` |

---

## Known Limitations

1. **Token Validation:** Password verification tokens are generated but not fully validated in the route handler yet (currently accepts any token). This should be enhanced in a future iteration.

2. **IP Geolocation:** Geofencing relies on IP-based location which may not be accurate for VPN users or mobile networks.

3. **Scan Limit Race Conditions:** High-concurrency scenarios might allow slightly exceeding the scan limit (mitigated by atomic SQL increment).

4. **API Key Usage:** API keys are generated and stored but full API endpoint authentication is pending in Phase 5.

---

## Testing Checklist

Use this checklist to verify Phase 3 completion:

- [ ] Password protection works with correct/incorrect passwords
- [ ] Expired QR codes return 410 Gone
- [ ] Scan limits block access after threshold
- [ ] Geofencing calculates distance correctly
- [ ] Status management (active/paused/archived) enforced
- [ ] API keys generate with proper format (slh_prefix)
- [ ] Dashboard shows security badges
- [ ] Security stat card counts protected QRs
- [ ] Build succeeds without TypeScript errors
- [ ] Multi-security combinations work in correct order
- [ ] Database stores security fields correctly
- [ ] No security features: QR works normally (backward compatible)

---

## Next Steps (Phase 4: Advanced Analytics)

After Phase 3 testing is complete, proceed to Phase 4:
- UTM parameter tracking
- Referrer analysis
- Device fingerprinting
- A/B testing framework
- Performance analytics

---

## Support

For security issues or questions, refer to:
- Main README.md for architecture overview
- db/schema.ts for database structure
- app/q/[shortCode]/route.ts for security enforcement logic
