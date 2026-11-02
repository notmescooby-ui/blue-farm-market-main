import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BLUEFARM_GMAIL = "bluefarm1572@gmail.com";
const DEFAULT_FROM = Deno.env.get("SENDER_EMAIL") || "BlueFarm Security <onboarding@resend.dev>";

interface DeletionEmailPayload {
  reference_code?: string;
  user_name?: string;
  account_type?: string;
  contact?: string;
  user_email?: string | null;
  reason?: string | null;
  requested_at?: string;
  // Database Webhook shape
  type?: string;
  table?: string;
  record?: {
    reference_code?: string;
    account_type?: string;
    reason?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    requested_at?: string;
    user_id?: string;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error(
        "[send-deletion-email] RESEND_API_KEY secret is missing! Set it using: npx supabase secrets set RESEND_API_KEY=re_..."
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: "RESEND_API_KEY secret is not configured in Supabase Edge Functions environment.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const body: DeletionEmailPayload = await req.json().catch(() => ({}));

    // Normalize parameters (handles both direct frontend invocation and database webhook INSERT payload)
    let reference_code = body.reference_code;
    let account_type = body.account_type || "farmer";
    let user_name = body.user_name || "BlueFarm User";
    let contact = body.contact || "";
    let user_email = body.user_email || null;
    let reason = body.reason || null;
    let requested_at = body.requested_at;

    // Database webhook payload from public.account_deletion_requests
    if (body.record) {
      reference_code = body.record.reference_code || reference_code;
      account_type = body.record.account_type || account_type;
      reason = body.record.reason || reason;
      user_email = body.record.contact_email || user_email;
      contact = body.record.contact_phone || body.record.contact_email || contact || "Not specified";
      requested_at = body.record.requested_at || requested_at;
    }

    if (!reference_code) {
      reference_code = "BF-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    const cleanName = (user_name && user_name.trim()) || "BlueFarm User";
    const formattedRole = account_type.charAt(0).toUpperCase() + account_type.slice(1);
    const cleanReason = (reason && reason.trim()) ? reason.trim() : "No reason provided by user.";
    const formattedDate = requested_at
      ? new Date(requested_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"
      : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";

    console.log(`[send-deletion-email] Processing deletion notification for ref: ${reference_code}, role: ${formattedRole}`);

    // 1. Send Admin Notification to bluefarm1572@gmail.com
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: DEFAULT_FROM,
        to: [BLUEFARM_GMAIL],
        subject: `[BlueFarm] New Account Deletion Request - ${cleanName} (${reference_code})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #182C30; background: #F2F7F5; border-radius: 12px; border: 1px solid #AEC6C2;">
            <div style="border-bottom: 2px solid #3D676F; padding-bottom: 12px; margin-bottom: 16px;">
              <h2 style="color: #3D676F; margin: 0; font-size: 22px;">BlueFarm Account Deletion Notice</h2>
              <p style="color: #628788; margin: 4px 0 0 0; font-size: 13px; font-weight: 600;">Google Play Compliance & Security Audit</p>
            </div>
            
            <p style="font-size: 14px; line-height: 1.5;">A user has submitted an official request to permanently delete their BlueFarm account and associated farm data.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #DDEBE6;">
              <tr style="border-bottom: 1px solid #DDEBE6;"><td style="padding: 10px 14px; font-size: 13px; color: #436970; width: 35%;"><strong>User's Name:</strong></td><td style="padding: 10px 14px; font-size: 14px; font-weight: 600;">${cleanName}</td></tr>
              <tr style="border-bottom: 1px solid #DDEBE6;"><td style="padding: 10px 14px; font-size: 13px; color: #436970;"><strong>Reference Code:</strong></td><td style="padding: 10px 14px; font-size: 14px; font-weight: bold; color: #3D676F;">${reference_code}</td></tr>
              <tr style="border-bottom: 1px solid #DDEBE6;"><td style="padding: 10px 14px; font-size: 13px; color: #436970;"><strong>Account Type:</strong></td><td style="padding: 10px 14px; font-size: 14px;">${formattedRole}</td></tr>
              <tr style="border-bottom: 1px solid #DDEBE6;"><td style="padding: 10px 14px; font-size: 13px; color: #436970;"><strong>Contact Info:</strong></td><td style="padding: 10px 14px; font-size: 14px;">${contact}</td></tr>
              <tr><td style="padding: 10px 14px; font-size: 13px; color: #436970;"><strong>Requested At:</strong></td><td style="padding: 10px 14px; font-size: 14px;">${formattedDate}</td></tr>
            </table>

            <div style="margin-top: 16px; padding: 14px; background: #FFF5F5; border-left: 4px solid #B24646; border-radius: 6px;">
              <strong style="color: #B24646; font-size: 13px; display: block; margin-bottom: 4px;">Reason for Deletion:</strong>
              <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.4;">"${cleanReason}"</p>
            </div>

            <div style="margin-top: 20px; padding: 12px; background: #DDEBE6; border-radius: 8px; font-size: 12px; color: #182C30; text-align: center;">
              Status tracking is available at <a href="https://bluefarmaccountdeletion.vercel.app/track" style="color: #3D676F; font-weight: 600;">https://bluefarmaccountdeletion.vercel.app/track</a>
            </div>
          </div>
        `,
      }),
    });

