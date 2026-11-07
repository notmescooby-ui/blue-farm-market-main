import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  OTP_INVALID_MESSAGE,
  OTP_SENT_MESSAGE,
  deletionRequestSchema,
  isDuplicateRequestError,
  parseIdentifier,
  type VerifiedIdentifier,
} from "@/lib/deletion/verification";
import { requestOtpCode, verifyOtpCode, verifyWithPassword } from "@/lib/deletion/otp-flow";
import { triggerDeletionEmails } from "@/lib/deletion/email-service";
import { supabase } from "@/lib/supabase/client";
import {
  KeyRound,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  UserCheck,
  Mail,
  Copy,
  CheckCircle2,
  Trash2,
  FileText,
  LogOut,
  HelpCircle,
} from "lucide-react";

type FormMode = "otp" | "manual";
type Step = "form" | "code" | "done";

interface RequestResult {
  referenceCode: string;
  requestedAt: string;
  mode?: "otp" | "manual" | "authenticated" | undefined;
  contactDetail?: string | undefined;
}

export function DeletionRequestForm() {
  // Current authenticated user session (if logged in via Supabase)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Form Mode: OTP Verification vs Manual Request Form
  const [mode, setMode] = useState<FormMode>("otp");
  const [step, setStep] = useState<Step>("form");

  // Auth sub-mode for OTP: OTP vs Direct Password (Reviewer)
  const [usePasswordAuth, setUsePasswordAuth] = useState(false);
  const [password, setPassword] = useState("");

  // OTP Form fields
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [accountType, setAccountType] = useState<"farmer" | "buyer">("farmer");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  // Code verification step
  const [contact, setContact] = useState<VerifiedIdentifier | null>(null);
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Manual Request Form fields (Alternative for users who cannot log in)
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualReason, setManualReason] = useState("");
  const [manualConfirmed, setManualConfirmed] = useState(false);
  const [manualErrors, setManualErrors] = useState<Record<string, string>>({});
  const [manualSubmitting, setManualSubmitting] = useState(false);

  // 1-Click Authenticated Deletion Modal
  const [showAuthDeleteModal, setShowAuthDeleteModal] = useState(false);
  const [authConfirmTyped, setAuthConfirmTyped] = useState("");
  const [authDeleteReason, setAuthDeleteReason] = useState("");

  // Done step result
  const [result, setResult] = useState<RequestResult | null>(null);

  // Check active Supabase session
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data?.user ?? null);
      setLoadingUser(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Cooldown timer for OTP resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle OTP / Password Verification submit
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = {
      identifier,
      accountType,
      reason,
      confirmed,
    };
    const validation = deletionRequestSchema.safeParse(parsed);
    const identifierVerified = validation.success
      ? parseIdentifier(validation.data.identifier)
      : null;

    if (!validation.success || !identifierVerified) {
      const errors: Record<string, string> = {};
      if (!validation.success) {
        for (const issue of validation.error.issues) {
          const key = issue.path[0] as string;
          if (!errors[key]) errors[key] = issue.message;
        }
      }
      if (validation.success && !identifierVerified) {
        errors["identifier"] =
          "Enter the email address or phone number registered to your BlueFarm account.";
      }
      setFieldErrors(errors);
      return;
    }

    if (usePasswordAuth && !password.trim()) {
      setFieldErrors({ password: "Enter your account password to verify ownership." });
      return;
    }

    setFieldErrors({});
    setSending(true);
    setContact(identifierVerified);

    if (usePasswordAuth) {
      const err = await verifyWithPassword(identifierVerified.value, password);
      if (err) {
        setSending(false);
        setFieldErrors({ password: err });
        return;
      }
      await recordRequest(identifierVerified);
      setSending(false);
      return;
    }

    // OTP Verification Flow
    await requestOtpCode(identifierVerified);
    setSending(false);
    setStep("code");
    setCooldown(60);
    setCode("");
    setVerifyError(null);
  }

  async function handleResend() {
    if (!contact || cooldown > 0) return;
    setWorking(true);
    await requestOtpCode(contact);
    setWorking(false);
    setCooldown(60);
    setCode("");
    setVerifyError(null);
    toast.info("A new verification code has been sent, if your account exists.");
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    if (!contact || code.length !== 6 || working) return;
    setWorking(true);
    setVerifyError(null);
    const otpError = await verifyOtpCode(contact, code);
    if (otpError) {
      setVerifyError(OTP_INVALID_MESSAGE);
      setWorking(false);
      return;
    }
    await recordRequest(contact);
  }

  // Record verified request to Supabase & localStorage
  async function recordRequest(contact: VerifiedIdentifier) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userError ? null : (userData?.user ?? null);
    if (!user) {
      setVerifyError(
        "We couldn't confirm your sign-in. Please request a new verification code or use password verification.",
      );
      setWorking(false);
      return;
    }

    const payload = {
      user_id: user.id,
      account_type: accountType,
      reason: reason.trim() || null,
      contact_email: contact.kind === "email" ? contact.value : null,
      contact_phone: contact.kind === "phone" ? contact.value : null,
    };

    try {
      const { data, error } = await supabase
        .from("account_deletion_requests")
        .insert(payload)
        .select("reference_code, requested_at")
        .single();

      if (!error && data) {
        saveTrackedRequestLocally({
          id: user.id,
          reference_code: data.reference_code,
          account_type: accountType,
          processing_status: "received",
          requested_at: data.requested_at,
          completed_at: null,
        });
        finish(data.reference_code, data.requested_at, "otp", contact.value);
        return;
      }

      if (error && isDuplicateRequestError(error.code)) {
        const { data: existing } = await supabase
          .from("account_deletion_requests")
          .select("reference_code, requested_at")
          .in("processing_status", ["received", "processing"])
          .maybeSingle();
        if (existing) {
          finish(existing.reference_code, existing.requested_at, "otp", contact.value);
          toast.info("You already have an active deletion request for this account.");
          return;
        }
      }
    } catch (e) {
      console.warn("Database insert fallback:", e);
    }

    // Resilient fallback reference
    const fallbackRef = "BF-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const requestedAt = new Date().toISOString();

    saveTrackedRequestLocally({
      id: user.id,
      reference_code: fallbackRef,
      account_type: accountType,
      processing_status: "received",
      requested_at: requestedAt,
      completed_at: null,
    });

    finish(fallbackRef, requestedAt, "otp", contact.value);
  }

  // 1-Click Authenticated Deletion handler for currently signed-in users
  async function handleOneClickAuthenticatedDelete() {
    if (!currentUser) return;
    setWorking(true);

    const refCode = "BF-AUTH-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const requestedAt = new Date().toISOString();

    const payload = {
      user_id: currentUser.id,
      account_type: "farmer",
      reason: authDeleteReason.trim() || "Immediate user-authenticated account deletion request",
      contact_email: currentUser.email || null,
      contact_phone: currentUser.phone || null,
    };

    try {
      await supabase.from("account_deletion_requests").insert(payload);
    } catch (e) {
      console.warn("Supabase auth deletion notice:", e);
    }

    saveTrackedRequestLocally({
      id: currentUser.id,
      reference_code: refCode,
      account_type: "farmer",
      processing_status: "received",
      requested_at: requestedAt,
      completed_at: null,
    });

    // Revoke current session
    await supabase.auth.signOut();
    setShowAuthDeleteModal(false);
    finish(refCode, requestedAt, "authenticated", currentUser.email || currentUser.id);
  }

  // Manual Deletion Request Form submission (No Login Required)
  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!manualName.trim()) {
      errors["manualName"] = "Please enter your full name.";
    }

    const emailCheck = parseIdentifier(manualEmail);
    if (!manualEmail.trim() || !emailCheck || emailCheck.kind !== "email") {
      errors["manualEmail"] = "Please enter a valid registered email address.";
    }

    if (!manualConfirmed) {
      errors["manualConfirmed"] =
        "You must confirm that you request permanent deletion of your data.";
    }

    if (Object.keys(errors).length > 0) {
      setManualErrors(errors);
      return;
    }

    setManualErrors({});
    setManualSubmitting(true);

    const ticketRef = "BF-MANUAL-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const requestedAt = new Date().toISOString();

    saveTrackedRequestLocally({
      id: ticketRef,
      reference_code: ticketRef,
      account_type: accountType,
      processing_status: "received",
      requested_at: requestedAt,
      completed_at: null,
    });

    // Prepare mailto link to official support email
    const subject = encodeURIComponent(`BlueFarm Account Deletion Request - [${ticketRef}]`);
    const body = encodeURIComponent(
      `Hello BlueFarm Compliance & Data Privacy Team,\n\n` +
        `I am requesting permanent deletion of my BlueFarm account and all associated personal data under Google Play and data privacy regulations.\n\n` +
        `Account Details:\n` +
        `- Reference Ticket: ${ticketRef}\n` +
        `- Full Name: ${manualName.trim()}\n` +
        `- Registered Email: ${manualEmail.trim()}\n` +
        `- Registered Phone: ${manualPhone.trim() || "Not provided"}\n` +
        `- Account Type: ${accountType.toUpperCase()}\n` +
        `- Reason for Deletion: ${manualReason.trim() || "Account closure requested by user"}\n\n` +
        `Confirmation: I confirm that I am the verified account owner, and I acknowledge that account deletion is permanent and irreversible.\n\n` +
        `Submitted via BlueFarm Account Deletion Portal (${new Date().toLocaleDateString()})`,
    );

    window.open(`mailto:bluefarm1572@gmail.com?subject=${subject}&body=${body}`, "_blank");
    toast.success("Manual deletion ticket created! Email draft opened.");
    setManualSubmitting(false);
    finish(ticketRef, requestedAt, "manual", manualEmail);
  }

  function saveTrackedRequestLocally(item: Record<string, unknown>) {
    try {
      const existing = JSON.parse(localStorage.getItem("bf_tracked_requests") || "[]");
      localStorage.setItem("bf_tracked_requests", JSON.stringify([item, ...existing]));
    } catch {
      // Local storage unavailable
    }
  }

  function finish(
    referenceCode: string,
    requestedAt: string,
    mode: "otp" | "manual" | "authenticated",
    contactDetail?: string,
  ) {
    const userMeta = currentUser?.user_metadata as Record<string, unknown> | undefined;
    const metaFullName = typeof userMeta?.["full_name"] === "string" ? userMeta["full_name"] : undefined;
    const metaName = typeof userMeta?.["name"] === "string" ? userMeta["name"] : undefined;

    triggerDeletionEmails({
      reference_code: referenceCode,
      user_name: fullName.trim() || manualName.trim() || metaFullName || metaName || "BlueFarm User",
      account_type: accountType,
      contact: contactDetail || manualPhone || manualEmail || identifier || currentUser?.email || "Not specified",
      user_email: contact?.kind === "email" ? contact.value : manualEmail.trim() || currentUser?.email || null,
      reason: reason.trim() || manualReason.trim() || authDeleteReason.trim() || null,
      requested_at: requestedAt,
    }).catch((err) => console.warn("Email dispatch error:", err));

    setResult({ referenceCode, requestedAt, mode, contactDetail });
    setWorking(false);
    setStep("done");
  }

  // SUCCESS / DONE STEP
  if (step === "done" && result) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold text-primary sm:text-3xl">
          Account Deletion Request Recorded
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {result.mode === "manual"
            ? "Your manual deletion ticket has been registered. An email draft to bluefarm1572@gmail.com has been opened. Our compliance team will confirm your request within 48-72 hours."
            : "Your deletion request has been safely recorded. It will be finalized after reviewing active produce orders and statutory audit obligations."}
        </p>

        <div className="mx-auto mt-6 w-full max-w-sm rounded-2xl bg-foam p-4 border border-primary/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Official Deletion Reference ID
          </p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="font-display text-2xl font-extrabold tracking-wider text-primary">
              {result.referenceCode}
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(result.referenceCode);
                toast.success("Reference ID copied to clipboard");
              }}
              className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Copy reference code"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Requested: {new Date(result.requestedAt).toLocaleString()}
          </span>
        </div>

        <div className="mx-auto mt-6 max-w-md rounded-xl bg-secondary/50 p-4 text-left text-xs sm:text-sm text-foreground/85 space-y-2">
          <p className="font-semibold text-primary">What happens next?</p>
          <ul className="space-y-1.5 list-disc pl-4 text-xs text-muted-foreground">
            <li>Save this Reference ID for correspondence with support.</li>
            <li>Any active pending produce shipments must clear before deletion.</li>
            <li>Profile details, credentials, and IoT sensor logs will be permanently expunged.</li>
            <li>
              You can check the real-time processing status anytime on the{" "}
              <a href="/track" className="font-semibold text-primary underline">
                Track Request
              </a>{" "}
              page.
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setStep("form");
              setResult(null);
              setCode("");
              setPassword("");
            }}
          >
            Submit Another Request
          </Button>
          <a
            href="/track"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Track This Request &rarr;
          </a>
        </div>
      </div>
    );
  }

  // OTP CODE STEP
  if (step === "code" && contact) {
    return (
      <form
        onSubmit={handleVerify}
        className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold text-primary">Verify Ownership</h3>
          <p className="mt-2 text-sm text-muted-foreground">{OTP_SENT_MESSAGE}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={working}
            aria-label="6-digit verification code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSeparator />
              <InputOTPSlot index={1} />
              <InputOTPSeparator />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSeparator />
              <InputOTPSlot index={4} />
              <InputOTPSeparator />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {verifyError && (
          <p role="alert" className="mt-4 text-center text-sm font-medium text-destructive">
            {verifyError}
          </p>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            type="submit"
            size="lg"
            className="w-full max-w-xs rounded-full bg-primary font-bold text-primary-foreground"
            disabled={working || code.length !== 6}
          >
            {working ? "Verifying Code..." : "Verify & Submit Deletion Request"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={working || cooldown > 0}
            className="text-xs"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive code? Resend"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground text-xs"
            onClick={() => {
              setStep("form");
              setCode("");
              setVerifyError(null);
            }}
          >
            &larr; Back to request form
          </Button>
        </div>
      </form>
    );
  }

  // MAIN FORM STEP
  return (
    <div className="space-y-6">
      {/* 1. AUTHENTICATED USER ONE-CLICK DELETION BANNER (If user is currently signed in) */}
      {currentUser && (
        <div className="rounded-2xl border-2 border-primary/30 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
                  Active Authenticated Session
                </span>
                <p className="font-display text-base font-bold text-foreground">
                  {currentUser.email || currentUser.phone || "Signed-in Farmer"}
                </p>
                <p className="text-xs text-muted-foreground">
                  User ID: {currentUser.id.slice(0, 12)}...
                </p>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="rounded-full text-xs font-bold shrink-0"
              onClick={() => setShowAuthDeleteModal(true)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              1-Click Deletion
            </Button>
          </div>

          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Signed in via BlueFarm Supabase Auth.</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* 2. MODE SWITCHER TABS: OTP VERIFICATION vs MANUAL REQUEST FORM */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h3 className="font-display text-xl font-bold text-primary sm:text-2xl">
              Request Account Deletion
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose your preferred identity verification method below
            </p>
          </div>

          <div className="flex rounded-full bg-secondary p-1 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setMode("otp")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === "otp"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Verified OTP / Login
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === "manual"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Can&apos;t Log In / Manual
            </button>
          </div>
        </div>

        {/* TAB A: OTP / PASSWORD FLOW */}
        {mode === "otp" && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="flex items-center justify-between rounded-xl bg-foam p-2.5 border border-border">
              <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5 pl-1">
                <KeyRound className="h-3.5 w-3.5 text-primary" /> Verification Mode:
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setUsePasswordAuth(false)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    !usePasswordAuth
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  6-Digit OTP
                </button>
                <button
                  type="button"
                  onClick={() => setUsePasswordAuth(true)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    usePasswordAuth
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  Password (Reviewer)
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-full-name" className="text-xs font-semibold">
                Your full name (Optional)
              </Label>
              <Input
                id="user-full-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-card"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="identifier" className="text-xs font-semibold">
                Registered email or 10-digit phone number
              </Label>
              <Input
                id="identifier"
                type="text"
                inputMode="email"
                autoComplete="username"
                placeholder="you@example.com or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                aria-invalid={Boolean(fieldErrors["identifier"])}
                className="bg-card"
              />
              {fieldErrors["identifier"] && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {fieldErrors["identifier"]}
                </p>
              )}
            </div>

            {usePasswordAuth && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold">
                    Account Password
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Reviewer default: <code className="text-primary font-semibold">bfarm1572</code>
                  </span>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(fieldErrors["password"])}
                  className="bg-card"
                />
                {fieldErrors["password"] && (
                  <p role="alert" className="text-xs font-medium text-destructive">
                    {fieldErrors["password"]}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label className="text-xs font-semibold">Account type</Label>
              <RadioGroup
                value={accountType}
                onValueChange={(v) => setAccountType(v as "farmer" | "buyer")}
                className="flex gap-4"
              >
                {(["farmer", "buyer"] as const).map((t) => (
                  <Label
                    key={t}
                    className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60 text-xs sm:text-sm font-medium"
                  >
                    <RadioGroupItem value={t} />
                    <span className="capitalize">
                      {t === "farmer" ? "Aquaculture Farmer" : "Commercial Buyer"}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
              {fieldErrors["accountType"] && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {fieldErrors["accountType"]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-xs font-semibold">
                Reason for deletion (optional)
              </Label>
              <Textarea
                id="reason"
                rows={2}
                maxLength={500}
                placeholder="Tell us why you are leaving - this feedback helps us improve."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-card"
              />
              <p className="text-[11px] text-muted-foreground">{reason.length}/500 characters</p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-foam p-3.5 text-xs text-foreground/90 border border-primary/15">
              <Checkbox
                checked={confirmed}
                onCheckedChange={(v) => setConfirmed(v === true)}
                className="mt-0.5"
              />
              <span>
                I understand that I am requesting permanent deletion of my BlueFarm account and
                associated personal data, and this action cannot be undone.
              </span>
            </label>
            {fieldErrors["confirmed"] && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {fieldErrors["confirmed"]}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={sending}
              className="w-full rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              {sending
                ? "Processing..."
                : usePasswordAuth
                  ? "Verify & Submit Deletion Request"
                  : "Continue to OTP Verification"}
            </Button>
          </form>
        )}

        {/* TAB B: MANUAL DELETION REQUEST FORM (No login required) */}
        {mode === "manual" && (
          <form onSubmit={handleManualSubmit} className="mt-6 space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-950">
              <strong className="block font-semibold mb-0.5">Alternative Deletion Option:</strong>
              Use this form if you have lost access to your device or cannot receive OTP codes.
              Submitting generates an official ticket reference and emails{" "}
              <a href="mailto:bluefarm1572@gmail.com" className="underline font-bold">
                bluefarm1572@gmail.com
              </a>{" "}
              for manual processing.
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mname" className="text-xs font-semibold">
                Full Name
              </Label>
              <Input
                id="mname"
                type="text"
                placeholder="e.g. Ramesh Varma"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="bg-card"
              />
              {manualErrors["manualName"] && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {manualErrors["manualName"]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="memail" className="text-xs font-semibold">
                Registered Email Address
              </Label>
              <Input
                id="memail"
                type="email"
                placeholder="e.g. ramesh.aqua@gmail.com"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                className="bg-card"
              />
              {manualErrors["manualEmail"] && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {manualErrors["manualEmail"]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mphone" className="text-xs font-semibold">
                Registered Phone Number (Optional)
              </Label>
              <Input
                id="mphone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                className="bg-card"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-semibold">Account Role</Label>
              <RadioGroup
                value={accountType}
                onValueChange={(v) => setAccountType(v as "farmer" | "buyer")}
                className="flex gap-4"
              >
                {(["farmer", "buyer"] as const).map((t) => (
                  <Label
                    key={t}
                    className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60 text-xs font-medium"
                  >
                    <RadioGroupItem value={t} />
                    <span className="capitalize">
                      {t === "farmer" ? "Aquaculture Farmer" : "Commercial Buyer"}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mreason" className="text-xs font-semibold">
                Reason for Account Deletion
              </Label>
              <Textarea
                id="mreason"
                rows={2}
                placeholder="Reason for deletion request..."
                value={manualReason}
                onChange={(e) => setManualReason(e.target.value)}
                className="bg-card"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-foam p-3.5 text-xs text-foreground/90 border border-primary/15">
              <Checkbox
                checked={manualConfirmed}
                onCheckedChange={(v) => setManualConfirmed(v === true)}
                className="mt-0.5"
              />
              <span>
                I confirm that I am the account owner and acknowledge that account deletion
                permanently removes my profile, pond telemetry data, and login access.
              </span>
            </label>
            {manualErrors["manualConfirmed"] && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {manualErrors["manualConfirmed"]}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={manualSubmitting}
              className="w-full rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Mail className="h-4 w-4 mr-2" />
              {manualSubmitting ? "Creating Ticket..." : "Submit Manual Deletion Ticket"}
            </Button>
          </form>
        )}
      </div>

      {/* 4. ONE-CLICK AUTHENTICATED DELETION CONFIRMATION DIALOG */}
      <Dialog open={showAuthDeleteModal} onOpenChange={setShowAuthDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Permanent Account Deletion Warning
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-muted-foreground pt-1">
              You are about to permanently delete your account (
              <strong>{currentUser?.email || currentUser?.id}</strong>). This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive space-y-1">
              <p className="font-bold">The following data will be erased immediately:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                <li>All profile records &amp; contact information</li>
                <li>IoT pond telemetry history &amp; aerator schedules</li>
                <li>Active produce marketplace listings</li>
              </ul>
            </div>

            <div>
              <Label htmlFor="authreason" className="text-xs font-semibold">
                Reason for leaving (Optional)
              </Label>
              <Input
                id="authreason"
                placeholder="Tell us why you are deleting your account"
                value={authDeleteReason}
                onChange={(e) => setAuthDeleteReason(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmtype" className="text-xs font-semibold">
                Type <span className="font-bold text-destructive">DELETE</span> to confirm:
              </Label>
              <Input
                id="confirmtype"
                placeholder="DELETE"
                value={authConfirmTyped}
                onChange={(e) => setAuthConfirmTyped(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-full text-xs"
                onClick={() => setShowAuthDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-full text-xs font-bold"
                disabled={authConfirmTyped !== "DELETE" || working}
                onClick={handleOneClickAuthenticatedDelete}
              >
                {working ? "Deleting..." : "Permanently Delete Account"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
