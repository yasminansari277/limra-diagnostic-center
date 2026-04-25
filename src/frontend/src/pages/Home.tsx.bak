import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import ProfileSetupModal from "../components/ProfileSetupModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllDoctors, useGetAllServices } from "../hooks/useQueries";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const whyChooseUs = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Latest 4D/5D Machine",
    desc: "State-of-the-art ultrasound technology for the most accurate diagnostics.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Radiologists",
    desc: "Experienced doctors with 20+ years in radiology and sonography.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Accurate Reports",
    desc: "Precise, detailed reports delivered promptly for better diagnosis.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Flexible Timings",
    desc: "Morning and evening slots available to suit your schedule.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Affordable Prices",
    desc: "Quality diagnostic services at competitive, transparent pricing.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Trusted by Thousands",
    desc: "Serving pregnant women, general patients, and referring doctors.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Patient",
    text: "Excellent service! The doctors were very professional and the reports were accurate. Highly recommended for pregnancy scans.",
    rating: 5,
  },
  {
    name: "Dr. Rajesh Patil",
    role: "Referring Doctor",
    text: "I regularly refer my patients to Limra Diagnostic. Their 4D sonography reports are detailed and reliable.",
    rating: 5,
  },
  {
    name: "Sunita Desai",
    role: "Patient",
    text: "Very clean and professional environment. Staff is courteous and the waiting time is minimal. Great experience overall.",
    rating: 5,
  },
  {
    name: "Meera Joshi",
    role: "Patient",
    text: "Got my anomaly scan done here. The doctor explained everything clearly. Very satisfied with the service.",
    rating: 5,
  },
];

