import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import bluefarmLogo from "../../assets/logo-bg.png";
import { cn } from "@/lib/utils";
import { ShieldCheck, Search, Menu, X, Sun, Moon } from "lucide-react";

const NAV = [
  { label: "Track Request", to: "/track" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Contact Support", to: "/contact" },
] as const;

export function BlueFarmLogo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-14 w-14 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-xl font-extrabold shadow-sm ring-1 ring-black/5",
          className,
        )}
      >
        BF
      </div>
    );
  }

  return (
    <img
      src={bluefarmLogo}
      onError={() => setFailed(true)}
      alt="BlueFarm logo"
      className={cn(
        "h-14 w-14 sm:h-18 sm:w-18 shrink-0 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105",
        className,
      )}
    />
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bf_theme");
      if (saved === "dark") {
        setIsDark(true);
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // localStorage not accessible
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      if (next) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.setItem("bf_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("bf_theme", "coastal");
      }
    } catch {
      // localStorage not accessible
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/80 bg-background/95 backdrop-blur-xl shadow-md py-2 sm:py-3"
          : "border-b border-border/40 bg-background/80 backdrop-blur-md py-3 sm:py-4",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3.5 sm:gap-4 shrink-0 group" onClick={() => setOpen(false)}>
          <BlueFarmLogo />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-primary transition-colors group-hover:text-primary/90">
              BlueFarm
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-muted-foreground/90 tracking-wider uppercase">
              Account Deletion Portal
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap text-foreground/75 transition-all duration-200 hover:bg-secondary hover:text-foreground active:scale-[0.98]"
              activeProps={{ className: "bg-secondary text-primary font-bold shadow-2xs" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Coastal Seafoam theme" : "Switch to Deep Stormy night theme"}
            title={isDark ? "Switch to Coastal Seafoam mode" : "Switch to Deep Stormy night mode"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card/80 text-foreground/80 hover:bg-secondary hover:text-foreground transition-all duration-200 active:scale-95 shadow-2xs"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
          </button>
          <Link
            to="/track"
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-4 py-2 text-xs font-semibold whitespace-nowrap text-foreground/80 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:bg-secondary hover:text-foreground active:scale-[0.98]"
          >
            <Search className="h-3.5 w-3.5 text-primary" />
            Track Status
          </Link>
          <a
            href="/#deletion-form"
            className="inline-flex items-center gap-2 rounded-full bg-destructive/15 border border-destructive/30 px-4 py-2 text-xs font-bold whitespace-nowrap text-destructive shadow-2xs transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground active:scale-[0.98]"
          >
            <ShieldCheck className="h-4 w-4" />
            Request Deletion
          </a>
        </div>

        {/* Mobile menu and theme buttons */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Coastal Seafoam theme" : "Switch to Deep Stormy night theme"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card transition-colors hover:bg-secondary"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card transition-colors hover:bg-secondary"
          >
            {open ? (
              <X className="h-5 w-5 text-primary" />
            ) : (
              <Menu className="h-5 w-5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {open && (
        <nav className="border-t border-border/70 bg-background/98 backdrop-blur-xl px-4 py-4 lg:hidden space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3.5 py-2.5 text-sm font-bold text-primary hover:bg-secondary"
          >
            Account Deletion Home
          </Link>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3.5 py-2 text-sm font-medium text-foreground/85 hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border space-y-2">
            <Link
              to="/track"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-secondary px-3.5 py-2.5 text-sm font-semibold text-foreground"
            >
              <Search className="h-4 w-4 text-primary" />
              Track Existing Request
            </Link>
            <a
              href="/#deletion-form"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-destructive/15 px-3.5 py-2.5 text-sm font-bold text-destructive"
            >
              <ShieldCheck className="h-4 w-4" />
              Submit Deletion Request
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
