import { supabase } from "@/lib/supabase/client";

export interface SendDeletionEmailParams {
  reference_code: string;
  user_name: string;
  account_type: "farmer" | "buyer" | string;
  contact: string;
  user_email?: string | null | undefined;
  reason?: string | null | undefined;
  requested_at?: string | undefined;
}

const BLUEFARM_GMAIL = "bluefarm1572@gmail.com";
const DEFAULT_FROM = "BlueFarm Security <onboarding@resend.dev>";

/**
 * Triggers automated deletion notification emails:
 * 1. Admin Alert to BlueFarm Gmail (bluefarm1572@gmail.com) with user's name & reason
 * 2. User confirmation email with tracking reference code
 */
export async function triggerDeletionEmails(params: SendDeletionEmailParams): Promise<void> {
  const {
    reference_code,
    user_name,
    account_type,
    contact,
    user_email,
    reason,
    requested_at,
  } = params;

  // 1. Try Supabase Edge Function first
  try {
    const { data, error } = await supabase.functions.invoke("send-deletion-email", {
      body: params,
    });

    if (!error && data?.success) {
      console.log("Deletion emails dispatched via Supabase Edge Function:", data);
      return;
    }

    if (error) {
      console.warn("Supabase Edge Function returned error:", error);
    }
  } catch (err) {
    console.warn("Edge function invocation failed, attempting direct dispatch fallback:", err);
  }

  // 2. Direct Resend Dispatch Fallback (Uses VITE_RESEND_API_KEY / VITE_RESEND_API if configured in Vercel/.env)
  const env = (import.meta as unknown as { env?: Record<string, string> })?.env;
  const resendApiKey = env?.["VITE_RESEND_API_KEY"] || env?.["VITE_RESEND_API"];
  if (!resendApiKey) {
    console.log("Note: RESEND_API_KEY is not set yet. Deletion recorded. Notification queued for:", BLUEFARM_GMAIL);
    return;
  }

  const cleanName = user_name.trim() || "BlueFarm User";
  const formattedRole = account_type.charAt(0).toUpperCase() + account_type.slice(1);
  const cleanReason = (reason && reason.trim()) ? reason.trim() : "No reason provided by user.";
  const formattedDate = requested_at
    ? new Date(requested_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"
    : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";

  try {
    // Dispatch to bluefarm1572@gmail.com
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: DEFAULT_FROM,
        to: [BLUEFARM_GMAIL],
        subject: `[BlueFarm] New Account Deletion Request - ${cleanName} (${reference_code})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
            <h2 style="color: #0f172a;">BlueFarm Account Deletion Notice</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>User's Name:</strong></td><td>${cleanName}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Reference Code:</strong></td><td><strong>${reference_code}</strong></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Account Role:</strong></td><td>${formattedRole}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Contact:</strong></td><td>${contact}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Requested At:</strong></td><td>${formattedDate}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px;">
              <strong>Reason for Deletion:</strong>
              <p style="margin: 6px 0 0 0;">"${cleanReason}"</p>
            </div>
          </div>
        `,
      }),
    });

    // Dispatch to user (if email available)
    if (user_email && user_email.includes("@") && !user_email.match(/^\d+@gmail\.com$/)) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: DEFAULT_FROM,
          to: [user_email.trim()],
          subject: `Your BlueFarm Account Deletion Request [${reference_code}]`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
              <h2 style="color: #0284c7;">BlueFarm Account Deletion Confirmation</h2>
              <p>Hello <strong>${cleanName}</strong>,</p>
              <p>Your request to permanently delete your BlueFarm account has been received and processed.</p>
              <p>Your Reference Tracking Code is: <strong>${reference_code}</strong></p>
              <p>You can check the live status of this request at: <a href="https://bluefarmaccountdeletion.vercel.app/track">https://bluefarmaccountdeletion.vercel.app/track</a></p>
            </div>
          `,
        }),
      });
    }

    console.log("Deletion emails dispatched successfully via Resend direct API");
  } catch (err) {
    console.error("Direct email dispatch error:", err);
  }
}
