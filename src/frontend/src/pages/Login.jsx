import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { CheckCircle, Fingerprint, Lock, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    text: "Biometric / Passkey — no passwords to forget",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    text: "Encrypted & secured by Internet Identity",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    text: "View appointments & reports after login",
  },
];

export default function Login() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const router = useRouter();

  useEffect(() => {
    if (identity) {
      router.navigate({ to: "/patient-dashboard" });
    }
  }, [identity, router]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="form-card text-center">
          {/* Logo + Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-medical mb-4">
              <img
                src="/assets/generated/logo-icon.dim_256x256.png"
                alt="Limra Diagnostic Center"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Limra Diagnostic Center
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Center, Pune</p>
          </div>

          {/* Heading */}
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Sign in with Internet Identity — your biometric or passkey is your
            password. No username or password needed.
          </p>

          {/* Internet Identity Button */}
          <Button
            size="lg"
            className="w-full rounded-xl gap-3 text-base font-semibold shadow-medical h-14"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="login-ii-button"
          >
            <Fingerprint className="w-6 h-6" />
            {isLoggingIn
              ? "Opening Internet Identity…"
              : "Login with Internet Identity"}
          </Button>

          {/* What is Internet Identity */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-xl border border-border text-left">
            <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
              Why Internet Identity?
            </p>
            <ul className="space-y-2">
              {features.map((f) => (
                <li
                  key={f.text}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary flex-shrink-0">{f.icon}</span>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider + Signup link */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              New to Limra Diagnostic?{" "}
              <Link
                to="/signup"
                className="text-primary font-semibold hover:underline underline-offset-2"
                data-ocid="login-signup-link"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badge */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          🔒 Secured by Internet Computer · No data stored on external servers
        </p>
      </div>
    </div>
  );
}
