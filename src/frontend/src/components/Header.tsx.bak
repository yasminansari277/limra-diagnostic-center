import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Doctors", path: "/doctors" },
  { label: "Services", path: "/services" },
  { label: "Appointments", path: "/book-appointment" },
  { label: "Contact", path: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setMobileOpen(false);
    router.navigate({ to: "/" });
  };

  const handleLogin = () => {
    login();
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-medical flex-shrink-0">
              <img
                src="/assets/generated/logo-icon.dim_256x256.png"
                alt="Limra Diagnostic Center"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-primary text-base md:text-lg leading-tight">
                Limra Diagnostic
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Center, Pune
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  currentPath === link.path
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Controls */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl border-primary/30"
                  >
                    <User className="w-4 h-4 text-primary" />
                    <span className="max-w-[120px] truncate text-sm">
                      {userProfile?.name || "My Account"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {isAdmin ? (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin-dashboard"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-primary" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/patient-dashboard"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="rounded-xl border-primary/30 text-primary hover:bg-primary/5"
                >
                  {isLoggingIn ? "Logging in..." : "Patient Login"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="rounded-xl bg-primary text-primary-foreground"
                >
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  Admin Login
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentPath === link.path
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border mt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Signed in as{" "}
                    <span className="font-semibold text-foreground">
                      {userProfile?.name || "User"}
                    </span>
                  </div>
                  {isAdmin ? (
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent"
                    >
                      <Shield className="w-4 h-4 text-primary" />
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/patient-dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      My Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full rounded-xl"
                >
                  {isLoggingIn ? "Logging in..." : "Login / Register"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
