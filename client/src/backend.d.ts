import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PregnancyTracker {
    estimatedDueDate: Time;
    weekDescription: string;
    currentWeek: bigint;
    lmpDate: Time;
}
export type Time = bigint;
export interface Service {
    name: string;
    description: string;
    isActive: boolean;
    category: string;
    preparation: string;
    price: bigint;
}
export interface Doctor {
    name: string;
    timingEnd: string;
    qualifications: string;
    isActive: boolean;
    experience: bigint;
    specialization: string;
    timingStart: string;
    isPlaceholder: boolean;
}
export interface Appointment {
    id: bigint;
    status: AppointmentStatus;
    doctorId: string;
    requestedTimeSlot: string;
    patientId: Principal;
    createdAt: Time;
    adminNote: string;
    requestedDate: string;
    serviceId: string;
}
export interface AdminDashboardStats {
    totalPatients: bigint;
    todaysAppointments: bigint;
    doctorsCount: bigint;
    totalRevenue: bigint;
}
export interface AdminActivityLog {
    action: string;
    performedBy: Principal;
    timestamp: Time;
}
export interface Patient {
    id: Principal;
    name: string;
    email: string;
    medicalHistory: string;
    address: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    rescheduled = "rescheduled",
    approved = "approved"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveAppointment(appointmentId: bigint, note: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelAppointment(appointmentId: bigint, note: string): Promise<void>;
    createDoctor(doctor: Doctor): Promise<void>;
    createPatient(patient: Patient): Promise<void>;
    createService(service: Service): Promise<void>;
    getAdminActivityLog(): Promise<Array<AdminActivityLog>>;
    getAdminDashboardStats(): Promise<AdminDashboardStats>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllDoctors(): Promise<Array<Doctor>>;
    getAllPatients(): Promise<Array<Patient>>;
    getAllServices(): Promise<Array<Service>>;
    getAppointmentsByStatus(status: AppointmentStatus): Promise<Array<Appointment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDoctor(name: string): Promise<Doctor>;
    getPatient(patientId: Principal): Promise<Patient | null>;
    getPatientAppointments(patientId: Principal): Promise<Array<Appointment>>;
    getPregnancyTracker(patientId: Principal): Promise<PregnancyTracker | null>;
    getService(name: string): Promise<Service>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeSystem(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    rescheduleAppointment(appointmentId: bigint, newDate: string, newTimeSlot: string, note: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPregnancyTracker(patientId: Principal, lmpDate: Time, weekDesc: string): Promise<void>;
    submitAppointmentRequest(doctorId: string, serviceId: string, requestedDate: string, requestedTimeSlot: string, patientName: string, patientPhone: string, patientAddress: string): Promise<bigint>;
    updateDoctor(name: string, updatedDoctor: Doctor): Promise<void>;
    updatePatient(patientId: Principal, updatedPatient: Patient): Promise<void>;
    updateService(name: string, updatedService: Service): Promise<void>;
}
