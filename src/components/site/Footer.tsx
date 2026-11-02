import { Link } from "@tanstack/react-router";
import { BlueFarmLogo } from "@/components/site/Header";
import { ShieldCheck, Mail, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-deep text-deep-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3.5">
              <BlueFarmLogo className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-md" />
              <div>
                <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white block">
                  BlueFarm
                </span>
                <span className="text-[11px] font-bold text-deep-foreground/70 uppercase tracking-wider">
                  Account Deletion Portal
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-deep-foreground/75 leading-relaxed max-w-xs">
              Official self-service account and personal data deletion portal for BlueFarm users, compliant with Google Play Store developer requirements and data privacy standards.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-[11px] font-medium text-aqua">
              <CheckCircle2 className="h-3.5 w-3.5 text-aqua shrink-0" />
              Google Play Compliant Deletion URL
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
              Account Deletion
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-deep-foreground/75">
              <li>
                <a href="/#deletion-form" className="hover:text-aqua transition-colors">
                  Submit Deletion Request
                </a>
              </li>
              <li>
                <Link to="/track" className="hover:text-aqua transition-colors">
                  Track Request Status
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-aqua transition-colors">
                  Manual Verification Help
                </Link>
              </li>
              <li>
                <a href="/#data-policy" className="hover:text-aqua transition-colors">
                  What Data is Expunged
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
              Legal &amp; Privacy
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-deep-foreground/75">
              <li>
                <Link to="/privacy" className="hover:text-aqua transition-colors">
                  Privacy Policy (GDPR / DPDP)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-aqua transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-aqua transition-colors">
                  Statutory Audit Retention
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-aqua transition-colors">
                  Data Protection Officer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
              Contact &amp; Assistance
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-deep-foreground/75">
              <li>
                <a
                  href="mailto:bluefarm1572@gmail.com"
                  className="font-medium text-white hover:text-aqua transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5 text-aqua" />
                  bluefarm1572@gmail.com
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-aqua transition-colors">
                  Compliance Helpdesk
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-deep-foreground/60 leading-relaxed">
                Verification codes are sent to your registered contact. For assistance with lost devices, submit a manual request.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-deep-foreground/60">
          <p>&copy; {new Date().getFullYear()} BlueFarm Technologies. All rights reserved. Official Account Deletion Portal.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/privacy" className="hover:text-aqua transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-aqua transition-colors">
              Terms of Service
            </Link>
            <Link to="/track" className="hover:text-aqua transition-colors">
              Track Request
            </Link>
            <Link to="/contact" className="hover:text-aqua transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
