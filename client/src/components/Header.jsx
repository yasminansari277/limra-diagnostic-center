import { useQueryClient } from "@tanstack/react-query";
import { Menu, ShieldCheck, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";
import { clinic } from "../lib/clinicData";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/doctors", label: "Doctors" },
  { href: "/services", label: "Services" },
  { href: "/appointment", label: "Appointment" },
  { href: "/contact", label: "Contact" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = Boolean(identity);

  const closeMenu = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-sky-100 text-sky-900"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const handleLogin = async () => {
    closeMenu();
    await login();
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/92 backdrop-blur-xl">
      <div className="border-b border-sky-100/70 bg-sky-50/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-slate-600 sm:px-6 lg:px-8">
          <p className="font-medium">
            Diagnostic sonography for pregnancy care, routine imaging and referring doctors.
          </p>
          <p>{clinic.hours}</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-700 text-white shadow-lg shadow-sky-900/10">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight text-slate-950">
              {clinic.name}
            </span>
            <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">
              {clinic.alternateName}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-sky-200 hover:bg-sky-50"
              >
                {isAdmin ? "Admin Dashboard" : "Patient Dashboard"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-sky-200 hover:bg-sky-50"
              >
                Register
              </Link>
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="rounded-full bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingIn ? "Signing in..." : "Internet Identity Login"}
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex rounded-full border border-slate-200 bg-white p-3 text-slate-700 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={linkClass}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Signed in as{" "}
                  <span className="font-semibold text-slate-900">
                    {profile?.name || "Portal user"}
                  </span>
                </div>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="rounded-full border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900"
                  onClick={closeMenu}
                >
                  {isAdmin ? "Open Admin Dashboard" : "Open Patient Dashboard"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="mt-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900"
                  onClick={closeMenu}
                >
                  Register
                </Link>
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="rounded-full bg-sky-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoggingIn ? "Signing in..." : "Login with Internet Identity"}
                </button>
              </>
            )}

            <div className="mt-3 rounded-3xl bg-sky-50 px-4 py-3 text-sm text-slate-600">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <ShieldCheck className="h-4 w-4 text-sky-700" />
                Secure passkey-based access
              </div>
              <p className="mt-1">
                Patients and administrators use the same Internet Identity sign-in flow.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
