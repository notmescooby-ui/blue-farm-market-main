import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ShieldCheck, Mail, Lock, Database, MapPin, Activity, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "BlueFarm Privacy Policy | Legal & Data Protection Disclosures" },
      {
        name: "description",
        content:
          "Official Privacy Policy for BlueFarm mobile application and services, explaining data processing, IoT water telemetry, on-device Aadhaar verification, location services, GDPR/DPDP rights, and account deletion.",
      },
      { property: "og:title", content: "BlueFarm Privacy Policy" },
      {
        property: "og:description",
        content:
          "Official Privacy Policy for BlueFarm aquaculture platform, mobile application and services. Compliant with Google Play policies and data protection regulations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-foam py-12 border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-4 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              Official Legal Policy
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-primary sm:text-4xl">
              BlueFarm Privacy Policy
            </h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Effective Date: October 27, 2026 | Compliant with Google Play Store &amp; DPDP
              Guidelines
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10 text-foreground/90 space-y-8 leading-relaxed">
            <p className="text-base text-foreground/85">
              BlueFarm helps aquaculture farmers manage pond ecosystems, monitor water telemetry,
              and access aquaculture-related commerce, including verified produce markets,
              collection hubs, and cold-storage facilities. This policy explains what information
              BlueFarm collects and processes, why it is used, how third-party integrations operate,
              and the comprehensive choices available to you.
            </p>

            {/* Privacy Highlights Callout */}
            <div className="rounded-xl border-l-4 border-primary bg-foam p-5 text-sm space-y-2">
              <strong className="font-semibold text-primary block text-base">
                Privacy Highlights at a Glance
              </strong>
              <div className="grid gap-2 sm:grid-cols-2 text-xs sm:text-sm text-foreground/85">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>On-Device Aadhaar OCR:</strong> Document images and numbers never leave
                    your device.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Ephemeral GPS:</strong> Coordinates for &ldquo;Market Near Me&rdquo; are
                    held in memory only.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Telemetry Security:</strong> Water readings (pH, DO, Temp) are
                    restricted to your farm account.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Complete Deletion Rights:</strong> Self-service portal at{" "}
                    <Link to="/delete-account" className="underline font-semibold text-primary">
                      /delete-account
                    </Link>
                    .
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>1. Information We Collect or Process</span>
              </h2>
              <ul className="mt-4 list-disc pl-6 space-y-2.5 text-sm text-foreground/85">
                <li>
                  <strong>Account &amp; Authentication Information:</strong> Information you provide
                  to sign up or sign in, such as your email address, phone number, and unique
                  Supabase authentication identifiers (UID).
                </li>
                <li>
                  <strong>Farmer &amp; Buyer Profile Data:</strong> Information entered during
                  onboarding, including your full name, contact phone, farm name, pond area in
                  acres, waterbody classification (brackish water, freshwater, saline), species
                  cultivated (Vannamei shrimp, Black Tiger shrimp, Tilapia, Seabass, etc.), PIN
                  code, state, and farm postal address.
                </li>
                <li>
                  <strong>IoT Pond Water-Quality Telemetry:</strong> Live and historical sensor
                  readings transmitted by connected hardware monitors: water pH, water temperature
                  (&deg;C), dissolved oxygen (DO mg/L), turbidity, ammonia levels (ppm), and pond
                  water level (cm/%).
                </li>
                <li>
                  <strong>Farm Geocoding &amp; Location Text:</strong> When you use automatic farm
                  location detection, coordinates are reverse-geocoded into a human-readable postal
                  address and saved in your profile.
                </li>
                <li>
                  <strong>Marketplace Activity &amp; Transaction Records:</strong> Produce listings
                  created, requested quantities, agreed prices per kilogram, payment references, and
                  order status logs.
                </li>
                <li>
                  <strong>Aadhaar Verification Flag:</strong> A simple boolean status flag (for
                  example,{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">
                    aadhaar_verified: true
                  </code>
                  ) in your profile.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <span>2. Aadhaar Document Processing &amp; On-Device Protection</span>
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                When you initiate farmer identity verification, BlueFarm utilizes Google ML Kit text
                recognition performed strictly on your local mobile device. It verifies the presence
                of official government headers, checks a 12-digit format, and compares the name
                against your profile.
              </p>
              <p className="mt-2 text-sm text-foreground/85 font-semibold text-primary">
                At no point does BlueFarm upload, transmit, or store Aadhaar document photos, full
                Aadhaar numbers, or identity document scans on remote servers. The image is
                discarded from volatile memory as soon as the session check concludes.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                3. How We Use Collected Data
              </h2>
              <div className="mt-4 space-y-2 text-sm text-foreground/85">
                <p>We use information collected to:</p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Authenticate users and protect aquaculture accounts;</li>
                  <li>
                    Visualize real-time water quality graphs, DO alerts, and automated aerator
                    notifications;
                  </li>
                  <li>
                    Enable buyers to discover authentic aquaculture produce in the BlueFarm
                    Marketplace;
                  </li>
                  <li>
                    Calculate distances to nearby collection centers, ice factories, and cold
                    storage hubs;
                  </li>
                  <li>
                    Maintain financial audit trails for completed transactions as required by
                    commercial law;
                  </li>
                  <li>Respond to support inquiries and process account deletion requests.</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <span>4. Third-Party Service Providers</span>
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                BlueFarm partners with reputable third-party infrastructure providers to deliver its
                services:
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-foreground/85">
                <li>
                  <strong>Supabase (PostgreSQL &amp; Authentication):</strong> Cloud database
                  hosting, user authentication sessions, and encrypted storage. Data resides in
                  secure database facilities guarded by Row Level Security (RLS).
                </li>
                <li>
                  <strong>OpenStreetMap &amp; Nominatim:</strong> Used strictly for
                  reverse-geocoding coordinates into postal address strings upon user request.
                  Subject to OpenStreetMap Foundation privacy policies.
                </li>
                <li>
                  <strong>Payment Gateways &amp; Banking APIs (Cashfree / UPI / Razorpay):</strong>{" "}
                  Used to securely process payment authorizations, tokenized transactions, and
                  payout settlements. BlueFarm does not store raw credit/debit card numbers or UPI
                  PINs.
                </li>
                <li>
                  <strong>Google ML Kit &amp; Google Play Services:</strong> Embedded for on-device
                  machine learning routines and app distribution / crash telemetry.
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                5. User Data Rights (GDPR &amp; India DPDP Act Compliance)
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                In compliance with the India Digital Personal Data Protection Act (DPDP) and global
                standards (such as GDPR), you enjoy enforceable rights regarding your personal data:
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-foreground/85">
                <li>
                  <strong>Right to Access:</strong> You may request a summary of the personal data
                  BlueFarm holds about you.
                </li>
                <li>
                  <strong>Right to Correction:</strong> You can edit and update your farm name, pond
                  area, phone number, and location text directly in the app or by writing to
                  support.
                </li>
                <li>
                  <strong>Right to Erasure / Deletion:</strong> You have the absolute right to have
                  your user credentials, personal profile, pond telemetry setups, and active
                  listings permanently deleted.
                </li>
                <li>
                  <strong>Right to Grievance Redressal:</strong> Direct contact with our data
                  protection team via{" "}
                  <a href="mailto:bluefarm1572@gmail.com" className="text-primary underline">
                    bluefarm1572@gmail.com
                  </a>
                  .
                </li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>6. Storage, Security and Retention</span>
              </h2>
              <div className="mt-4 space-y-3 text-sm text-foreground/85">
                <p>
                  <strong>Active Retention:</strong> Your information is retained for the lifetime
                  of your account.
                </p>
                <p>
                  <strong>Mandated Legal Retention:</strong> In the event of account deletion,
                  certain financial records (invoices, transaction timestamps, payment IDs) are
                  archived in restricted ledgers solely to comply with statutory Indian tax, GST,
                  and commercial bookkeeping obligations. All personal profile identifiers,
                  passwords, and IoT pond data are completely expunged.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                7. Google Play Account Deletion Portal
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                In accordance with Google Play&apos;s Account Deletion Policy, BlueFarm provides a
                dedicated, publicly accessible web portal for all users to request permanent
                deletion of their account and personal data:
              </p>
              <div className="mt-4 rounded-xl border border-primary/30 bg-foam p-5 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-primary text-base">
                    BlueFarm Account Deletion Portal
                  </h4>
                  <p className="text-foreground/80 mt-1">
                    Delete your account using OTP verification, password login, or manual request
                    ticket.
                  </p>
                </div>
                <Link
                  to="/delete-account"
                  className="shrink-0 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Open Deletion Portal &rarr;
                </Link>
              </div>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                8. Contact &amp; Grievance Officer
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                For questions, concerns, data access requests, or deletion inquiries:
              </p>
              <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-5">
                <p className="font-semibold text-primary">BlueFarm Privacy &amp; Data Protection</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-foreground/85">
                  <Mail className="h-4 w-4 text-primary" />
                  Official Contact:{" "}
                  <a
                    href="mailto:bluefarm1572@gmail.com"
                    className="font-medium text-primary underline hover:text-primary/80"
                  >
                    bluefarm1572@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
