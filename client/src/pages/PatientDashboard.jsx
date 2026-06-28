import { CalendarDays, CheckCircle2, Clock3, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetAllDoctors,
  useGetAllServices,
  useGetCallerUserProfile,
  useGetPatientAppointments,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";
import {
  formatBigIntDate,
  formatCurrency,
  getDoctors,
  getServices,
  matchesAppointmentSearch,
} from "../lib/clinicData";

function StatusBadge({ status }) {
  const labels = {
    pending: { text: "Pending", className: "status-pill status-pending" },
    approved: { text: "Approved", className: "status-pill status-approved" },
    cancelled: { text: "Rejected", className: "status-pill status-cancelled" },
    rescheduled: { text: "Rescheduled", className: "status-pill status-rescheduled" },
  };
  const item = labels[status] || labels.pending;
  return <span className={item.className}>{item.text}</span>;
}

function PatientDashboard() {
  const { data: profile } = useGetCallerUserProfile();
  const { data: appointmentsData } = useGetPatientAppointments();
  const { data: doctorsData } = useGetAllDoctors();
  const { data: servicesData } = useGetAllServices();
  const saveProfile = useSaveCallerUserProfile();

  const doctors = getDoctors(doctorsData);
  const services = getServices(servicesData);
  const appointments = useMemo(
    () => [...(appointmentsData || [])].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)),
    [appointmentsData],
  );

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    address: profile?.address || "",
  });

  useEffect(() => {
    if (!profile || editing) return;
    setForm({
      name: profile.name || "",
      phone: profile.phone || "",
      email: profile.email || "",
      address: profile.address || "",
    });
  }, [editing, profile]);

  const filteredAppointments = appointments.filter((appointment) =>
    matchesAppointmentSearch({
      appointment,
      searchText: search,
      doctors,
      services,
    }),
  );

  const summary = {
    total: appointments.length,
    pending: appointments.filter((item) => item.status === "pending").length,
    approved: appointments.filter((item) => item.status === "approved").length,
  };

  const handleProfileSave = async () => {
    if (!form.name.trim()) {
      toast.error("Patient name is required.");
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
      });
      toast.success("Profile updated.");
      setEditing(false);
    } catch (error) {
      toast.error(error?.message || "Unable to update profile.");
    }
  };

  return (
    <div className="page-section py-10">
      <div className="space-y-6">
        <section className="page-hero-card">
          <p className="section-label">Patient Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {profile?.name ? `Welcome, ${profile.name}` : "Welcome to your patient dashboard"}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Search appointments by doctor, service, date or status. Pricing is visible here
            because you are signed in.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Total Appointments", value: summary.total, icon: <CalendarDays className="h-5 w-5" /> },
            { label: "Pending", value: summary.pending, icon: <Clock3 className="h-5 w-5" /> },
            { label: "Approved", value: summary.approved, icon: <CheckCircle2 className="h-5 w-5" /> },
          ].map((card) => (
            <div key={card.label} className="dashboard-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{card.label}</p>
                <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">{card.icon}</div>
              </div>
              <p className="mt-6 text-3xl font-semibold text-slate-950">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="dashboard-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Appointments</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Status is updated after admin approval, rejection or rescheduling.
                </p>
              </div>
              <Link to="/appointment" className="button-primary">
                New Appointment
              </Link>
            </div>

            <div className="relative mt-6">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by doctor, service, date or status"
                className="input-clean pl-11"
              />
            </div>

            <div className="mt-6 space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                  No appointments match the current search.
                </div>
              ) : (
                filteredAppointments.map((appointment) => {
                  const doctor = doctors.find((item) => item.name === appointment.doctorId);
                  const service = services.find((item) => item.name === appointment.serviceId);

                  return (
                    <article
                      key={String(appointment.id)}
                      className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">
                            {service?.name || appointment.serviceId}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {doctor?.name || appointment.doctorId}
                          </p>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <p>
                          <span className="font-medium text-slate-900">Date:</span>{" "}
                          {appointment.requestedDate}
                        </p>
                        <p>
                          <span className="font-medium text-slate-900">Time:</span>{" "}
                          {appointment.requestedTimeSlot}
                        </p>
                        <p>
                          <span className="font-medium text-slate-900">Price:</span>{" "}
                          {service ? formatCurrency(service.price) : "Not available"}
                        </p>
                        <p>
                          <span className="font-medium text-slate-900">Created:</span>{" "}
                          {formatBigIntDate(appointment.createdAt)}
                        </p>
                      </div>

                      {appointment.adminNote ? (
                        <div className="mt-4 rounded-[1.2rem] border border-slate-200 bg-white p-4 text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">Admin note:</span>{" "}
                          {appointment.adminNote}
                        </div>
                      ) : null}
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Profile</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Keep contact details current for appointment coordination.
                </p>
              </div>
              {!editing ? (
                <button type="button" onClick={() => setEditing(true)} className="button-secondary">
                  Edit
                </button>
              ) : null}
            </div>

            {editing ? (
              <div className="mt-6 space-y-4">
                {[
                  { key: "name", label: "Full name", type: "text" },
                  { key: "phone", label: "Phone", type: "tel" },
                  { key: "email", label: "Email", type: "email" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      className="input-clean"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, address: event.target.value }))
                    }
                    className="input-clean min-h-[120px] resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleProfileSave}
                    disabled={saveProfile.isPending}
                    className="button-primary"
                  >
                    Save
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="button-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {[
                  { label: "Full name", value: profile?.name },
                  { label: "Phone", value: profile?.phone },
                  { label: "Email", value: profile?.email },
                  { label: "Address", value: profile?.address },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-900">
                      {item.value || "Not provided"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-[1.4rem] border border-sky-100 bg-sky-50 p-4 text-sm leading-7 text-slate-600">
              Appointment pricing is visible here only because the dashboard is a protected route.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PatientDashboard;
