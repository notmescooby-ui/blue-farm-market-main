import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FileText, ShieldAlert, Scale, AlertTriangle, Mail } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | BlueFarm Aquaculture Platform" },
      {
        name: "description",
        content:
          "Official Terms of Service for BlueFarm aquaculture management and fish marketplace platform. Review platform rules, IoT automation disclaimers, and marketplace conditions.",
      },
      { property: "og:title", content: "Terms of Service | BlueFarm" },
      {
        property: "og:description",
        content:
          "Platform terms, marketplace conditions, and IoT automation disclaimers for BlueFarm aquaculture farmers and commercial buyers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-foam py-12 border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-4 py-1.5 text-xs font-semibold text-primary">
              <Scale className="h-4 w-4" />
              Legal Agreement
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-primary sm:text-4xl">
              BlueFarm Terms of Service
            </h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Last Updated: October 2026 | Effective for all BlueFarm Mobile App &amp; Web Users
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10 text-foreground/90 space-y-8 leading-relaxed">
            <p className="text-base text-foreground/85">
              Welcome to <strong>BlueFarm</strong>. These Terms of Service (&ldquo;Terms&rdquo;)
              govern your access to and use of the BlueFarm mobile applications, website, digital
              aquaculture marketplace, IoT telemetry services, and related offerings (collectively,
              the &ldquo;Platform&rdquo;). By creating an account, connecting hardware devices, or
              browsing produce listings, you agree to be bound by these Terms.
            </p>

            {/* Quick Summary Callout */}
            <div className="rounded-xl border-l-4 border-primary bg-foam p-5 text-sm space-y-1">
              <strong className="font-semibold text-primary block text-base">
                Key Highlights for Farmers &amp; Buyers
              </strong>
              <p className="text-foreground/85">
                BlueFarm provides smart IoT telemetry assistance (monitoring water pH, dissolved
                oxygen, temperature, water level) and a digital trading marketplace. BlueFarm is a
                technology enabler: sensor readings and automated feeder/aerator alerts are
                assistive recommendations and do not replace professional aquaculture supervision.
                Buyers and farmers transact directly for physical harvest deliveries.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border flex items-center gap-2">
                <span>1. Eligibility and Account Registration</span>
              </h2>
              <div className="mt-4 space-y-3 text-sm text-foreground/85">
                <p>
                  To use BlueFarm, you must be at least 18 years of age and capable of entering into
                  legally binding contracts under applicable law.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Farmer Accounts:</strong> Registered for individuals, cooperatives, or
                    companies operating aquaculture ponds, hatcheries, or fish farms. You represent
                    that the farm area, species stocked, and pond details provided are accurate.
                  </li>
                  <li>
                    <strong>Buyer Accounts:</strong> Registered for commercial fish buyers, seafood
                    processors, exporters, wholesalers, or retail distributors sourcing aquaculture
                    harvest.
                  </li>
                  <li>
                    <strong>Account Security:</strong> You are responsible for safeguarding your
                    login credentials and for all activities that occur under your account. You
                    agree to notify BlueFarm immediately of any unauthorized access at{" "}
                    <a href="mailto:bluefarm1572@gmail.com" className="text-primary underline">
                      bluefarm1572@gmail.com
                    </a>
                    .
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                2. Marketplace Operations &amp; Commercial Listings
              </h2>
              <div className="mt-4 space-y-3 text-sm text-foreground/85">
                <p>
                  The BlueFarm Marketplace enables farmers to list active stock (including Vannamei
                  Shrimp, Black Tiger Shrimp, Tilapia, Seabass, Rohu, Crabs, and Hatchery Seeds) and
                  allows verified commercial buyers to discover produce and negotiate orders.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Listing Accuracy:</strong> Farmers agree to list true specifications
                    including count size, approximate biomass / quantity in kilograms, pond
                    location, and expected harvesting dates.
                  </li>
                  <li>
                    <strong>Pricing &amp; Currency:</strong> All listings and quotations are
                    indicated in Indian Rupees (INR) unless expressly stated otherwise.
                  </li>
                  <li>
                    <strong>Inspections &amp; Harvest Sampling:</strong> Buyers reserve the standard
                    commercial right to conduct pond sampling and quality checks prior to netting
                    and loading.
                  </li>
                  <li>
                    <strong>Payment &amp; Settlements:</strong> BlueFarm facilitates order tracking
                    and payment workflow records. Payment terms (including Cash on Delivery /
                    Advance RTGS / Escrow) are subject to the agreed transaction contract between
                    farmer and buyer.
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <span>3. IoT Sensor Telemetry &amp; Automation Disclaimers</span>
              </h2>
              <div className="mt-4 space-y-3 text-sm text-foreground/85">
                <p>
                  BlueFarm interfaces with hardware sensors (water pH probes, optical dissolved
                  oxygen sensors, temperature thermistors, and ultrasonic water level sensors) and
                  automated controllers (relay switches for aerators and auto-feeders).
                </p>
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-950 text-xs sm:text-sm">
                  <strong>CRITICAL OPERATIONAL NOTICE:</strong>
                  <p className="mt-1">
                    IoT telemetry is subject to sensor calibration, electrical supply, probe
                    bio-fouling, cellular/Wi-Fi connectivity, and hardware wear. Automated threshold
                    notifications and AI recommendations are advisory tools only. BlueFarm does NOT
                    guarantee zero mortality or immunity from disease outbreaks. Pond owners must
                    maintain manual pond inspections and emergency power backups.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                4. Identity Verification &amp; Document Privacy
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                BlueFarm supports voluntary farmer verification via Aadhaar. As detailed in our{" "}
                <Link to="/privacy" className="text-primary font-semibold underline">
                  Privacy Policy
                </Link>
                , optical text recognition occurs strictly on-device using Google ML Kit. BlueFarm
                never uploads, stores, or transmits your Aadhaar photo or 12-digit number to its
                servers.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                5. Limitation of Liability
              </h2>
              <div className="mt-4 space-y-3 text-sm text-foreground/85">
                <p>
                  To the maximum extent permitted by applicable Indian and international law,
                  BlueFarm, its founders, and affiliates shall not be liable for:
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>
                    Any loss of crop, biomass, livestock mortality, or harvest quality degradation;
                  </li>
                  <li>
                    Disruptions caused by weather catastrophes, floods, power outages, or cellular
                    carrier blackouts;
                  </li>
                  <li>
                    Disputes, non-payment, or shipment delays arising between buyers and sellers;
                  </li>
                  <li>
                    Direct or indirect commercial losses resulting from reliance on IoT sensor
                    readings.
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                6. Account Termination and Deletion
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                You may request account deletion at any time through our official{" "}
                <Link to="/delete-account" className="text-primary font-semibold underline">
                  Account Deletion Portal
                </Link>
                . Upon processing, all authentication credentials, profile information, pond
                configurations, and sensor telemetry will be permanently deleted. Transaction and
                invoice records required by statutory tax laws will be retained in accordance with
                legal mandates.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="font-display text-xl font-bold text-primary pb-2 border-b border-border">
                7. Contact Information
              </h2>
              <p className="mt-4 text-sm text-foreground/85">
                If you have questions regarding these Terms or need support with your BlueFarm
                account:
              </p>
              <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-5">
                <p className="font-semibold text-primary">BlueFarm Legal &amp; Customer Support</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-foreground/85">
                  <Mail className="h-4 w-4 text-primary" />
                  Email:{" "}
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
