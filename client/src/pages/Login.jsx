import { Fingerprint, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";
import { clinic } from "../lib/clinicData";

function Login() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  useEffect(() => {
    if (!identity || isLoading) return;
    navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
  }, [identity, isAdmin, isLoading, navigate]);

  return (
    <div className="page-section py-10">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="section-label">Secure Login</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Sign in with Internet Identity.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Patients and administrators use the same secure sign-in flow. Internet Identity
          supports passkeys and biometrics instead of passwords.
        </p>

        <div className="mt-8 rounded-[1.8rem] border border-sky-100 bg-sky-50 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 text-sky-700 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">{clinic.name}</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                Secure access opens patient dashboard features, hidden pricing and
                appointment status tracking. Admin users are routed to the admin panel.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={login}
          disabled={isLoggingIn}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-sky-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Fingerprint className="h-5 w-5" />
          {isLoggingIn ? "Opening Internet Identity..." : "Continue with Internet Identity"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need a new patient account?{" "}
          <Link to="/signup" className="font-medium text-sky-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
