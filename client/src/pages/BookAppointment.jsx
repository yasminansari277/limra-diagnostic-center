import { CalendarCheck2, CheckCircle2, ChevronLeft, ChevronRight, Lock, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllDoctors,
  useGetAllServices,
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
  useSubmitAppointmentRequest,
} from "../hooks/useQueries";
import {
  getDoctors,
  getDoctorImage,
  getServices,
  getSlotsForDoctor,
} from "../lib/clinicData";

const steps = [
  "Select Service",
  "Choose Doctor",
  "Date & Time",
  "Patient Details",
];

function StepMarker({ currentStep }) {
  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const active = index + 1 === currentStep;
        const complete = index + 1 < currentStep;
        return (
          <div
            key={step}
            className={`rounded-[1.4rem] border px-4 py-3 text-sm font-medium ${
              complete
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : active
                  ? "border-sky-200 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}

function BookAppointment() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: servicesData } = useGetAllServices();
  const { data: doctorsData } = useGetAllDoctors();
  const { data: profile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const submitAppointment = useSubmitAppointmentRequest();

  const [step, setStep] = useState(1);
  const [submittedId, setSubmittedId] = useState(null);
  const [form, setForm] = useState({
    serviceName: "",
    doctorName: "",
    preferredDate: "",
    preferredTime: "",
    patientName: "",
    patientPhone: "",
    patientAddress: "",
  });

  const services = getServices(servicesData);
  const doctors = getDoctors(doctorsData).filter((doctor) => !doctor.isPlaceholder && doctor.isActive);

  useEffect(() => {
    if (!profile) return;
    setForm((current) => ({
      ...current,
      patientName: current.patientName || profile.name || "",
      patientPhone: current.patientPhone || profile.phone || "",
      patientAddress: current.patientAddress || profile.address || "",
    }));
  }, [profile]);

  const selectedService = useMemo(
    () => services.find((service) => service.name === form.serviceName),
    [form.serviceName, services],
  );
  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.name === form.doctorName),
    [doctors, form.doctorName],
  );
  const doctorSlots = getSlotsForDoctor(form.doctorName);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !form.serviceName) {
      toast.error("Select a service to continue.");
      return;
    }
    if (step === 2 && !form.doctorName) {
      toast.error("Select a doctor to continue.");
      return;
    }
    if (step === 3 && (!form.preferredDate || !form.preferredTime)) {
      toast.error("Select both date and time to continue.");
      return;
    }
    setStep((current) => current + 1);
  };

  const handleSubmit = async () => {
    if (!form.patientName.trim()) {
      toast.error("Patient name is required.");
      return;
    }
    if (!form.patientPhone.trim()) {
      toast.error("Patient phone is required.");
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: form.patientName.trim(),
        phone: form.patientPhone.trim(),
        email: profile?.email || "",
        address: form.patientAddress.trim(),
      });

      const result = await submitAppointment.mutateAsync({
        doctorId: form.doctorName,
        serviceId: form.serviceName,
        requestedDate: form.preferredDate,
        requestedTimeSlot: form.preferredTime,
        patientName: form.patientName.trim(),
        patientPhone: form.patientPhone.trim(),
        patientAddress: form.patientAddress.trim(),
      });

      setSubmittedId(typeof result === "bigint" ? result.toString() : String(result));
      toast.success("Appointment request submitted for admin approval.");
    } catch (error) {
      toast.error(error?.message || "Unable to submit appointment request.");
    }
  };

  if (submittedId) {
    return (
      <div className="page-section py-10">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-slate-950">Appointment request submitted</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Your request has been saved with pending status and is waiting for admin review.
            Reference ID: <span className="font-semibold text-slate-900">#{submittedId}</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="button-primary">
              Open Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmittedId(null);
                setStep(1);
                setForm((current) => ({
                  ...current,
                  serviceName: "",
                  doctorName: "",
                  preferredDate: "",
                  preferredTime: "",
                }));
              }}
              className="button-secondary"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="page-section py-10">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <p className="section-label">Secure Booking</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Login is required before booking.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Appointment requests are tied to patient identity and dashboard tracking,
                so secure login is required before selecting doctor, service and timing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="mt-8 button-primary"
          >
            {isLoggingIn ? "Opening Internet Identity..." : "Login with Internet Identity"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="section-label">Appointment Booking</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Request an appointment in four steps.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          All online bookings are submitted with pending status and require admin approval.
        </p>

        <StepMarker currentStep={step} />

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <button
                key={service.name}
                type="button"
                onClick={() => updateField("serviceName", service.name)}
                className={`rounded-[1.6rem] border p-5 text-left transition ${
                  form.serviceName === service.name
                    ? "border-sky-300 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {service.category}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">{service.name}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            {doctors.map((doctor) => (
              <button
                key={doctor.name}
                type="button"
                onClick={() => updateField("doctorName", doctor.name)}
                className={`rounded-[1.6rem] border p-5 text-left transition ${
                  form.doctorName === doctor.name
                    ? "border-sky-300 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={getDoctorImage(doctor.name)}
                    alt={doctor.name}
                    className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{doctor.name}</h2>
                    <p className="text-sm font-medium text-sky-700">
                      {doctor.qualifications} | {doctor.specialization}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Available {doctor.timingStart} - {doctor.timingEnd}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6 lg:grid-cols-[0.45fr_0.55fr]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Preferred date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.preferredDate}
                onChange={(event) => updateField("preferredDate", event.target.value)}
                className="input-clean"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-900">Preferred time</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {doctorSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => updateField("preferredTime", slot)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      form.preferredTime === slot
                        ? "border-sky-300 bg-sky-50 text-sky-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-slate-50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-5 lg:grid-cols-[0.55fr_0.45fr]">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Patient name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(event) => updateField("patientName", event.target.value)}
                  className="input-clean"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={form.patientPhone}
                  onChange={(event) => updateField("patientPhone", event.target.value)}
                  className="input-clean"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Address
                </label>
                <textarea
                  value={form.patientAddress}
                  onChange={(event) => updateField("patientAddress", event.target.value)}
                  className="input-clean min-h-[120px] resize-none"
                  placeholder="Enter patient address"
                />
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-sky-700 shadow-sm">
                  <CalendarCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-950">Request Summary</p>
                  <p className="text-sm text-slate-600">Submitted for manual review</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Service</span>
                  <span className="font-semibold text-slate-900">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Doctor</span>
                  <span className="font-semibold text-slate-900">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Date</span>
                  <span className="font-semibold text-slate-900">{form.preferredDate}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Time</span>
                  <span className="font-semibold text-slate-900">{form.preferredTime}</span>
                </div>
              </div>
              <div className="mt-6 rounded-[1.4rem] border border-sky-100 bg-white p-4 text-sm leading-7 text-slate-600">
                The patient dashboard will show the booking as pending until an administrator
                approves, reschedules or rejects it.
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((current) => current - 1)}
              className="button-secondary gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 4 ? (
            <button type="button" onClick={handleNext} className="button-primary gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitAppointment.isPending || saveProfile.isPending}
              className="button-primary gap-2"
            >
              <UserRound className="h-4 w-4" />
              {submitAppointment.isPending || saveProfile.isPending
                ? "Submitting..."
                : "Submit Appointment Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
