import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface PixelRedirectProps {
  params: Promise<{ shortCode: string }>;
  searchParams: Promise<{ target?: string }>;
}

export default async function PixelRedirectPage({ params, searchParams }: PixelRedirectProps) {
  const { shortCode } = await params;
  const { target } = await searchParams;

  // Fetch QR code to get pixel IDs
  const [qrRecord] = await db
    .select({
      facebookPixelId: qrCodes.facebookPixelId,
      googleTagManagerId: qrCodes.googleTagManagerId,
      title: qrCodes.title,
    })
    .from(qrCodes)
    .where(eq(qrCodes.shortCode, shortCode))
    .limit(1);

  if (!qrRecord || !target) {
    redirect("/");
  }

  const hasFBPixel = !!qrRecord.facebookPixelId;
  const hasGTM = !!qrRecord.googleTagManagerId;

  // If no pixels configured, redirect immediately
  if (!hasFBPixel && !hasGTM) {
    redirect(target);
  }

  return (
    <html>
      <head>
        <title>Redirecting...</title>
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Facebook Pixel */}
        {hasFBPixel && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${qrRecord.facebookPixelId}');
fbq('track', 'PageView');
fbq('track', 'QRScan', {
  qr_code: '${shortCode}',
  qr_title: '${qrRecord.title || "Untitled"}'
});
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${qrRecord.facebookPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {/* Google Tag Manager */}
        {hasGTM && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${qrRecord.googleTagManagerId}');

// Push QR scan event to dataLayer
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'qr_scan',
  'qr_code': '${shortCode}',
  'qr_title': '${qrRecord.title || "Untitled"}'
});
                `,
              }}
            />
          </>
        )}

        {/* Auto-redirect after pixels load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Wait for pixels to load and fire, then redirect
              setTimeout(function() {
                window.location.href = '${target}';
              }, 500); // 500ms delay to ensure pixels fire
            `,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f9fafb" }}>
        {/* GTM noscript */}
        {hasGTM && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${qrRecord.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        
        {/* Loading indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#6b7280",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #e5e7eb",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px auto",
              }}
            />
            <p>Redirecting...</p>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `,
              }}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
