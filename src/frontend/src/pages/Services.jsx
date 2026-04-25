import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Baby,
  Calendar,
  ChevronRight,
  Heart,
  Info,
  Lock,
  Search,
  Stethoscope,
  Waves,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllServices } from "../hooks/useQueries";

// ─── Fallback data ─────────────────────────────────────────────────────────────
const FALLBACK_SERVICES = [
  {
    name: "Abdomen Pelvis",
    category: "General Sonography",
    description:
      "Complete abdominal and pelvic ultrasound for comprehensive organ evaluation.",
    preparation: "Full bladder required. Fast for 4–6 hours before the scan.",
    price: BigInt(1500),
    isActive: true,
  },
  {
    name: "Pelvis",
    category: "General Sonography",
    description:
      "Targeted pelvic ultrasound to evaluate uterus, ovaries, and bladder.",
    preparation: "Full bladder required.",
    price: BigInt(1400),
    isActive: true,
  },
  {
    name: "KUB",
    category: "General Sonography",
    description:
      "Kidney, Ureter, and Bladder scan for urinary tract assessment.",
    preparation: "Full bladder required.",
    price: BigInt(1800),
    isActive: true,
  },
  {
    name: "Thyroid Scan",
    category: "General Sonography",
    description:
      "High-resolution thyroid and neck ultrasound for nodule detection.",
    preparation: "No special preparation needed.",
    price: BigInt(1200),
    isActive: true,
  },
  {
    name: "Breast Scan",
    category: "General Sonography",
    description:
      "Comprehensive breast ultrasound for early detection of abnormalities.",
    preparation: "No special preparation needed.",
    price: BigInt(1500),
    isActive: true,
  },
  {
    name: "Kidney Scan",
    category: "General Sonography",
    description:
      "Detailed kidney evaluation for stones, cysts, and structural issues.",
    preparation: "Full bladder required.",
    price: BigInt(1200),
    isActive: true,
  },
  {
    name: "Early Pregnancy",
    category: "Pregnancy Sonography",
    description:
      "First-trimester scan to confirm pregnancy, heartbeat, and dating.",
    preparation: "Full bladder required for early scans.",
    price: BigInt(1500),
    isActive: true,
  },
  {
    name: "NT Scan",
    category: "Pregnancy Sonography",
    description:
      "Nuchal translucency scan at 11–14 weeks to screen for chromosomal conditions.",
    preparation: "Full bladder required.",
    price: BigInt(2000),
    isActive: true,
  },
  {
    name: "Anomaly Scan",
    category: "Pregnancy Sonography",
    description:
      "Detailed fetal anatomy scan at 18–22 weeks to detect structural abnormalities.",
    preparation: "No special preparation needed.",
    price: BigInt(3000),
    isActive: true,
  },
  {
    name: "Growth Scan",
    category: "Pregnancy Sonography",
    description:
      "Third-trimester scan to monitor fetal growth, position, and amniotic fluid.",
    preparation: "No special preparation needed.",
    price: BigInt(2000),
    isActive: true,
  },
  {
    name: "3D/4D Sonography",
    category: "Pregnancy Sonography",
    description:
      "Advanced 3D/4D imaging for detailed fetal facial and body visualization.",
    preparation: "No special preparation. Best at 26–32 weeks.",
    price: BigInt(3500),
    isActive: true,
  },
  {
    name: "Growth Doppler",
    category: "Doppler Studies",
    description:
      "Doppler assessment of blood flow in fetal vessels and placenta.",
    preparation: "No special preparation needed.",
    price: BigInt(2500),
    isActive: true,
  },
];

// ─── Category metadata ──────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "All",
    label: "All Services",
    icon: Stethoscope,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "Pregnancy Sonography",
    label: "Pregnancy Sonography",
    icon: Baby,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    id: "General Sonography",
    label: "General Sonography",
    icon: Activity,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "Doppler Studies",
    label: "Doppler Studies",
    icon: Waves,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
];

const CATEGORY_BADGE = {
  "Pregnancy Sonography": "bg-pink-50 text-pink-700 border-pink-200",
  "General Sonography": "bg-blue-50 text-blue-700 border-blue-200",
  "Doppler Studies": "bg-teal-50 text-teal-700 border-teal-200",
};

