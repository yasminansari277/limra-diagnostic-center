import { Lock, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllServices } from "../hooks/useQueries";
import {
  formatCurrency,
  getServices,
  serviceCategories,
} from "../lib/clinicData";

function Services() {
  const { identity } = useInternetIdentity();
  const { data } = useGetAllServices();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const services = getServices(data);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory = category === "All" || service.category === category;
      const haystack = [service.name, service.category, service.description]
        .join(" ")
        .toLowerCase();
      const matchesSearch = haystack.includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search, services]);

  return (
    <div className="page-stack">
      <section className="page-section page-hero-card">
        <p className="section-label">Services</p>
        <h1 className="page-title">Search services by name, category or description in real time.</h1>
        <p className="page-intro">
          Service information is public. Pricing is available only after secure login, as requested.
        </p>

        {!identity && (
          <div className="mt-6 flex items-start gap-3 rounded-[1.6rem] border border-sky-100 bg-sky-50 p-4 text-sm text-slate-600">
            <Lock className="mt-0.5 h-4 w-4 flex-none text-sky-700" />
            <p>
              Pricing is hidden for public visitors.{" "}
              <Link to="/login" className="font-semibold text-sky-700">
                Sign in
              </Link>{" "}
              to view charges and continue to booking.
            </p>
          </div>
        )}
      </section>

      <section className="page-section">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by service name, category or description"
                className="input-clean pl-11"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {serviceCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    category === item
                      ? "bg-sky-700 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map((service) => (
          <article key={service.name} className="page-card">
            <div className="flex items-start justify-between gap-4">
              <p className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                {service.category}
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {identity ? formatCurrency(service.price) : "Login to view"}
              </p>
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-slate-950">{service.name}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>

            <div className="mt-5 rounded-[1.4rem] bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Preparation</p>
              <p className="mt-2 leading-7">{service.preparation || "As advised by the center."}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/appointment" className="button-primary">
                Request Appointment
              </Link>
              {!identity && (
                <Link to="/login" className="button-secondary">
                  Login
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Services;
