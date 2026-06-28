import {
  CalendarRange,
  CheckCircle2,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useApproveAppointment,
  useCancelAppointment,
  useGetAdminDashboardStats,
  useGetAllAppointments,
  useGetAllDoctors,
  useGetAllPatients,
  useGetAllServices,
  useInitializeSystem,
  useRescheduleAppointment,
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

function AdminDashboard() {
  const { data: stats } = useGetAdminDashboardStats();
  const { data: appointmentsData } = useGetAllAppointments();
  const { data: patientsData } = useGetAllPatients();
  const { data: doctorsData } = useGetAllDoctors();
  const { data: servicesData } = useGetAllServices();
  const initializeSystem = useInitializeSystem();
  const approveAppointment = useApproveAppointment();
  const cancelAppointment = useCancelAppointment();
  const rescheduleAppointment = useRescheduleAppointment();

  const doctors = getDoctors(doctorsData);
  const services = getServices(servicesData);
  const appointments = useMemo(
    () => [...(appointmentsData || [])].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)),
    [appointmentsData],
  );
  const patients = patientsData || [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionState, setActionState] = useState({});

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    return (
      matchesStatus &&
      matchesAppointmentSearch({
        appointment,
        searchText: search,
        doctors,
        services,
      })
    );
  });

  const handleApprove = async (appointmentId) => {
    try {
      await approveAppointment.mutateAsync({
        appointmentId,
        note: actionState[appointmentId]?.note || "",
      });
      toast.success("Appointment approved.");
    } catch (error) {
      toast.error(error?.message || "Unable to approve appointment.");
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await cancelAppointment.mutateAsync({
        appointmentId,
        note: actionState[appointmentId]?.note || "",
      });
      toast.success("Appointment rejected.");
    } catch (error) {
      toast.error(error?.message || "Unable to reject appointment.");
    }
  };

  const handleReschedule = async (appointmentId) => {
    const action = actionState[appointmentId] || {};
    if (!action.newDate || !action.newTimeSlot) {
      toast.error("Provide both a new date and new time.");
      return;
    }

    try {
      await rescheduleAppointment.mutateAsync({
        appointmentId,
        newDate: action.newDate,
        newTimeSlot: action.newTimeSlot,
        note: action.note || "",
      });
      toast.success("Appointment rescheduled.");
    } catch (error) {
      toast.error(error?.message || "Unable to reschedule appointment.");
    }
  };

  const updateAction = (appointmentId, key, value) => {
    setActionState((current) => ({
      ...current,
      [appointmentId]: {
        ...current[appointmentId],
        [key]: value,
      },
    }));
  };

  return (
    <div className="page-section py-10">
      <div className="space-y-6">
        <section className="page-hero-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-label">Admin Dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                Review appointment requests and manage clinic operations.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                Search and filter appointment requests in real time. Status changes are
                reflected back in the patient dashboard immediately through query invalidation.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await initializeSystem.mutateAsync();
                  toast.success("System data initialized.");
                } catch (error) {
                  toast.error(error?.message || "Unable to initialize system data.");
                }
              }}
              disabled={initializeSystem.isPending}
              className="button-secondary"
            >
              {initializeSystem.isPending ? "Initializing..." : "Initialize Doctors & Services"}
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Patients", value: Number(stats?.totalPatients || patients.length), icon: <UserRound className="h-5 w-5" /> },
            { label: "Today's Appointments", value: Number(stats?.todaysAppointments || 0), icon: <CalendarRange className="h-5 w-5" /> },
            { label: "Revenue", value: formatCurrency(stats?.totalRevenue || 0), icon: <CheckCircle2 className="h-5 w-5" /> },
            { label: "Doctors", value: Number(stats?.doctorsCount || doctors.length), icon: <ShieldCheck className="h-5 w-5" /> },
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
                <h2 className="text-2xl font-semibold text-slate-950">Appointment Requests</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Text search and status filter work together on the same list.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "cancelled", label: "Rejected" },
                  { value: "rescheduled", label: "Rescheduled" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStatusFilter(item.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      statusFilter === item.value
                        ? "bg-sky-700 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-6">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by doctor, service, date, status or patient id"
                className="input-clean pl-11"
              />
            </div>

            <div className="mt-6 space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                  No appointments match the current filters.
                </div>
              ) : (
                filteredAppointments.map((appointment) => {
                  const doctor = doctors.find((item) => item.name === appointment.doctorId);
                  const service = services.find((item) => item.name === appointment.serviceId);
                  const action = actionState[appointment.id] || {};

                  return (
                    <article
                      key={String(appointment.id)}
                      className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">
                            {service?.name || appointment.serviceId}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {doctor?.name || appointment.doctorId}
                          </p>
                          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
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
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>

                      <div className="mt-4 space-y-3">
                        <input
                          type="text"
                          value={action.note || ""}
                          onChange={(event) =>
                            updateAction(appointment.id, "note", event.target.value)
                          }
                          placeholder="Optional admin note"
                          className="input-clean"
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={action.newDate || ""}
                            onChange={(event) =>
                              updateAction(appointment.id, "newDate", event.target.value)
                            }
                            className="input-clean"
                          />
                          <input
                            type="text"
                            value={action.newTimeSlot || ""}
                            onChange={(event) =>
                              updateAction(appointment.id, "newTimeSlot", event.target.value)
                            }
                            className="input-clean"
                            placeholder="New time slot"
                          />
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleApprove(appointment.id)}
                            className="button-primary gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(appointment.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReschedule(appointment.id)}
                            className="button-secondary gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="text-2xl font-semibold text-slate-950">Patients</h2>
            <p className="mt-1 text-sm text-slate-600">
              Registered patient profiles associated with appointments.
            </p>
            <div className="mt-6 space-y-4">
              {patients.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                  No patient profiles found yet.
                </div>
              ) : (
                patients.map((patient) => (
                  <article key={patient.id.toString()} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-base font-semibold text-slate-950">{patient.name || "Unnamed patient"}</p>
                    <p className="mt-1 text-sm text-slate-600">{patient.phone || "Phone not provided"}</p>
                    <p className="mt-1 text-sm text-slate-600">{patient.email || "Email not provided"}</p>
                    <p className="mt-3 text-xs leading-6 text-slate-500">{patient.address || "Address not provided"}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
