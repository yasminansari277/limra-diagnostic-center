import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle,
  Clock,
  Heart,
  Lock,
  Shield,
  Star,
  UserPlus,
} from "lucide-react";
import { useGetAllDoctors } from "../hooks/useQueries";

const HARDCODED_DOCTORS = [
  {
    name: "Dr. Humera Shah",
    qualifications: "MBBS, Radiology",
    experience: BigInt(20),
    specialization: "Obstetric & Gynae Sonography",
    timingStart: "11:00 AM",
    timingEnd: "2:30 PM",
    isActive: true,
    isPlaceholder: false,
  },
  {
    name: "Dr. Naved Shah",
    qualifications: "MBBS, Radiology",
    experience: BigInt(20),
    specialization: "General & Obstetric Sonography",
    timingStart: "5:00 PM",
    timingEnd: "9:30 PM",
    isActive: true,
    isPlaceholder: false,
  },
  {
    name: "Coming Soon",
    qualifications: "",
    experience: BigInt(0),
    specialization: "",
    timingStart: "",
    timingEnd: "",
    isActive: false,
    isPlaceholder: true,
  },
];

const trustBadges = [
  {
    icon: Shield,
    title: "Board Certified",
    desc: "All our radiologists are certified by the Medical Council of India with accredited sonography credentials.",
  },
  {
    icon: Award,
    title: "20+ Years Experience",
    desc: "Each doctor brings over two decades of diagnostic expertise, ensuring the most accurate results.",
  },
  {
    icon: Heart,
    title: "Patient-First Approach",
    desc: "We prioritise compassionate care — every patient is treated with respect, patience, and thoroughness.",
  },
];

const statsData = [
  { value: "10,000+", label: "Patients Served" },
  { value: "20+", label: "Years Experience" },
  { value: "99%", label: "Accuracy Rate" },
  { value: "2", label: "Expert Radiologists" },
];

function DoctorInitials({ name }) {
  const parts = name.split(" ").filter((p) => p !== "Dr.");
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center shadow-medical-lg mx-auto">
      <span className="font-display text-3xl font-bold text-primary">
        {initials}
      </span>
    </div>
  );
}

function DoctorCard({ doctor }) {
  if (doctor.isPlaceholder) {
    return (
      <div
        className="doctor-card p-8 text-center border-2 border-dashed border-primary/25 bg-secondary/30 flex flex-col items-center"
        data-ocid="doctor-card-placeholder"
      >
        <div className="w-28 h-28 rounded-full border-4 border-dashed border-primary/20 bg-muted/50 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <Badge
          variant="outline"
          className="mb-3 rounded-full border-amber-400/50 text-amber-600 bg-amber-50 text-xs font-semibold px-3"
        >
          Coming Soon
        </Badge>
        <h3 className="font-display text-lg font-bold text-muted-foreground mb-2">
          New Specialist
        </h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed mb-5 max-w-[200px]">
          We are expanding our team of expert radiologists. A new specialist
          will join us shortly.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60 mt-auto">
          <UserPlus className="w-4 h-4" />
          <span>Recruitment in Progress</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="doctor-card flex flex-col overflow-hidden"
      data-ocid="doctor-card"
    >
      {/* Card Top Banner */}
      <div className="hero-gradient h-24 w-full relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 70%, white 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Avatar — overlaps banner */}
      <div className="px-6 pb-6 flex flex-col items-center -mt-14 flex-1">
        <div className="relative mb-4">
          <DoctorInitials name={doctor.name} />
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-green-500 border-2 border-card flex items-center justify-center shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="font-display text-xl font-bold text-foreground mb-1">
            {doctor.name}
          </h3>
          <p className="text-primary font-semibold text-sm mb-1">
            {doctor.qualifications}
          </p>
          <p className="text-muted-foreground text-sm">
            {doctor.specialization}
          </p>
        </div>

        {/* Badges Row */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-5">
          <Badge className="rounded-full bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-3">
            <Star className="w-3 h-3 mr-1 fill-primary/60" />
            {Number(doctor.experience)}+ Yrs
          </Badge>
          <Badge className="rounded-full bg-accent/15 text-accent-foreground border-accent/20 text-xs font-semibold px-3">
            Radiology
          </Badge>
        </div>

        {/* Info rows */}
        <div className="w-full space-y-2.5 mb-5">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
            <Award className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Experience</div>
              <div className="text-sm font-semibold text-foreground">
                {Number(doctor.experience)}+ Years in Radiology
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">
                Consultation Hours
              </div>
              <div className="text-sm font-semibold text-primary">
                {doctor.timingStart} – {doctor.timingEnd}
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/book-appointment"
          className="block w-full mt-auto"
          data-ocid="doctor-book-btn"
        >
          <Button className="w-full rounded-xl font-semibold">
            Book Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function Doctors() {
  const { data: backendDoctors, isLoading } = useGetAllDoctors();
  const doctors =
    backendDoctors && backendDoctors.length > 0
      ? backendDoctors
      : HARDCODED_DOCTORS;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 80% 50%, white 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 rounded-full text-xs font-semibold px-4 py-1 uppercase tracking-wider">
              Our Medical Team
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Meet Our Expert
              <span className="block opacity-90">Radiologists</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-xl mb-8">
              Experienced sonography specialists committed to accurate
              diagnostics and compassionate care. Trusted by thousands of
              patients across Pune.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link to="/book-appointment" data-ocid="hero-book-btn">
                <Button className="bg-white text-primary hover:bg-white/90 rounded-xl font-semibold px-6 shadow-md">
                  Book an Appointment
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Same-day appointments available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                className="py-6 px-6 text-center first:pl-4"
              >
                <div className="font-display text-2xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 rounded-full bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-4 py-1 uppercase tracking-wider">
              Specialists
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Our Radiologists
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Highly qualified sonography experts with decades of experience in
              obstetric and general radiology.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {["a", "b", "c"].map((k) => (
                <Skeleton key={k} className="h-[460px] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.name} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Doctors */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 rounded-full bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-4 py-1 uppercase tracking-wider">
              Why Us
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Why Choose Our Doctors
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We uphold the highest standards in diagnostic radiology to give
              you confidence in every result.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.title}
                  className="medical-card p-8 text-center"
                  data-ocid="trust-badge"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-3">
                    {badge.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="medical-card p-10">
            <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center mx-auto mb-5">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Ready to Consult Our Experts?
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Book your appointment today with our experienced radiologists.
              Quick scheduling, accurate results, and compassionate care.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/book-appointment" data-ocid="cta-book-btn">
                <Button
                  size="lg"
                  className="rounded-xl w-full sm:w-auto font-semibold px-8"
                >
                  Book an Appointment
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5"
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
