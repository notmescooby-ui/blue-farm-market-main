import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ban,
  Clock,
  FileWarning,
  Lock,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Mail,
  Search,
  FileText,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DeletionRequestForm } from "@/components/deletion/DeletionRequestForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/account-deletion")({
  head: () => ({
    meta: [
      { title: "Delete Your BlueFarm Account | Official Deletion Portal" },
      {
        name: "description",
        content:
          "Official BlueFarm account deletion request portal. Complies with Google Play account deletion requirement. One-click authenticated deletion, OTP verification, and manual request options.",
      },
      { property: "og:title", content: "Delete Your BlueFarm Account | BlueFarm" },
      {
        property: "og:description",
        content:
          "Official account deletion request portal for BlueFarm users. Verified, secure, and Google Play compliant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountDeletionPage,
});

const BEFORE_YOU_CONTINUE = [
  {
    title: "Account access revoked",
    description:
      "When deletion is requested, your credentials are deactivated and you will be signed out from all BlueFarm mobile applications and web services.",
  },
  {
    title: "Pond telemetry erased",
    description:
      "Your farmer or buyer profile, pond specifications, and historical IoT water telemetry data (pH, DO, temperature) are permanently expunged.",
  },
  {
    title: "Active trades must clear",
    description:
      "Unresolved orders, ongoing harvest deliveries, or unsettled marketplace transactions must be completed before an account can be closed.",
  },
  {
    title: "Deletion is irreversible",
    description:
      "Once finalized, the account cannot be restored. If you wish to use BlueFarm in the future, a new account registration will be required.",
  },
  {
    title: "Statutory tax archiving",
    description:
      "Completed billing invoices and transaction records are preserved in restricted archives strictly to fulfill Indian GST and commercial audit laws.",
  },
  {
    title: "Uninstalling is not deleting",
    description:
      "Removing the mobile application from your smartphone only removes the local APK. Submitting this verified form is required to delete your cloud data.",
  },
];

const FAQ = [
  {
    q: "Is deleting my account the same as uninstalling the app?",
    a: "No. Uninstalling only removes the application from your phone. Your BlueFarm cloud account, pond configurations, and telemetry history remain on our servers. To permanently remove your account and personal data, you must submit a deletion request through this portal.",
  },
  {
    q: "How does BlueFarm verify my identity before deleting?",
    a: "To prevent unauthorized or malicious deletion of your account and farm data, BlueFarm requires ownership verification: either via a 6-digit one-time password (OTP) sent to your registered phone or email, an authenticated password login, or an authenticated Supabase session. If you no longer have access to your credentials, you can submit a manual request ticket with verification details.",
  },
  {
    q: "How long does it take for my account to be deleted?",
    a: "Account access is terminated immediately upon successful verification. Your personal profile, pond configurations, and IoT water sensor logs are purged from our active databases within 24 to 48 hours.",
  },
  {
    q: "What data is permanently expunged versus retained?",
    a: "All personal identifiers (name, phone, email, Aadhaar status flag), pond parameters, live sensor logs, and marketplace listings are completely expunged. Only completed payment invoices and transaction ledgers are kept in a restricted archive solely to comply with statutory Indian tax (GST) and accounting requirements.",
  },
  {
    q: "How can I track the progress of my deletion request?",
    a: "When you submit a request, you will receive a unique Reference ID (e.g., BF-XXXXXX). You can check its current status at any time on our Track Request page (/track).",
  },
  {
    q: "What if I cannot receive an OTP or lost my registered phone?",
    a: "On the deletion form, select the 'Can't Log In / Manual' tab. You can provide your details and an alternate contact method. Our compliance desk will reach out to verify your identity and process the deletion manually.",
  },
  {
    q: "Can I cancel my deletion request?",
    a: "If you submitted a request by mistake and it has not yet been processed, please email our support desk immediately at bluefarm1572@gmail.com with your Reference ID (starts with BF-).",
  },
];

export function AccountDeletionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10 selection:text-primary">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 md:py-24 border-b border-border/60">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-60" />
          
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-2xs backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Official Verification Portal &bull; Google Play Compliant
            </div>

            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Delete your BlueFarm account and associated data
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              Request permanent erasure of your farmer or buyer account, pond profiles, and IoT sensor telemetry. Securely verified in compliance with Google Play Store data safety standards.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#deletion-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
              >
                <Trash2 className="h-4 w-4" />
                Submit Deletion Request
              </a>
              <Link
                to="/track"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3 text-sm font-semibold text-foreground shadow-2xs backdrop-blur-xs transition-all duration-200 hover:bg-secondary active:scale-[0.98]"
              >
                <Search className="h-4 w-4 text-primary" />
                Track Status
              </Link>
              <a
                href="#data-policy"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/50"
              >
                <ScrollText className="h-4 w-4" />
                Data Retention Rules
              </a>
            </div>
          </div>
        </section>

        {/* 3-STEP FLOW: REFINED STEPPER */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs shadow-xs">
            <div className="grid gap-8 sm:grid-cols-3 relative">
              <div className="space-y-2">
                <span className="font-display text-xs font-bold uppercase tracking-widest text-primary/80">
                  Step 01
                </span>
                <h3 className="font-display text-base font-bold text-foreground">
                  Provide Identifier
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Enter the registered mobile phone number or email linked to your BlueFarm account.
                </p>
              </div>

              <div className="space-y-2 sm:border-l sm:border-border/60 sm:pl-8">
                <span className="font-display text-xs font-bold uppercase tracking-widest text-primary/80">
                  Step 02
                </span>
                <h3 className="font-display text-base font-bold text-foreground">
                  Verify Ownership
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Authenticate using a secure 6-digit OTP code, your account password, or a manual ticket.
                </p>
              </div>

              <div className="space-y-2 sm:border-l sm:border-border/60 sm:pl-8">
                <span className="font-display text-xs font-bold uppercase tracking-widest text-primary/80">
                  Step 03
                </span>
                <h3 className="font-display text-base font-bold text-foreground">
                  Permanent Erasure
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Your credentials and pond telemetry are deleted, and a Reference ID is issued for tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DELETION FORM SECTION */}
        <section id="deletion-form" className="scroll-mt-24 py-12 sm:py-16">
          <div className="mx-auto max-w-xl px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Account Deletion Form
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                Ownership verification is required to safeguard against unauthorized account destruction.
              </p>
            </div>

            <DeletionRequestForm />
          </div>
        </section>

        {/* DATA POLICY COMPARISON SHEET */}
        <section id="data-policy" className="scroll-mt-24 border-t border-border/70 bg-secondary/30 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Data Safety Disclosures
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                What data is expunged versus retained
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                In strict adherence to Google Play Store data safety policies and statutory Indian commercial regulations:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Permanently Expunged */}
              <div className="rounded-3xl border border-destructive/20 bg-card p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 pb-4 border-b border-border/70">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive shrink-0">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      Permanently Expunged
                    </h3>
                    <p className="text-xs text-muted-foreground">Purged from active databases within 24–48 hours</p>
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-xs sm:text-sm text-foreground/85">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    <span>
                      <strong>Account Credentials:</strong> Mobile phone number, email address, password hashes, and active authentication tokens.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    <span>
                      <strong>Profile Records:</strong> Full farmer or buyer name, postal farm address, reverse-geocoded coordinates, and Aadhaar verification status flag.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    <span>
                      <strong>Pond Configurations:</strong> Pond dimensions, acreage, stocking density, waterbody classifications, and cultivated species.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    <span>
                      <strong>IoT Water Telemetry:</strong> All historical water sensor logs including pH, dissolved oxygen, temperature, and water level.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    <span>
                      <strong>Marketplace Activity:</strong> Active produce listings, draft inquiries, and public farmer profiles.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Statutorily Retained */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 pb-4 border-b border-border/70">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      Statutorily Retained
                    </h3>
                    <p className="text-xs text-muted-foreground">Preserved solely to fulfill legal compliance obligations</p>
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-xs sm:text-sm text-foreground/85">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>
                      <strong>Tax &amp; Invoice Records:</strong> Completed commercial transactions, billing invoices, and GST records retained strictly as mandated by Indian taxation laws.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>
                      <strong>Dispute Logs:</strong> Records of active or unresolved payment arbitrations or legal claims, preserved only until final settlement.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>
                      <strong>Restricted Storage Guarantee:</strong> Any statutorily preserved records are sealed in read-only ledgers and permanently isolated from marketing or user profiling.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE YOU PROCEED: CLEAN INFORMATIONAL GUIDE */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Essential Checkpoints
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Before you finalize your deletion request
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BEFORE_YOU_CONTINUE.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <h3 className="font-display text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border/80 bg-card p-5 text-xs sm:text-sm text-foreground/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ScrollText className="h-4 w-4 text-primary shrink-0" />
              <span>Looking for detailed legal and data handling disclosures?</span>
            </div>
            <Link
              to="/privacy"
              className="inline-flex items-center justify-center shrink-0 font-bold text-primary hover:underline"
            >
              Read BlueFarm Privacy Policy &rarr;
            </Link>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="border-t border-border/70 bg-secondary/20 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Support &amp; Clarity
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {FAQ.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-border/50 py-1">
                    <AccordionTrigger className="text-left font-display text-sm sm:text-base font-bold text-foreground hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ASSISTANCE BANNER */}
        <section className="border-t border-border/80 bg-card py-12">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Need assistance with your deletion request?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              If you have lost access to your registered device or require assistance, our compliance desk is ready to help.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:bluefarm1572@gmail.com?subject=BlueFarm%20Account%20Deletion%20Assistance"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
              >
                <Mail className="h-4 w-4" />
                Email Support (bluefarm1572@gmail.com)
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Helpdesk &amp; Inquiries
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
