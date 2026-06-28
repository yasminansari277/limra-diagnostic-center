import {
  ArrowRight,
  CalendarCheck2,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Activity,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllDoctors, useGetAllServices } from "../hooks/useQueries";
import { formatCurrency, getDoctors, getDoctorImage, getServices } from "../lib/clinicData";

function Home() {
  const { identity } = useInternetIdentity();
  const { data: doctorsData } = useGetAllDoctors();
  const { data: servicesData } = useGetAllServices();

  const doctors = getDoctors(doctorsData).filter((doctor) => !doctor.isPlaceholder).slice(0, 3);
  const services = getServices(servicesData).slice(0, 3);

  return (
    <div className="pb-16">
      {/* Hero Section - Clean and Focused */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `url("/assets/images/ultrasound-probe.jpeg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/80 to-white/75"></div>

        {/* Floating Medical Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 opacity-20 animate-float-medical">
            <HeartPulse className="h-8 w-8 text-sky-400" />
          </div>
          <div className="absolute top-40 right-20 opacity-15 animate-float-medical" style={{ animationDelay: '1s' }}>
            <Activity className="h-6 w-6 text-sky-500" />
          </div>
          <div className="absolute bottom-32 left-20 opacity-20 animate-float-medical" style={{ animationDelay: '2s' }}>
            <ShieldCheck className="h-7 w-7 text-sky-300" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-15 animate-float-medical" style={{ animationDelay: '0.5s' }}>
            <Users className="h-5 w-5 text-sky-400" />
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800 border border-sky-200">
                <Stethoscope className="mr-2 h-4 w-4" />
                Pune's Premier Diagnostic Sonography Center
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Advanced
              <span className="block text-sky-600">Sonography Care</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Professional pregnancy sonography, comprehensive ultrasound diagnostics,
              and secure patient care with Internet Identity protection.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-sky-700 hover:shadow-xl"
              >
                Schedule Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - Professional and Clean */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Excellence in Every Scan
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              We combine advanced technology with compassionate care to deliver the best diagnostic experience.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <HeartPulse className="h-8 w-8" />,
                title: "Latest 4D/5D Machine",
                description: "State-of-the-art ultrasound technology for the most accurate diagnostics.",
              },
              {
                icon: <HeartPulse className="h-8 w-8" />,
                title: "Expert Radiologists",
                description: "Experienced doctors with 20+ years in radiology and sonography.",
              },
              {
                icon: <ShieldCheck className="h-8 w-8" />,
                title: "Accurate Reports",
                description: "Precise, detailed reports delivered promptly for better diagnosis.",
              },
              {
                icon: <CalendarCheck2 className="h-8 w-8" />,
                title: "Flexible Timings",
                description: "Morning and evening slots available to suit your schedule.",
              },
              {
                icon: <HeartPulse className="h-8 w-8" />,
                title: "Affordable Prices",
                description: "Quality diagnostic services at competitive, transparent pricing.",
              },
              {
                icon: <HeartPulse className="h-8 w-8" />,
                title: "Trusted by Thousands",
                description: "Serving pregnant women, general patients, and referring doctors.",
              },
            ].map((feature, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg hover:ring-sky-200">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview - Focused and Professional */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Our Diagnostic Services
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Comprehensive ultrasound and sonography services for all your diagnostic needs
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.name} className="group overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-sky-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
                      {service.category}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{service.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    {identity ? formatCurrency(service.price) : "Login to view pricing"}
                  </span>
                  <Link
                    to="/services"
                    className="text-sm font-medium text-sky-600 hover:text-sky-700"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-sky-300 transition"
            >
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Preview - Professional Presentation */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Meet Our Expert Radiologists
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Board-certified specialists with decades of experience in diagnostic imaging
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="group text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-sky-100 to-sky-200">
                  <img
                    src={getDoctorImage(doctor.name)}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-900">{doctor.name}</h3>
                  <p className="text-sm font-medium text-sky-600">{doctor.qualifications}</p>
                  <p className="mt-1 text-sm text-slate-600">{doctor.specialization}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {Number(doctor.experience)} years experience
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {doctor.timingStart} - {doctor.timingEnd}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/doctors"
              className="inline-flex items-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-sky-700 transition"
            >
              View All Doctors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Patient Journey - Simplified and Clear */}
      <section className="bg-slate-900 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your Care Journey
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Simple, secure, and professional diagnostic care from booking to results
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "Secure Login", desc: "Sign in with Internet Identity" },
                { step: "02", title: "Book Appointment", desc: "Select service and preferred doctor" },
                { step: "03", title: "Admin Review", desc: "Appointment confirmed by our team" },
                { step: "04", title: "Quality Care", desc: "Professional diagnostic service" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link
              to="/appointment"
              className="inline-flex items-center rounded-full bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-sky-700 transition"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;