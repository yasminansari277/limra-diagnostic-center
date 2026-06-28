import { Clock3, UserRound } from "lucide-react";
import { useGetAllDoctors } from "../hooks/useQueries";
import { getDoctors, getDoctorImage } from "../lib/clinicData";

function Doctors() {
  const { data } = useGetAllDoctors();
  const doctors = getDoctors(data).filter((doctor) => !doctor.isPlaceholder);

  return (
    <div className="page-stack">
      <section className="page-section page-hero-card">
        <p className="section-label">Doctors</p>
        <h1 className="page-title">Radiology availability presented in a simple, professional format.</h1>
        <p className="page-intro">
          Patients can review qualifications, specialization and consulting hours before
          moving into the appointment request flow.
        </p>
      </section>

      <section className="page-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
        {doctors.map((doctor) => (
          <article
            key={doctor.name}
            className={`overflow-hidden rounded-[2rem] border p-6 shadow-sm ${
              doctor.isPlaceholder
                ? "border-dashed border-slate-300 bg-slate-50"
                : "border-slate-200 bg-white"
            }`}
          >
            {doctor.isPlaceholder ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-slate-200 p-4 text-slate-500">
                  <UserRound className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-900">Coming Soon</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Additional consulting coverage will be announced here once active.
                </p>
              </div>
            ) : (
              <>
                <img
                  src={getDoctorImage(doctor.name)}
                  alt={doctor.name}
                  className="h-64 w-full rounded-[1.5rem] object-cover"
                />
                <h2 className="mt-6 text-2xl font-semibold text-slate-950">{doctor.name}</h2>
                <p className="mt-1 text-sm font-medium text-sky-700">
                  {doctor.qualifications} | {doctor.specialization}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {Number(doctor.experience)} years of radiology experience with patient-facing
                  availability aligned to the clinic’s appointment workflow.
                </p>
                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <Clock3 className="h-4 w-4 text-sky-700" />
                  Available {doctor.timingStart} - {doctor.timingEnd}
                </div>
              </>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

export default Doctors;
