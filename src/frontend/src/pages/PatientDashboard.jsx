import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Baby,
  Calendar,
  CheckCircle,
  Clock,
  LayoutDashboard,
  Loader2,
  LogIn,
  RefreshCw,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PregnancyTrackerTab from "../components/PregnancyTrackerTab";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllDoctors,
  useGetAllServices,
  useGetCallerUserProfile,
  useGetPatientAppointments,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";
import { AppointmentStatus } from "../types";

function StatusBadge({ status }) {
  const map = {
    [AppointmentStatus.pending]: {
      label: "Pending",
      className: "status-pending",
      icon: <Clock className="w-3 h-3" />,
    },
    [AppointmentStatus.approved]: {
      label: "Approved",
      className: "status-approved",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    [AppointmentStatus.cancelled]: {
      label: "Cancelled",
      className: "status-cancelled",
      icon: <XCircle className="w-3 h-3" />,
    },
    [AppointmentStatus.rescheduled]: {
      label: "Rescheduled",
      className: "status-rescheduled",
      icon: <RefreshCw className="w-3 h-3" />,
    },
  };
  const s = map[status] || map[AppointmentStatus.pending];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.className}`}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

function AppointmentCard({ appt, doctors, services }) {
  const doctor = doctors?.find((d) => d.name === appt.doctorId);
  const service = services?.find((s) => s.name === appt.serviceId);
  const createdDate = new Date(
    Number(appt.createdAt) / 1_000_000,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="medical-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-semibold text-foreground">
            {service?.name || appt.serviceId}
          </h4>
          <p className="text-sm text-muted-foreground">
            {doctor?.name || appt.doctorId}
          </p>
        </div>
        <StatusBadge status={appt.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{appt.requestedDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>{appt.requestedTimeSlot}</span>
        </div>
      </div>
      {appt.adminNote && (
        <div className="mt-3 p-2.5 bg-secondary/50 rounded-lg text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Note: </span>
          {appt.adminNote}
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground/60">
        Booked on {createdDate}
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { data: appointments, isLoading: apptLoading } =
    useGetPatientAppointments();
  const { data: doctors } = useGetAllDoctors();
  const { data: services } = useGetAllServices();
  const saveProfile = useSaveCallerUserProfile();

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editHistory, setEditHistory] = useState("");
  const [profileEditing, setProfileEditing] = useState(false);
  const [apptSearch, setApptSearch] = useState("");

  const isAuthenticated = !!identity;

  const upcomingAppts =
    appointments?.filter(
      (a) =>
        a.status === AppointmentStatus.pending ||
        a.status === AppointmentStatus.approved ||
        a.status === AppointmentStatus.rescheduled,
    ) || [];

  // Pre-compute filteredAppts using doctors/services lookups
  const filteredAppts = [...(appointments || [])]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .filter((appt) => {
      if (!apptSearch.trim()) return true;
      const q = apptSearch.toLowerCase();
      const doctorName = (
        doctors?.find((d) => d.name === appt.doctorId)?.name || appt.doctorId
      ).toLowerCase();
      const serviceName = (
        services?.find((s) => s.name === appt.serviceId)?.name || appt.serviceId
      ).toLowerCase();
      const status = String(appt.status).toLowerCase();
      const date = appt.requestedDate.toLowerCase();
      const timeSlot = appt.requestedTimeSlot.toLowerCase();
      return (
        doctorName.includes(q) ||
        serviceName.includes(q) ||
        status.includes(q) ||
        date.includes(q) ||
        timeSlot.includes(q)
      );
    });

  const startEditing = () => {
    setEditName(userProfile?.name || "");
    setEditPhone(userProfile?.phone || "");
    setEditEmail(userProfile?.email || "");
    setEditAddress(userProfile?.address || "");
    setEditHistory("");
    setProfileEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await saveProfile.mutateAsync({
        name: editName.trim(),
        phone: editPhone,
        email: editEmail,
        address: editAddress,
      });
      toast.success("Profile updated successfully!");
      setProfileEditing(false);
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="medical-card p-10 text-center max-w-md w-full">
          <LogIn className="w-14 h-14 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please login to access your patient dashboard.
          </p>
          <p className="text-sm text-muted-foreground">
            Use the <strong>Login</strong> button in the navigation to sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="hero-gradient text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">
                {profileLoading
                  ? "Loading..."
                  : `Welcome, ${userProfile?.name || "Patient"}!`}
              </h1>
              <p className="text-white/70 text-sm mt-0.5">
                Your personal health dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-8 bg-secondary/50 p-1 rounded-2xl h-auto flex-wrap gap-1">
            <TabsTrigger
              value="overview"
              className="rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Calendar className="w-4 h-4" /> Appointments
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <User className="w-4 h-4" /> Profile
            </TabsTrigger>
            <TabsTrigger
              value="pregnancy"
              className="rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Baby className="w-4 h-4" /> Pregnancy Tracker
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="medical-card p-5 text-center">
                <div className="font-display text-3xl font-bold text-primary mb-1">
                  {apptLoading ? "—" : upcomingAppts.length}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Upcoming Appointments
                </div>
              </div>
              <div className="medical-card p-5 text-center">
                <div className="font-display text-3xl font-bold text-primary mb-1">
                  {apptLoading ? "—" : appointments?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Total Appointments
                </div>
              </div>
              <div className="medical-card p-5 text-center">
                <div className="font-display text-3xl font-bold text-green-600 mb-1">
                  {apptLoading
                    ? "—"
                    : appointments?.filter(
                        (a) => a.status === AppointmentStatus.approved,
                      ).length || 0}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Approved
                </div>
              </div>
            </div>

            {/* Upcoming */}
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Appointments
              </h2>
              {apptLoading ? (
                <div className="medical-card p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </div>
              ) : upcomingAppts.length === 0 ? (
                <div className="medical-card p-8 text-center">
                  <AlertCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No upcoming appointments.
                  </p>
                  <Link to="/book-appointment" className="mt-3 inline-block">
                    <Button size="sm" className="rounded-xl mt-2">
                      Book an Appointment
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingAppts.slice(0, 4).map((appt) => (
                    <AppointmentCard
                      key={String(appt.id)}
                      appt={appt}
                      doctors={doctors}
                      services={services}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="text-center">
              <Link to="/book-appointment">
                <Button className="rounded-xl gap-2">
                  <Calendar className="w-4 h-4" />
                  Book New Appointment
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent
            value="appointments"
            className="space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-display text-lg font-bold text-foreground">
                All Appointments
              </h2>
              <Link to="/book-appointment">
                <Button size="sm" className="rounded-xl gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Book New
                </Button>
              </Link>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="patient-appt-search"
                placeholder="Search by doctor, service, date, or status…"
                value={apptSearch}
                onChange={(e) => setApptSearch(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>

            {apptLoading ? (
              <div className="medical-card p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              </div>
            ) : !appointments || appointments.length === 0 ? (
              <div className="medical-card p-10 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No appointments found.</p>
                <Link to="/book-appointment" className="mt-3 inline-block">
                  <Button size="sm" className="rounded-xl mt-2">
                    Book Your First Appointment
                  </Button>
                </Link>
              </div>
            ) : filteredAppts.length === 0 ? (
              <div className="medical-card p-8 text-center">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No appointments match your search.
                </p>
                <button
                  type="button"
                  onClick={() => setApptSearch("")}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAppts.map((appt) => (
                  <AppointmentCard
                    key={String(appt.id)}
                    appt={appt}
                    doctors={doctors}
                    services={services}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-fade-in">
            <div className="medical-card p-6 max-w-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-bold text-foreground">
                  My Profile
                </h2>
                {!profileEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startEditing}
                    className="rounded-xl"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {profileEditing ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="peName">Full Name *</Label>
                    <Input
                      id="peName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pePhone">Phone</Label>
                    <Input
                      id="pePhone"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="rounded-xl"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="peEmail">Email</Label>
                    <Input
                      id="peEmail"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="rounded-xl"
                      type="email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="peAddress">Address</Label>
                    <Input
                      id="peAddress"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="peHistory">Medical History Notes</Label>
                    <Textarea
                      id="peHistory"
                      value={editHistory}
                      onChange={(e) => setEditHistory(e.target.value)}
                      placeholder="Any relevant medical history, allergies, or notes..."
                      className="rounded-xl min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saveProfile.isPending}
                      className="rounded-xl flex-1"
                    >
                      {saveProfile.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setProfileEditing(false)}
                      className="rounded-xl"
                      disabled={saveProfile.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: userProfile?.name },
                    { label: "Phone", value: userProfile?.phone },
                    { label: "Email", value: userProfile?.email },
                    { label: "Address", value: userProfile?.address },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="flex flex-col gap-0.5 py-3 border-b border-border last:border-0"
                    >
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {field.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {field.value || (
                          <span className="text-muted-foreground italic">
                            Not provided
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Principal ID
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                      {identity?.getPrincipal().toString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pregnancy Tracker Tab */}
          <TabsContent value="pregnancy" className="animate-fade-in">
            <PregnancyTrackerTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
