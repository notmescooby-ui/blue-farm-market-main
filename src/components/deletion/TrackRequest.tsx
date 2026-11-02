import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  OTP_SENT_MESSAGE,
  STATUS_LABELS,
  parseIdentifier,
  type VerifiedIdentifier,
} from "@/lib/deletion/verification";
import { requestOtpCode, verifyOtpCode } from "@/lib/deletion/otp-flow";
import { supabase } from "@/lib/supabase/client";
import { Search, ShieldCheck } from "lucide-react";

interface DeletionRequestRow {
  id: string;
  reference_code: string;
  account_type: string;
  processing_status: string;
  requested_at: string;
  completed_at: string | null;
  rejection_reason?: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "completed"
      ? "bg-green-600 text-white"
      : status === "rejected"
        ? "bg-destructive/15 text-destructive"
        : "bg-secondary text-secondary-foreground";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function TrackRequest() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Search by Reference ID
  const [refQuery, setRefQuery] = useState("");
  const [searchingRef, setSearchingRef] = useState(false);
  const [refError, setRefError] = useState<string | null>(null);

  // Verification flow
  const [identifier, setIdentifier] = useState("");
  const [contact, setContact] = useState<VerifiedIdentifier | null>(null);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [showOtpAuth, setShowOtpAuth] = useState(false);

  // Requests list
  const [requests, setRequests] = useState<DeletionRequestRow[] | null>(null);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setSession(nextSession);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Load and refresh tracked requests
  useEffect(() => {
    const localRequests: DeletionRequestRow[] = (() => {
      try {
        return JSON.parse(localStorage.getItem("bf_tracked_requests") || "[]");
      } catch {
        return [];
      }
    })();

    async function loadRequests() {
      setLoadingRequests(true);
      const combined: DeletionRequestRow[] = [];

      // 1. Refresh local requests from live Supabase RPC
      for (const req of localRequests) {
        try {
          const { data } = await supabase.rpc("get_deletion_request_status", {
            p_reference_code: req.reference_code,
          });
          if (data && data.length > 0) {
            combined.push(data[0] as DeletionRequestRow);
          } else {
            combined.push(req);
          }
        } catch {
          combined.push(req);
        }
      }

      // 2. If authenticated session exists, fetch account requests
      if (session) {
        try {
          const { data } = await supabase
            .from("account_deletion_requests")
            .select("id, reference_code, account_type, processing_status, requested_at, completed_at, rejection_reason")
            .order("requested_at", { ascending: false });
          if (data) {
            combined.push(...(data as DeletionRequestRow[]));
          }
        } catch (e) {
          console.warn("Session request load:", e);
        }
      }

      const seen = new Set<string>();
      const unique = combined.filter((r) => {
        if (seen.has(r.reference_code)) return false;
        seen.add(r.reference_code);
        return true;
      });

      setRequests(unique.length > 0 ? unique : null);
      setLoadingRequests(false);
    }

    loadRequests();
  }, [session]);

  // Lookup by Reference ID directly
  async function handleLookupByRef(event: React.FormEvent) {
    event.preventDefault();
    const cleanRef = refQuery.trim().toUpperCase();
    if (!cleanRef) return;

    setSearchingRef(true);
    setRefError(null);

    try {
      const { data, error } = await supabase.rpc("get_deletion_request_status", {
        p_reference_code: cleanRef,
      });

      if (!error && data && data.length > 0) {
        const found = data[0] as DeletionRequestRow;
        setRequests((prev) => {
          const others = (prev || []).filter((r) => r.reference_code !== found.reference_code);
          return [found, ...others];
        });
        setRefQuery("");
      } else {
        setRefError(`No deletion request found for reference code "${cleanRef}". Please check the ID.`);
      }
    } catch {
      setRefError("Unable to retrieve request status. Please try again.");
    } finally {
      setSearchingRef(false);
    }
  }

  async function handleSendCode(event: React.FormEvent) {
    event.preventDefault();
    const parsed = parseIdentifier(identifier);
    if (!parsed) {
      setVerifyError("Enter the email address or phone number registered to your account.");
      return;
    }
    setVerifyError(null);
    setSending(true);
    setContact(parsed);
    await requestOtpCode(parsed);
    setSending(false);
    setCodeSent(true);
    setCode("");
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    if (!contact || code.length !== 6 || verifying) return;
    setVerifying(true);
    setVerifyError(null);
    const otpError = await verifyOtpCode(contact, code);
    if (otpError) {
      setVerifyError(otpError);
      setVerifying(false);
      return;
    }
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setVerifying(false);
    setShowOtpAuth(false);
  }

