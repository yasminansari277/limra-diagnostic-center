export const clinic = {
  name: "Limra Diagnostic",
  alternateName: "Sonography & Doppler Clinic",
  city: "Pune, Maharashtra",
  address:
    "C-1/001, Ground Floor, Natasha Enclave, NIBM Chowk, NIBM Post Office Road, Kondhwa, Pune, Maharashtra 411048",
  phone: "+91 94239 37772",
  hours: "Monday to Saturday, 11:00 AM to 9:30 PM",
  mapQuery:
    "https://www.google.com/maps?q=18.4770943,73.8967817&z=16&output=embed",
  mapDirections:
    "https://www.google.com/maps/search/?api=1&query=Limra+Sonography+Center+Pune",
};

export const fallbackDoctors = [
  {
    name: "Dr. Humera Shah",
    qualifications: "MBBS | DMRE (MUMBAI)",
    specialization: "Consultant Radiology",
    experience: 20,
    timingStart: "11:00 AM",
    timingEnd: "2:30 PM",
    isActive: true,
    isPlaceholder: false,
  },
  {
    name: "Dr. Naved Shah",
    qualifications: "MBBS | DMRE (MUMBAI)",
    specialization: "Consultant Radiology",
    experience: 20,
    timingStart: "5:00 PM",
    timingEnd: "9:30 PM",
    isActive: true,
    isPlaceholder: false,
  },
  {
    name: "Coming Soon",
    qualifications: "",
    specialization: "Consultant Radiology",
    experience: 0,
    timingStart: "",
    timingEnd: "",
    isActive: false,
    isPlaceholder: true,
  },
];

export const fallbackServices = [
  {
    name: "Abdomen Pelvis",
    category: "General Sonography",
    description:
      "Comprehensive abdominal and pelvic sonography for routine diagnostic evaluation.",
    preparation: "Fast for 4 to 6 hours when advised. Full bladder may be required.",
    price: BigInt(1500),
    isActive: true,
  },
  {
    name: "Pelvis",
    category: "General Sonography",
    description:
      "Focused pelvic ultrasound for gynecological and urinary evaluation.",
    preparation: "Full bladder required for most pelvic scans.",
    price: BigInt(1400),
    isActive: true,
  },
  {
    name: "KUB",
    category: "General Sonography",
    description:
      "Kidney, ureter and bladder scan for urinary tract assessment.",
    preparation: "Hydration and full bladder recommended.",
    price: BigInt(1800),
    isActive: true,
  },
  {
    name: "Early Pregnancy",
    category: "Pregnancy Sonography",
    description:
      "Early pregnancy confirmation, viability and dating sonography.",
    preparation: "Full bladder may be required depending on gestation.",
    price: BigInt(1500),
    isActive: true,
  },
  {
    name: "NT Scan",
    category: "Pregnancy Sonography",
    description:
      "Nuchal translucency scan for first trimester screening and dating support.",
    preparation: "Routine hydration advised unless instructed otherwise.",
    price: BigInt(2000),
    isActive: true,
  },
  {
    name: "Anomaly Scan",
    category: "Pregnancy Sonography",
    description:
      "Detailed mid-trimester fetal anatomy assessment with structured review.",
    preparation: "No special preparation is usually required.",
    price: BigInt(3000),
    isActive: true,
  },
  {
    name: "Growth Scan",
    category: "Pregnancy Sonography",
    description:
      "Third trimester fetal growth and well-being assessment.",
    preparation: "No special preparation is usually required.",
    price: BigInt(2000),
    isActive: true,
  },
  {
    name: "Growth Doppler",
    category: "Doppler Studies",
    description:
      "Fetal and placental Doppler assessment for high-risk pregnancy follow-up.",
    preparation: "No special preparation is usually required.",
    price: BigInt(2500),
    isActive: true,
  },
  {
    name: "Thyroid Scan",
    category: "General Sonography",
    description:
      "High-resolution neck and thyroid ultrasound for nodules and swelling.",
    preparation: "No special preparation is required.",
    price: BigInt(1200),
    isActive: true,
  },
  {
    name: "Breast Scan",
    category: "General Sonography",
    description:
      "Breast ultrasound for targeted evaluation of lumps, pain or follow-up findings.",
    preparation: "No special preparation is required.",
    price: BigInt(1500),
    isActive: true,
  },
  {
    name: "Kidney Scan",
    category: "General Sonography",
    description:
      "Focused renal imaging for stones, hydronephrosis and structural review.",
    preparation: "Hydration may be advised before the scan.",
    price: BigInt(1200),
    isActive: true,
  },
  {
    name: "3D/4D Sonography",
    category: "Pregnancy Sonography",
    description:
      "Advanced pregnancy imaging for detailed fetal views when clinically appropriate.",
    preparation: "Best scheduled during the recommended gestational window.",
    price: BigInt(3500),
    isActive: true,
  },
];

export const serviceCategories = [
  "All",
  "Pregnancy Sonography",
  "General Sonography",
  "Doppler Studies",
];

export const appointmentStatuses = ["pending", "approved", "cancelled", "rescheduled"];

export function getDoctors(data) {
  return data && data.length ? data : fallbackDoctors;
}

export function getServices(data) {
  return data && data.length ? data.filter((item) => item.isActive) : fallbackServices;
}

export function formatCurrency(value) {
  const amount = typeof value === "bigint" ? Number(value) : Number(value || 0);
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatBigIntDate(value) {
  if (!value) return "Not available";
  const timestamp = typeof value === "bigint" ? Number(value) / 1000000 : Number(value);
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPrincipal(principal) {
  if (!principal || typeof principal.toString !== "function") {
    return "";
  }
  return principal.toString();
}

export function getDoctorImage(name) {
  if (name.includes("Humera")) {
    return "/assets/generated/doctor-humera.dim_300x300.png";
  }
  if (name.includes("Naved")) {
    return "/assets/generated/doctor-naved.dim_300x300.png";
  }
  return "/assets/generated/doctor-placeholder.dim_300x300.png";
}

export function getSlotsForDoctor(doctorName) {
  if (!doctorName) return [];
  if (doctorName.includes("Humera")) {
    return buildTimeSlots(11, 0, 14, 30);
  }
  if (doctorName.includes("Naved")) {
    return buildTimeSlots(17, 0, 21, 30);
  }
  return [];
}

function buildTimeSlots(startHour, startMinute, endHour, endMinute) {
  const slots = [];
  let hour = startHour;
  let minute = startMinute;

  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = String(minute).padStart(2, "0");
    slots.push(`${String(displayHour).padStart(2, "0")}:${displayMinute} ${period}`);
    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }

  return slots;
}

export function matchesAppointmentSearch({
  appointment,
  searchText,
  doctors = [],
  services = [],
}) {
  if (!searchText.trim()) {
    return true;
  }

  const query = searchText.trim().toLowerCase();
  const doctorName =
    doctors.find((doctor) => doctor.name === appointment.doctorId)?.name ||
    appointment.doctorId ||
    "";
  const serviceName =
    services.find((service) => service.name === appointment.serviceId)?.name ||
    appointment.serviceId ||
    "";

  return [
    doctorName,
    serviceName,
    appointment.requestedDate,
    appointment.requestedTimeSlot,
    String(appointment.status),
    formatPrincipal(appointment.patientId),
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}
