import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle, Eye, Target, Zap } from "lucide-react";

const certifications = [
  "Registered with Maharashtra Medical Council",
  "ISO Certified Diagnostic Center",
  "NABH Accredited Facility",
  "Certified Radiologists on Staff",
  "Compliant with PCPNDT Act",
];

const equipment = [
  {
    name: "GE Voluson E10 4D/5D Ultrasound",
    desc: "Our flagship machine offers crystal-clear 4D and 5D imaging for detailed fetal assessment and general diagnostics.",
  },
  {
    name: "High-Resolution Doppler System",
    desc: "Advanced Doppler technology for precise blood flow analysis and vascular studies.",
  },
  {
    name: "Digital Reporting System",
    desc: "Fully digital workflow ensuring fast, accurate, and secure report generation.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 rounded-full">
            About Us
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            About Limra Diagnostic Center
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Dedicated to providing advanced, accurate, and affordable diagnostic
            services to the people of Pune.
          </p>
        </div>
      </section>

      {/* Center History */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full">
                Our Story
              </Badge>
              <h2 className="section-title mb-6">
                A Legacy of Trust & Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Limra Diagnostic Center was founded with a singular mission:
                  to bring world-class diagnostic services to the heart of Pune.
                  Established by Dr. Humera Shah and Dr. Naved Shah — both
                  accomplished radiologists with over 20 years of combined
                  experience — the center has grown to become one of Pune's most
                  trusted names in sonography.
                </p>
                <p>
                  From its humble beginnings as a small diagnostic clinic, Limra
                  has continuously invested in the latest technology and
                  training to ensure that every patient receives the most
                  accurate and timely diagnosis possible. Today, we serve
                  thousands of patients annually, including pregnant women,
                  general patients, and referring physicians from across the
                  region.
                </p>
                <p>
                  Our commitment to quality, compassion, and clinical excellence
                  has earned us the trust of the medical community and the
                  gratitude of countless families who have relied on our
                  services during some of the most important moments of their
                  lives.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="medical-card p-6 text-center col-span-2">
                <div className="font-display text-4xl font-bold text-primary mb-2">
                  20+
                </div>
                <div className="text-muted-foreground font-medium">
                  Years of Combined Experience
                </div>
              </div>
              <div className="medical-card p-6 text-center">
                <div className="font-display text-3xl font-bold text-primary mb-2">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Patients Served
                </div>
              </div>
              <div className="medical-card p-6 text-center">
                <div className="font-display text-3xl font-bold text-primary mb-2">
                  12+
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Services Offered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full">
              Our Purpose
            </Badge>
            <h2 className="section-title">Vision & Mission</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="medical-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Our Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To be Pune's most trusted and technologically advanced
                diagnostic center, setting the standard for accuracy,
                accessibility, and patient-centered care in medical imaging.
              </p>
            </div>
            <div className="medical-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Our Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To deliver precise, timely, and affordable diagnostic services
                using cutting-edge technology, while treating every patient with
                dignity, empathy, and the highest standards of medical ethics.
              </p>
            </div>
          </div>
          <div className="mt-8 medical-card p-8 max-w-4xl mx-auto">
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Our Core Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Accuracy",
                "Compassion",
                "Integrity",
                "Innovation",
                "Accessibility",
                "Excellence",
              ].map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full">
              Credentials
            </Badge>
            <h2 className="section-title">Certifications & Accreditations</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Our center meets the highest standards of medical quality and
              regulatory compliance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="medical-card p-5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {cert}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 rounded-full">
              Technology
            </Badge>
            <h2 className="section-title">Our Equipment</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Equipped with the latest 4D/5D ultrasound technology for superior
              diagnostic accuracy.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {equipment.map((item) => (
                <div key={item.name} className="medical-card p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
              <div className="medical-card p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">
                    4D/5D Ultrasound Technology
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our 4D/5D ultrasound machines provide real-time
                  three-dimensional imaging, allowing doctors to observe fetal
                  movements, facial features, and organ development with
                  unprecedented clarity. This technology is especially valuable
                  for detailed anomaly scans and growth assessments.
                </p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-medical-xl">
              <img
                src="/assets/generated/ultrasound-machine.dim_600x400.png"
                alt="4D/5D Ultrasound Machine"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