    const adminData = await adminEmailRes.json().catch(() => ({}));
    if (!adminEmailRes.ok) {
      console.error("[send-deletion-email] Resend API Error (Admin Email):", adminEmailRes.status, adminData);
      // Detailed diagnostics for Resend error 403 (unverified domain / test email restriction)
      if (adminEmailRes.status === 403) {
        console.error(
          "[send-deletion-email] 403 FORBIDDEN: Resend free tier restricts testing emails to the email address registered on your Resend account. Ensure bluefarm1572@gmail.com is the registered email on Resend or verify your custom domain."
        );
      }
    } else {
      console.log("[send-deletion-email] Admin notification delivered successfully:", adminData?.id);
    }

    // 2. Send User Confirmation (if valid user email provided)
    let userEmailSent = false;
    if (user_email && user_email.includes("@") && !user_email.includes("example.com")) {
      const userEmailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: DEFAULT_FROM,
          to: [user_email.trim()],
          subject: `Your BlueFarm Account Deletion Request [${reference_code}]`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #182C30; background: #F2F7F5; border-radius: 12px; border: 1px solid #AEC6C2;">
              <h2 style="color: #3D676F; margin-top: 0;">BlueFarm Account Deletion Confirmation</h2>
              <p>Hello <strong>${cleanName}</strong>,</p>
              <p>Your request to delete your BlueFarm account and data has been received and logged.</p>
              
              <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid #DDEBE6; margin: 20px 0; text-align: center;">
                <span style="font-size: 12px; color: #436970; text-transform: uppercase; letter-spacing: 1px;">Official Reference Code</span>
                <div style="font-size: 24px; font-weight: 800; color: #3D676F; margin-top: 4px;">${reference_code}</div>
              </div>

              <p style="font-size: 14px; color: #436970;">You can check the processing status of your deletion request anytime using your Reference Code:</p>
              <p style="text-align: center; margin: 20px 0;">
                <a href="https://bluefarmaccountdeletion.vercel.app/track" style="display: inline-block; background: #3D676F; color: #FFFFFF; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px;">Track Request Status</a>
              </p>
              <p style="font-size: 12px; color: #628788; border-top: 1px solid #DDEBE6; padding-top: 12px;">If you did not request this deletion, contact support immediately at bluefarm1572@gmail.com.</p>
            </div>
          `,
        }),
      });

      if (userEmailRes.ok) {
        userEmailSent = true;
      } else {
        const userData = await userEmailRes.json().catch(() => ({}));
        console.warn("[send-deletion-email] User confirmation email error:", userEmailRes.status, userData);
      }
    }

    return new Response(
      JSON.stringify({
        success: adminEmailRes.ok,
        reference_code,
        admin_notified: adminEmailRes.ok,
        user_notified: userEmailSent,
        admin_error: adminEmailRes.ok ? undefined : adminData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: adminEmailRes.ok ? 200 : 502,
      }
    );
  } catch (error) {
    console.error("[send-deletion-email] Unhandled exception:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

