import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  FileText,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const steps = [
  {
    step: "1",
    title: "Click Get Started",
    desc: "Opens the Internet Identity portal in a secure window.",
  },
  {
    step: "2",
    title: "Set Up Biometric / Passkey",
    desc: "Use your fingerprint, Face ID, or device PIN — no passwords.",
  },
  {
    step: "3",
    title: "Fill Your Profile",
    desc: "Enter your name, phone number, and date of birth.",
  },
];

const benefits = [
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Book Appointments",
    desc: "Request and track appointment status online.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "View Pricing",
    desc: "See transparent pricing for all our services.",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Track History",
    desc: "Keep a record of all your past visits and scans.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Secure & Private",
    desc: "Your data is encrypted and never shared.",
  },
];

export default function Signup() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const router = useRouter();

  useEffect(() => {
    if (identity) {
      router.navigate({ to: "/patient-dashboard" });
    }
  }, [identity, router]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Card */}
        <div className="form-card">
          {/* Branding */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-medical mb-4">
              <img
                src="/assets/generated/logo-icon.dim_256x256.png"
                alt="Limra Diagnostic Center"
                className="w-full h-full object-cover"
              />
            </div>
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full text-xs">
              Create an Account
            </Badge>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Get Started with Limra
            </h1>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed max-w-sm">
              Register in 3 simple steps using Internet Identity — biometric
              login with no passwords required.
            </p>
          </div>

          {/* How It Works */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              How it works
            </p>
            <div className="space-y-3">
              {steps.map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm flex-shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full rounded-xl gap-3 text-base font-semibold shadow-medical h-14"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="signup-ii-button"
          >
            <Fingerprint className="w-6 h-6" />
            {isLoggingIn
              ? "Opening Internet Identity…"
              : "Get Started — It's Free"}
          </Button>

          {/* Already have account */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline underline-offset-2"
                data-ocid="signup-login-link"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {benefits.map((b) => (
            <div key={b.title} className="medical-card p-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                {b.icon}
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {b.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <ChevronRight className="w-3 h-3 rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