export default function Home() {
  const { data: doctors, isLoading: doctorsLoading } = useGetAllDoctors();
  const { data: services, isLoading: servicesLoading } = useGetAllServices();
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const [profileSetupDone, setProfileSetupDone] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    isFetched &&
    userProfile === null &&
    !profileSetupDone;

  const previewServices = services?.slice(0, 6) || [];

  return (
    <>
      <ProfileSetupModal
        open={showProfileSetup}
        onComplete={() => setProfileSetupDone(true)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 rounded-full px-4 py-1">
                🏥 Pune's Trusted Diagnostic Center
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Advanced &<br />
                <span className="text-white/90">Accurate</span>{" "}
                <span className="underline decoration-white/40 decoration-4">
                  Sonography
                </span>
                <br />
                Services
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
                State-of-the-art 4D/5D ultrasound technology with experienced
                radiologists. Serving pregnant women, general patients, and
                referring doctors in Pune.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book-appointment">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 rounded-xl font-semibold shadow-medical-lg gap-2 w-full sm:w-auto"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/10 rounded-xl font-semibold gap-2 w-full sm:w-auto"
                  >
                    <FileText className="w-5 h-5" />
                    View Services
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-white/70 text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>20+ Years Experience</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>4D/5D Technology</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl" />
                <img
                  src="/assets/generated/hero-banner.dim_1200x500.png"
                  alt="Advanced Sonography Services"
                  className="relative rounded-3xl shadow-medical-xl w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full">
                About Us
              </Badge>
              <h2 className="section-title mb-4">Limra Diagnostic Center</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Limra Diagnostic Center is a premier sonography and diagnostic
                facility located in Pune, Maharashtra. Established with a vision
                to provide accurate, affordable, and accessible diagnostic
                services, we have been serving the community with dedication and
                excellence.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our center is equipped with the latest 4D/5D ultrasound
                technology and staffed by experienced radiologists who are
                committed to delivering precise diagnostic reports. We
                specialize in pregnancy sonography, general ultrasound, and
                Doppler studies.
              </p>
              <Link to="/about">
                <Button
                  variant="outline"
                  className="rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5"
                >
                  Learn More About Us <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "20+", label: "Years Experience" },
                { value: "10K+", label: "Happy Patients" },
                { value: "4D/5D", label: "Technology" },
                { value: "12+", label: "Services" },
              ].map((stat) => (
                <div key={stat.label} className="medical-card p-6 text-center">
                  <div className="font-display text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full">
              Why Choose Us
            </Badge>
            <h2 className="section-title">Excellence in Every Scan</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              We combine advanced technology with compassionate care to deliver
              the best diagnostic experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="medical-card p-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full">
              Our Services
            </Badge>
            <h2 className="section-title">Comprehensive Sonography Services</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              From early pregnancy scans to advanced Doppler studies, we offer a
              full range of diagnostic services.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesLoading
              ? ["svc-a", "svc-b", "svc-c", "svc-d", "svc-e", "svc-f"].map(
                  (k) => <Skeleton key={k} className="h-40 rounded-2xl" />,
                )
              : previewServices.map((service) => (
                  <div key={service.name} className="medical-card p-6 group">
                    <Badge
                      variant="secondary"
                      className="mb-3 text-xs rounded-full bg-primary/10 text-primary border-primary/20"
                    >
                      {service.category}
                    </Badge>
                    <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {service.description}
                    </p>
                    <Link to="/book-appointment">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-primary/30 text-primary hover:bg-primary/5 gap-1 text-xs"
                      >
                        Book Now <ChevronRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services">
              <Button className="rounded-xl gap-2">
                View All Services <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full">
              Our Team
            </Badge>
            <h2 className="section-title">Meet Our Expert Doctors</h2>
            <p className="section-subtitle">
              Experienced radiologists dedicated to accurate diagnostics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {doctorsLoading
              ? ["doc-a", "doc-b", "doc-c"].map((k) => (
                  <Skeleton key={k} className="h-64 rounded-2xl" />
                ))
              : doctors?.map((doctor) => (
                  <div
                    key={doctor.name}
                    className={`medical-card p-6 text-center ${doctor.isPlaceholder ? "opacity-70 border-dashed" : ""}`}
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary/20 shadow-medical">
                      <img
                        src={
                          doctor.isPlaceholder
                            ? "/assets/generated/doctor-placeholder.dim_300x300.png"
                            : doctor.name.includes("Humera")
                              ? "/assets/generated/doctor-humera.dim_300x300.png"
                              : "/assets/generated/doctor-naved.dim_300x300.png"
                        }
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {doctor.isPlaceholder ? (
                      <>
                        <Badge
                          variant="outline"
                          className="mb-2 text-xs rounded-full border-muted-foreground/30 text-muted-foreground"
                        >
                          Coming Soon
                        </Badge>
                        <h3 className="font-display font-semibold text-muted-foreground">
                          Position Open
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          We're expanding our team
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-display font-semibold text-foreground">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-primary font-medium mt-1">
                          {doctor.qualifications}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {Number(doctor.experience)} Years Experience
                        </p>
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>
                              {doctor.timingStart} – {doctor.timingEnd}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/doctors">
              <Button
                variant="outline"
                className="rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5"
              >
                View All Doctors <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full">
              Testimonials
            </Badge>
            <h2 className="section-title">What Our Patients Say</h2>
            <p className="section-subtitle">
              Trusted by thousands of patients across Pune.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="medical-card p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={`star-${t.name}-${i}`}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-12 hero-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Ready to Book Your Appointment?
              </h2>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span>Limra Diagnostic Center, Pune, Maharashtra, India</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="tel:+919999999999">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 rounded-xl gap-2 font-semibold w-full sm:w-auto"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </Button>
              </a>
              <Link to="/book-appointment">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 rounded-xl gap-2 font-semibold w-full sm:w-auto"
                >
                  <Calendar className="w-5 h-5" />
                  Book Online
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Call Button */}
      <a
        href="tel:+919999999999"
        className="fixed bottom-6 right-6 z-50 md:hidden flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-medical-xl font-semibold text-sm animate-pulse"
        aria-label="Emergency Call"
      >
        <Phone className="w-5 h-5" />
        Call Now
      </a>
    </>
  );
}