  if (loadingSession) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Search by Reference ID Form */}
      <form
        onSubmit={handleLookupByRef}
        className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-primary">
              Track by Reference ID
            </h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Enter your tracking code (e.g. BF-1A02245F) to check your current deletion status.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Input
            value={refQuery}
            onChange={(e) => setRefQuery(e.target.value)}
            placeholder="e.g. BF-1A02245F"
            className="font-mono uppercase font-bold tracking-wider"
          />
          <Button type="submit" disabled={searchingRef || !refQuery.trim()}>
            {searchingRef ? "Checking..." : "Track"}
          </Button>
        </div>

        {refError && (
          <p role="alert" className="mt-3 text-sm font-medium text-destructive">
            {refError}
          </p>
        )}
      </form>

      {/* Tracked Results List */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-primary">Your deletion status</h3>
          {session ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={async () => {
                await supabase.auth.signOut();
                setSession(null);
              }}
            >
              Sign out
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary"
              onClick={() => setShowOtpAuth(!showOtpAuth)}
            >
              {showOtpAuth ? "Hide login" : "Verify with phone/email"}
            </Button>
          )}
        </div>

        {loadingRequests && (
          <p className="mt-4 text-center text-sm text-muted-foreground">Loading request status...</p>
        )}

        {!loadingRequests && (!requests || requests.length === 0) && (
          <div className="mt-4 rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
            No active tracked requests found. Enter your Reference ID above or submit a request from the{" "}
            <a href="/" className="font-medium text-primary underline">
              home page
            </a>
            .
          </div>
        )}

        <div className="mt-4 grid gap-4">
          {requests?.map((req) => (
            <div key={req.reference_code} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold tracking-wide text-primary">
                    {req.reference_code}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {req.account_type.charAt(0).toUpperCase() + req.account_type.slice(1)} account ·
                    requested{" "}
                    {new Date(req.requested_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {req.completed_at &&
                      ` · completed ${new Date(req.completed_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`}
                  </p>
                </div>
                <StatusBadge status={req.processing_status} />
              </div>

              {req.processing_status === "completed" && (
                <div className="mt-4 rounded-xl bg-green-50 p-3.5 border border-green-200 text-sm text-green-900">
                  <div className="flex items-center gap-2 font-bold text-green-800">
                    <ShieldCheck className="h-4 w-4" />
                    Account Permanently Deleted
                  </div>
                  <p className="mt-1 text-xs text-green-700 leading-relaxed">
                    Your personal profile, contact information, and login credentials have been completely removed from BlueFarm servers. You will no longer be able to sign in with this account.
                  </p>
                </div>
              )}

              {req.processing_status === "received" && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Your request is recorded. BlueFarm is reviewing active orders and obligations prior to final data scrubbing.
                </p>
              )}

              {req.processing_status === "rejected" && req.rejection_reason && (
                <p className="mt-3 text-sm text-destructive">
                  Reason: {req.rejection_reason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Optional OTP Verification Drawer */}
      {showOtpAuth && !session && (
        <div className="mt-6 border-t border-border pt-6">
          {!codeSent || !contact ? (
            <form onSubmit={handleSendCode} className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h4 className="font-display text-base font-bold text-primary">Verify account ownership</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter your registered contact to view all deletion requests on your account.
              </p>
              <div className="mt-4 grid gap-2">
                <Label htmlFor="track-identifier">Email or phone</Label>
                <Input
                  id="track-identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com or 98765 43210"
                />
              </div>
              {verifyError && <p className="mt-2 text-xs font-medium text-destructive">{verifyError}</p>}
              <Button type="submit" className="mt-4 w-full" size="sm" disabled={sending}>
                {sending ? "Sending code..." : "Send code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
              <h4 className="font-display text-base font-bold text-primary">Enter verification code</h4>
              <p className="mt-1 text-xs text-muted-foreground">{OTP_SENT_MESSAGE}</p>
              <div className="mt-4 flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={setCode} disabled={verifying}>
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
              {verifyError && <p className="mt-3 text-xs font-medium text-destructive">{verifyError}</p>}
              <Button type="submit" className="mt-4 w-full" size="sm" disabled={verifying || code.length !== 6}>
                {verifying ? "Checking..." : "Verify & View Requests"}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
