import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  LogIn,
  RefreshCw,
  Search,
  Shield,
  Stethoscope,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useApproveAppointment,
  useCancelAppointment,
  useGetAdminActivityLog,
  useGetAdminDashboardStats,
  useGetAllAppointments,
  useGetAllDoctors,
  useGetAllPatients,
  useGetAllServices,
  useInitializeSystem,
  useIsCallerAdmin,
  useRescheduleAppointment,
  useUpdateDoctor,
} from "../hooks/useQueries";
import { AppointmentStatus } from "../types";

function StatusBadge({ status }) {
  const map = {
    [AppointmentStatus.pending]: {
      label: "Pending",
      className: "status-pending",
    },
    [AppointmentStatus.approved]: {
      label: "Approved",
      className: "status-approved",
    },
    [AppointmentStatus.cancelled]: {
      label: "Cancelled",
      className: "status-cancelled",
    },
    [AppointmentStatus.rescheduled]: {
      label: "Rescheduled",
      className: "status-rescheduled",
    },
  };
  const s = map[status] || map[AppointmentStatus.pending];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${s.className}`}
    >
      {s.label}
    </span>
  );
}

function AppointmentRow({ appt, services }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [reschedDate, setReschedDate] = useState("");
  const [reschedTime, setReschedTime] = useState("");
  const [action, setAction] = useState(null);

  const approve = useApproveAppointment();
  const cancel = useCancelAppointment();
  const reschedule = useRescheduleAppointment();

  const service = services?.find((s) => s.name === appt.serviceId);
  const createdDate = new Date(
    Number(appt.createdAt) / 1_000_000,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({ appointmentId: appt.id, note });
      toast.success("Appointment approved!");
      setExpanded(false);
      setAction(null);
      setNote("");
    } catch {
      toast.error("Failed to approve appointment");
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync({ appointmentId: appt.id, note });
      toast.success("Appointment cancelled");
      setExpanded(false);
      setAction(null);
      setNote("");
    } catch {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleReschedule = async () => {
    if (!reschedDate || !reschedTime) {
      toast.error("Please enter new date and time");
      return;
    }
    try {
      await reschedule.mutateAsync({
        appointmentId: appt.id,
        newDate: reschedDate,
        newTimeSlot: reschedTime,
        note,
      });
      toast.success("Appointment rescheduled!");
      setExpanded(false);
      setAction(null);
      setNote("");
      setReschedDate("");
      setReschedTime("");
    } catch {
      toast.error("Failed to reschedule appointment");
    }
  };

  const isBusy = approve.isPending || cancel.isPending || reschedule.isPending;

  return (
    <div className="medical-card p-4 mb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">
              #{String(appt.id)}
            </span>
            <StatusBadge status={appt.status} />
          </div>
          <div className="text-sm text-foreground mt-1">{appt.serviceId}</div>
          <div className="text-xs text-muted-foreground">{appt.doctorId}</div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {appt.requestedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {appt.requestedTimeSlot}
            </span>
          </div>
          {service && (
            <div className="text-xs text-primary mt-1">
              ₹{Number(service.price).toLocaleString("en-IN")}
            </div>
          )}
          <div className="text-xs text-muted-foreground/60 mt-1">
            Booked: {createdDate}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in">
          {appt.adminNote && (
            <div className="p-2.5 bg-secondary/50 rounded-lg text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                Previous Note:{" "}
              </span>
              {appt.adminNote}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => setAction(action === "approve" ? null : "approve")}
              className="rounded-xl gap-1.5 bg-green-600 hover:bg-green-700 text-white"
              disabled={isBusy}
            >
              <CheckCircle className="w-3.5 h-3.5" /> Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setAction(action === "cancel" ? null : "cancel")}
              className="rounded-xl gap-1.5"
              disabled={isBusy}
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setAction(action === "reschedule" ? null : "reschedule")
              }
              className="rounded-xl gap-1.5 border-primary/30 text-primary"
              disabled={isBusy}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reschedule
            </Button>
          </div>

          {action && (
            <div className="space-y-2 p-3 bg-secondary/30 rounded-xl animate-fade-in">
              {action === "reschedule" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">New Date</Label>
                    <Input
                      type="date"
                      value={reschedDate}
                      onChange={(e) => setReschedDate(e.target.value)}
                      className="rounded-lg h-8 text-xs"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">New Time</Label>
                    <Input
                      value={reschedTime}
                      onChange={(e) => setReschedTime(e.target.value)}
                      placeholder="e.g. 11:00 AM"
                      className="rounded-lg h-8 text-xs"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-xs">Note (optional)</Label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for the patient..."
                  className="rounded-lg h-8 text-xs"
                />
              </div>
              <Button
                size="sm"
                onClick={
                  action === "approve"
                    ? handleApprove
                    : action === "cancel"
                      ? handleCancel
                      : handleReschedule
                }
                disabled={isBusy}
                className="rounded-xl w-full"
              >
                {isBusy ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : null}
                Confirm{" "}
                {action === "approve"
                  ? "Approval"
                  : action === "cancel"
                    ? "Cancellation"
                    : "Reschedule"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DoctorEditCard({ doctor }) {
  const [editing, setEditing] = useState(false);
  const [timingStart, setTimingStart] = useState(doctor.timingStart);
  const [timingEnd, setTimingEnd] = useState(doctor.timingEnd);
  const [isActive, setIsActive] = useState(doctor.isActive);
  const updateDoctor = useUpdateDoctor();

  const handleSave = async () => {
    try {
      await updateDoctor.mutateAsync({
        name: doctor.name,
        updatedDoctor: { ...doctor, timingStart, timingEnd, isActive },
      });
      toast.success(`${doctor.name} updated!`);
      setEditing(false);
    } catch {
      toast.error("Failed to update doctor");
    }
  };

  if (doctor.isPlaceholder) {
    return (
      <div className="medical-card p-5 border-dashed opacity-60">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-dashed border-primary/20">
            <img
              src="/assets/generated/doctor-placeholder.dim_300x300.png"
              alt="Placeholder"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-muted-foreground">
              Position Open
            </div>
            <Badge variant="outline" className="text-xs rounded-full mt-1">
              Coming Soon
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
            <img
              src={
                doctor.name.includes("Humera")
                  ? "/assets/generated/doctor-humera.dim_300x300.png"
                  : "/assets/generated/doctor-naved.dim_300x300.png"
              }
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-foreground">{doctor.name}</div>
            <div className="text-xs text-primary">{doctor.qualifications}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-green-500" : "bg-muted-foreground/30"}`}
          />
          <span className="text-xs text-muted-foreground">
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3 mt-3 pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Timing Start</Label>
              <Input
                value={timingStart}
                onChange={(e) => setTimingStart(e.target.value)}
                className="rounded-lg h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Timing End</Label>
              <Input
                value={timingEnd}
                onChange={(e) => setTimingEnd(e.target.value)}
                className="rounded-lg h-8 text-xs"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`active-${doctor.name}`}
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded"
            />
            <Label
              htmlFor={`active-${doctor.name}`}
              className="text-xs cursor-pointer"
            >
              Doctor is Active
            </Label>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateDoctor.isPending}
              className="rounded-xl flex-1"
            >
              {updateDoctor.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {doctor.timingStart} – {doctor.timingEnd}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditing(true)}
            className="rounded-xl text-xs h-7"
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: stats, isLoading: statsLoading } = useGetAdminDashboardStats();
  const { data: appointments, isLoading: apptLoading } =
    useGetAllAppointments();
  const { data: patients, isLoading: patientsLoading } = useGetAllPatients();
  const { data: doctors } = useGetAllDoctors();
  const { data: services } = useGetAllServices();
  const { data: activityLog, isLoading: logLoading } = useGetAdminActivityLog();
  const initSystem = useInitializeSystem();

  const [statusFilter, setStatusFilter] = useState("all");
  const [apptSearch, setApptSearch] = useState("");

  const isAuthenticated = !!identity;

  // Combined filter: status first (matchesStatus guard), then text search on passing subset
  const filteredAppts =
    appointments?.filter((a) => {
      const matchesStatus =
        statusFilter === "all" || String(a.status) === statusFilter;
      if (!matchesStatus) return false;
      if (!apptSearch.trim()) return true;
      const q = apptSearch.toLowerCase();
      const serviceName = (a.serviceId || "").toLowerCase();
      const doctorName = (a.doctorId || "").toLowerCase();
      const date = (a.requestedDate || "").toLowerCase();
      const timeSlot = (a.requestedTimeSlot || "").toLowerCase();
      const status = String(a.status).toLowerCase();
      const patientId = a.patientId.toString().toLowerCase();
      return (
        serviceName.includes(q) ||
        doctorName.includes(q) ||
        date.includes(q) ||
        timeSlot.includes(q) ||
        status.includes(q) ||
        patientId.includes(q)
      );
    }) || [];

  const handleInitSystem = async () => {
    try {
      await initSystem.mutateAsync();
      toast.success("System initialized with doctors and services!");
    } catch {
      toast.error("Failed to initialize system. You may need admin access.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="medical-card p-10 text-center max-w-md w-full">
          <LogIn className="w-14 h-14 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Admin Login Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please login with admin credentials to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="medical-card p-10 text-center max-w-md w-full">
          <Shield className="w-14 h-14 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">
            You do not have admin privileges to access this dashboard.
          </p>
          <Badge variant="destructive" className="rounded-full">
            Unauthorized
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="hero-gradient text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  Admin Dashboard
                </h1>
                <p className="text-white/70 text-sm mt-0.5">
                  Limra Diagnostic Center Management
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleInitSystem}
              disabled={initSystem.isPending}
              className="border-white/30 text-white hover:bg-white/10 rounded-xl gap-2"
            >
              {initSystem.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Initialize System Data
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analytics">
          <TabsList className="mb-8 bg-secondary/50 p-1 rounded-2xl h-auto flex-wrap gap-1">
            <TabsTrigger
              value="analytics"
              className="rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <BarChart3 className="w-4 h-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Calendar className="w-4 h-4" /> Appointments
            </TabsTrigger>
            <TabsTrigger
              value="patients"
              className="rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Users className="w-4 h-4" /> Patients
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Stethoscope className="w-4 h-4" /> Doctors
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Activity className="w-4 h-4" /> Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Patients",
                  value: statsLoading ? "—" : String(stats?.totalPatients ?? 0),
                  icon: <Users className="w-6 h-6" />,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Today's Appointments",
                  value: statsLoading
                    ? "—"
                    : String(stats?.todaysAppointments ?? 0),
                  icon: <Calendar className="w-6 h-6" />,
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  label: "Total Revenue",
                  value: statsLoading
                    ? "—"
                    : `₹${Number(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`,
                  icon: <TrendingUp className="w-6 h-6" />,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  label: "Active Doctors",
                  value: statsLoading ? "—" : String(stats?.doctorsCount ?? 0),
                  icon: <Stethoscope className="w-6 h-6" />,
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((stat) => (
                <div key={stat.label} className="medical-card p-5">
                  <div
                    className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`font-display text-2xl font-bold ${stat.color} mb-1`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Appointment Status Summary */}
            <div className="medical-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Appointment Status Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    status: AppointmentStatus.pending,
                    label: "Pending",
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                  {
                    status: AppointmentStatus.approved,
                    label: "Approved",
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                  {
                    status: AppointmentStatus.cancelled,
                    label: "Cancelled",
                    color: "text-red-600",
                    bg: "bg-red-50",
                  },
                  {
                    status: AppointmentStatus.rescheduled,
                    label: "Rescheduled",
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                ].map((s) => {
                  const count =
                    appointments?.filter(
                      (a) => String(a.status) === String(s.status),
                    ).length || 0;
                  return (
                    <div
                      key={s.label}
                      className={`p-4 rounded-2xl ${s.bg} text-center`}
                    >
                      <div
                        className={`font-display text-2xl font-bold ${s.color}`}
                      >
                        {count}
                      </div>
                      <div
                        className={`text-xs font-medium ${s.color} opacity-80`}
                      >
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent
            value="appointments"
            className="space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-display text-lg font-bold text-foreground">
                Manage Appointments
              </h2>
              <div className="flex gap-2 flex-wrap">
                {[
                  "all",
                  AppointmentStatus.pending,
                  AppointmentStatus.approved,
                  AppointmentStatus.cancelled,
                  AppointmentStatus.rescheduled,
                ].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {s === "all"
                      ? "All"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Text search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="admin-appt-search"
                placeholder="Search by service, doctor, date, patient ID, or status…"
                value={apptSearch}
                onChange={(e) => setApptSearch(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>

            {apptLoading ? (
              <div className="medical-card p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              </div>
            ) : filteredAppts.length === 0 ? (
              <div className="medical-card p-10 text-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No appointments match your search.
                </p>
                {apptSearch && (
                  <button
                    type="button"
                    onClick={() => setApptSearch("")}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div>
                {[...filteredAppts]
                  .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                  .map((appt) => (
                    <AppointmentRow
                      key={String(appt.id)}
                      appt={appt}
                      services={services}
                    />
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-foreground">
              Manage Patients
            </h2>
            {patientsLoading ? (
              <div className="medical-card p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              </div>
            ) : !patients || patients.length === 0 ? (
              <div className="medical-card p-10 text-center">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No registered patients yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patients.map((patient) => {
                  const patientAppts =
                    appointments?.filter(
                      (a) => a.patientId.toString() === patient.id.toString(),
                    ) || [];
                  return (
                    <div
                      key={patient.id.toString()}
                      className="medical-card p-5"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {patient.name?.[0] || "P"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground">
                            {patient.name || "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {patient.phone || "No phone"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {patient.email || "No email"}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs rounded-full flex-shrink-0"
                        >
                          {patientAppts.length} appts
                        </Badge>
                      </div>
                      {patient.address && (
                        <div className="text-xs text-muted-foreground mb-2">
                          {patient.address}
                        </div>
                      )}
                      <div className="text-xs font-mono text-muted-foreground/50 truncate">
                        {patient.id.toString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="space-y-4 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-foreground">
              Manage Doctors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctors?.map((doctor) => (
                <DoctorEditCard key={doctor.name} doctor={doctor} />
              ))}
            </div>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-4 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-foreground">
              Admin Activity Log
            </h2>
            {logLoading ? (
              <div className="medical-card p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              </div>
            ) : !activityLog || activityLog.length === 0 ? (
              <div className="medical-card p-10 text-center">
                <Activity className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No activity recorded yet.
                </p>
              </div>
            ) : (
              <div className="medical-card divide-y divide-border">
                {[...activityLog]
                  .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                  .map((log) => {
                    const ts = new Date(Number(log.timestamp) / 1_000_000);
                    const timeStr = ts.toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={`${String(log.timestamp)}-${log.action}`}
                        className="p-4 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Activity className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-foreground font-medium">
                            {log.action}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {timeStr}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground/50 truncate mt-0.5">
                            {log.performedBy.toString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
