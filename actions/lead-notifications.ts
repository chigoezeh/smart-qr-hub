"use server";

import { db } from "@/db";
import { landingPages } from "@/db/schema";
import { eq } from "drizzle-orm";

interface LeadData {
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  [key: string]: unknown;
}

interface EmailNotification {
  id: string;
  name: string;
  toEmail: string;
  subject: string;
  enabled: boolean;
  triggerEvent: "form_submit" | "lead_capture" | "any_interaction";
}

interface NotificationConfig {
  notifications: EmailNotification[];
  webhookUrl?: string;
  apiKey?: string;
  emailService: "resend" | "sendgrid" | "webhook";
}

export async function sendLeadNotification(
  pageId: number,
  leadData: LeadData,
  triggerEvent: EmailNotification["triggerEvent"] = "form_submit"
) {
  try {
    // Fetch page with notification config
    const page = await db.query.landingPages.findFirst({
      where: eq(landingPages.id, pageId),
    });

    if (!page) {
      console.error("Page not found:", pageId);
      return { success: false, error: "Page not found" };
    }

    // @ts-ignore - notificationConfig will be added to schema
    const config: NotificationConfig | null = page.notificationConfig;

    if (!config || !config.notifications || config.notifications.length === 0) {
      // No notifications configured
      return { success: true, skipped: true };
    }

    // Filter enabled notifications matching the trigger event
    const activeNotifications = config.notifications.filter(
      (n) =>
        n.enabled &&
        (n.triggerEvent === triggerEvent || n.triggerEvent === "any_interaction")
    );

    if (activeNotifications.length === 0) {
      return { success: true, skipped: true };
    }

    // Send notifications based on service
    const results = await Promise.allSettled(
      activeNotifications.map((notification) =>
        sendEmail(config, notification, leadData, page.headerTitle || page.slug)
      )
    );

    const errors = results.filter((r) => r.status === "rejected");
    if (errors.length > 0) {
      console.error("Some notifications failed:", errors);
    }

    return {
      success: true,
      sent: results.filter((r) => r.status === "fulfilled").length,
      failed: errors.length,
    };
  } catch (error) {
    console.error("Failed to send lead notification:", error);
    return { success: false, error: String(error) };
  }
}

async function sendEmail(
  config: NotificationConfig,
  notification: EmailNotification,
  leadData: LeadData,
  pageTitle: string
) {
  const emailBody = formatLeadEmail(leadData, pageTitle);

  switch (config.emailService) {
    case "resend":
      return sendViaResend(config.apiKey!, notification, emailBody);
    case "sendgrid":
      return sendViaSendGrid(config.apiKey!, notification, emailBody);
    case "webhook":
      return sendViaWebhook(config.webhookUrl!, notification, leadData);
    default:
      throw new Error(`Unknown email service: ${config.emailService}`);
  }
}

async function sendViaResend(
  apiKey: string,
  notification: EmailNotification,
  htmlBody: string
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "notifications@yourdomain.com", // Configure this
      to: notification.toEmail,
      subject: notification.subject,
      html: htmlBody,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
}

async function sendViaSendGrid(
  apiKey: string,
  notification: EmailNotification,
  htmlBody: string
) {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: notification.toEmail }],
          subject: notification.subject,
        },
      ],
      from: { email: "notifications@yourdomain.com" }, // Configure this
      content: [
        {
          type: "text/html",
          value: htmlBody,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }

  return { success: true };
}

async function sendViaWebhook(
  webhookUrl: string,
  notification: EmailNotification,
  leadData: LeadData
) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notification: notification.name,
      trigger: notification.triggerEvent,
      leadData,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Webhook error: ${error}`);
  }

  return { success: true };
}

function formatLeadEmail(leadData: LeadData, pageTitle: string): string {
  const fields = Object.entries(leadData)
    .map(
      ([key, value]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600; text-transform: capitalize;">
          ${key}
        </td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          ${value}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Lead</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(to right, #4f46e5, #7c3aed); padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 New Lead Captured!</h1>
          </div>
          <div style="padding: 24px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 16px;">
              You received a new lead from your landing page: <strong>${pageTitle}</strong>
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Field</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Value</th>
                </tr>
              </thead>
              <tbody>
                ${fields}
              </tbody>
            </table>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
              Received at: ${new Date().toLocaleString()}
            </p>
          </div>
          <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Smart QR Hub - Landing Page Notifications
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
