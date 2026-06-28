import { CheckCircle2, Fingerprint, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

function Signup() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();

  useEffect(() => {
    if (identity) {
      navigate("/dashboard", { replace: true });
    }
  }, [identity, navigate]);

  return (
    <div className="page-section py-10">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="section-label">Patient Registration</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Register once, then use secure passkey login.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Registration starts with Internet Identity. After sign-in, patients can complete
          their profile, view service pricing and request appointments.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            "Use biometric or passkey sign-in.",
            "Complete your patient profile.",
            "Book and track appointments online.",
          ].map((item, index) => (
            <div key={item} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 inline-flex rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold text-white">
                Step {index + 1}
              </div>
              <p className="text-sm leading-7 text-slate-600">{item}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={login}
          disabled={isLoggingIn}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-sky-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoggingIn ? <Fingerprint className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          {isLoggingIn ? "Opening Internet Identity..." : "Register with Internet Identity"}
        </button>

        <div className="mt-8 rounded-[1.6rem] border border-sky-100 bg-sky-50 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-sky-700" />
            <p className="text-sm leading-7 text-slate-600">
              This flow does not ask patients to manage passwords. Internet Identity handles
              secure authentication and the clinic dashboard handles booking and follow-up status.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-sky-700">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