// ─── ServiceCard ────────────────────────────────────────────────────────────────
function ServiceCard({ service, isAuthenticated, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div
        className="service-item flex flex-col h-full group"
        data-ocid="service-card"
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge
            variant="outline"
            className={`text-xs rounded-full border shrink-0 ${CATEGORY_BADGE[service.category] ?? "bg-primary/10 text-primary border-primary/20"}`}
          >
            {service.category}
          </Badge>

          {isAuthenticated ? (
            <span className="text-xl font-bold text-primary font-display whitespace-nowrap">
              ₹{Number(service.price).toLocaleString("en-IN")}
            </span>
          ) : (
            <div
              className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full border border-border whitespace-nowrap"
              data-ocid="price-locked"
            >
              <Lock className="w-3 h-3 shrink-0" />
              <span>Login to view</span>
            </div>
          )}
        </div>

        {/* Name + description */}
        <h3 className="font-display font-semibold text-foreground text-lg mb-1.5 leading-snug group-hover:text-primary transition-colors duration-200">
          {service.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
          {service.description}
        </p>

        {/* Preparation note */}
        {service.preparation && service.preparation !== "None" && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 mb-4">
            <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 mb-0.5">
                Preparation
              </p>
              <p className="text-xs text-amber-600 leading-relaxed">
                {service.preparation}
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <Link to="/book-appointment">
          <Button
            size="sm"
            className="w-full rounded-xl gap-1.5 group-hover:shadow-md transition-shadow duration-200"
            data-ocid="book-now-btn"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Now
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Skeleton loader ────────────────────────────────────────────────────────────
function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
        <Skeleton key={k} className="h-64 rounded-xl" />
      ))}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function Services() {
  const { data: apiServices, isLoading } = useGetAllServices();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  const services = useMemo(
    () =>
      apiServices && apiServices.length > 0
        ? apiServices.filter((s) => s.isActive)
        : FALLBACK_SERVICES,
    [apiServices],
  );

  const filtered = useMemo(() => {
    let result = services;
    if (activeCategory !== "All") {
      result = result.filter((s) => s.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [services, activeCategory, searchQuery]);

  // Group filtered by category for section headings
  const grouped = useMemo(() => {
    if (activeCategory !== "All") {
      return { [activeCategory]: filtered };
    }
    const map = {};
    for (const s of filtered) {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    }
    return map;
  }, [filtered, activeCategory]);

  const totalCount = services.length;
  const filteredCount = filtered.length;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky pricing banner (unauthenticated) ─────────────────────── */}
      <AnimatePresence>
        {!isAuthenticated && showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sticky top-0 z-40 overflow-hidden"
            data-ocid="pricing-banner"
          >
            <div className="bg-primary text-primary-foreground px-4 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  Login to see our transparent pricing for all services
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="hero-gradient text-white pt-16 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 rounded-full inline-flex items-center gap-1.5">
              <Heart className="w-3 h-3" /> Our Services
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              Comprehensive Sonography &{" "}
              <span className="text-white/80">Diagnostic Services</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              State-of-the-art 4D/5D ultrasound technology with expert
              radiologists. Precise, comfortable, and compassionate care for
              every patient.
            </p>

            {/* Search bar */}
            <div
              className="relative max-w-lg mx-auto"
              data-ocid="service-search"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search services (e.g. NT Scan, Doppler…)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-2xl bg-white/15 border-white/25 text-white placeholder:text-white/55 focus:bg-white/20 focus:border-white/50 focus:ring-0 h-12 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container mx-auto px-4 mt-12"
        >
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            {[
              { label: "Services", value: `${totalCount}+` },
              { label: "Years Experience", value: "20+" },
              { label: "Daily Patients", value: "50+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 rounded-2xl px-4 py-3"
              >
                <div className="font-display font-bold text-2xl text-white">
                  {stat.value}
                </div>
                <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Category tabs ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div
            className="flex gap-1 overflow-x-auto py-3 scrollbar-hide"
            data-ocid="category-tabs"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  data-ocid={`tab-${cat.id.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? `${cat.bgColor} ${cat.color} shadow-sm`
                      : "text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Services grid ───────────────────────────────────────────────── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Result summary */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? (
                <>
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {filteredCount}
                  </span>{" "}
                  result
                  {filteredCount !== 1 ? "s" : ""} for{" "}
                  <span className="font-semibold text-foreground">
                    "{searchQuery}"
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-foreground">
                    {filteredCount}
                  </span>{" "}
                  service{filteredCount !== 1 ? "s" : ""} available
                </>
              )}
            </p>

            {!isAuthenticated && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5" />
                <span>Login to view prices</span>
              </div>
            )}
          </div>

          {/* Loading skeleton */}
          {isLoading && <ServicesSkeleton />}

          {/* No results */}
          {!isLoading && filteredCount === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
              data-ocid="services-empty"
            >
              <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                No services found
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Try a different search term or browse all categories.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                View all services
              </Button>
            </motion.div>
          )}

          {/* Grouped sections */}
          {!isLoading && filteredCount > 0 && (
            <div className="space-y-14">
              {Object.entries(grouped).map(([category, catServices]) => {
                const catMeta = CATEGORIES.find((c) => c.id === category);
                const Icon = catMeta?.icon ?? Stethoscope;

                return (
                  <section
                    key={category}
                    aria-labelledby={`section-${category}`}
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${catMeta?.bgColor ?? "bg-primary/10"}`}
                      >
                        <Icon
                          className={`w-5 h-5 ${catMeta?.color ?? "text-primary"}`}
                        />
                      </div>
                      <div>
                        <h2
                          id={`section-${category}`}
                          className="font-display text-xl font-bold text-foreground"
                        >
                          {category}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {catServices.length} service
                          {catServices.length !== 1 ? "s" : ""} available
                        </p>
                      </div>
                      <div className="flex-1 h-px bg-border ml-2" />
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {catServices.map((service, index) => (
                        <ServiceCard
                          key={service.name}
                          service={service}
                          isAuthenticated={isAuthenticated}
                          index={index}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA bottom strip ─────────────────────────────────────────── */}
      <section
        className="bg-card border-t border-border py-12"
        data-ocid="services-cta"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Ready to book your appointment?
              </h3>
              <p className="text-sm text-muted-foreground">
                Our expert radiologists are available daily. Choose a convenient
                time and we'll take care of the rest.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/book-appointment">
                <Button
                  className="gap-2 rounded-xl"
                  data-ocid="cta-book-appointment"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  data-ocid="cta-contact"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
