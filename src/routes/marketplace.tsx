import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ShieldCheck, Smartphone, Info, Search } from "lucide-react";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace Notice | BlueFarm Account Deletion Portal" },
      {
        name: "description",
        content:
          "The BlueFarm aquaculture produce marketplace is available exclusively in the BlueFarm mobile application. This site is solely dedicated to BlueFarm account and data deletion requests.",
      },
      { property: "og:title", content: "Marketplace Notice | BlueFarm Account Deletion Portal" },
      {
        property: "og:description",
        content:
          "The BlueFarm marketplace is available exclusively inside the BlueFarm mobile application. This website is dedicated strictly to account and data deletion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MarketplacePage,
});

export function MarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="max-w-xl w-full text-center rounded-3xl border border-border bg-card p-8 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Smartphone className="h-7 w-7" />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-foam px-3.5 py-1 text-xs font-semibold text-primary">
            Mobile App Feature
          </span>

          <h1 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
            BlueFarm Aquaculture Marketplace
          </h1>

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The aquaculture produce trading marketplace, pond sensor telemetry, and harvest inquiry features are accessible exclusively inside the <strong>BlueFarm Mobile App</strong>.
          </p>

          <div className="mt-6 rounded-2xl border border-primary/20 bg-foam p-4 text-xs sm:text-sm text-foreground/85 text-left flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p>
              This website serves strictly as the <strong>Official BlueFarm Account &amp; Data Deletion Portal</strong> for users and Google Play Store compliance.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Go to Account Deletion Portal
            </Link>
            <Link
              to="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <Search className="h-4 w-4 text-primary" />
              Track Existing Request
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
