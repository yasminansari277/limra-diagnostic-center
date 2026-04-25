import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Int "mo:core/Int";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";

actor {
  type Doctor = {
    name : Text;
    qualifications : Text;
    experience : Nat;
    specialization : Text;
    timingStart : Text;
    timingEnd : Text;
    isActive : Bool;
    isPlaceholder : Bool;
  };

  type Service = {
    name : Text;
    category : Text;
    description : Text;
    preparation : Text;
    price : Nat;
    isActive : Bool;
  };

  type Patient = {
    id : Principal;
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    medicalHistory : Text;
  };

  type AppointmentStatus = {
    #pending;
    #approved;
    #cancelled;
    #rescheduled;
  };

  type Appointment = {
    id : Nat;
    patientId : Principal;
    doctorId : Text;
    serviceId : Text;
    requestedDate : Text;
    requestedTimeSlot : Text;
    status : AppointmentStatus;
    adminNote : Text;
    createdAt : Time.Time;
  };

  type AdminActivityLog = {
    action : Text;
    performedBy : Principal;
    timestamp : Time.Time;
  };

  type PregnancyTracker = {
    lmpDate : Time.Time;
    currentWeek : Nat;
    estimatedDueDate : Time.Time;
    weekDescription : Text;
  };

  type AdminDashboardStats = {
    totalPatients : Nat;
    todaysAppointments : Nat;
    totalRevenue : Nat;
    doctorsCount : Nat;
  };

  // UserProfile type required by the instructions
  type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
  };

  let doctors = Map.empty<Text, Doctor>();
  let services = Map.empty<Text, Service>();
  let patients = Map.empty<Principal, Patient>();
  let appointments = Map.empty<Nat, Appointment>();
  let adminActivityLog = List.empty<AdminActivityLog>();
  let pregnancyTrackers = Map.empty<Principal, PregnancyTracker>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();

  var nextAppointmentId = 1;

  include MixinAuthorization(accessControlState);

  // ─── UserProfile functions required by instructions ───────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ─── System Initialization ────────────────────────────────────────────────

  public shared ({ caller }) func initializeSystem() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can initialize the system");
    };

    let doctorList = [
      {
        name = "Dr. Humera Shah";
        qualifications = "MBBS, Radiology";
        experience = 20;
        specialization = "Radiology";
        timingStart = "11:00";
        timingEnd = "14:30";
        isActive = true;
        isPlaceholder = false;
      },
      {
        name = "Dr. Naved Shah";
        qualifications = "MBBS, Radiology";
        experience = 20;
        specialization = "Radiology";
        timingStart = "17:00";
        timingEnd = "21:30";
        isActive = true;
        isPlaceholder = false;
      },
      {
        name = "Position Open";
        qualifications = "TBD";
        experience = 0;
        specialization = "TBD";
        timingStart = "TBD";
        timingEnd = "TBD";
        isActive = false;
        isPlaceholder = true;
      },
    ];

    let servicesList = [
      {
        name = "Abdomen Pelvis";
        category = "General Sonography";
        description = "Comprehensive ultrasound scan of the abdomen and pelvic region.";
        preparation = "Fasting preferred, full bladder recommended.";
        price = 1500;
        isActive = true;
      },
      {
        name = "Pelvis";
        category = "General Sonography";
        description = "Ultrasound scan of the pelvic region.";
        preparation = "Full bladder recommended.";
        price = 1400;
        isActive = true;
      },
      {
        name = "KUB";
        category = "General Sonography";
        description = "Ultrasound scan of kidneys, ureters, and bladder.";
        preparation = "Full bladder recommended.";
        price = 1800;
        isActive = true;
      },
      {
        name = "Early Pregnancy";
        category = "Pregnancy Sonography";
        description = "Ultrasound scan for early pregnancy assessment.";
        preparation = "Full bladder recommended.";
        price = 1500;
        isActive = true;
      },
      {
        name = "NT Scan";
        category = "Pregnancy Sonography";
        description = "Nuchal translucency scan for fetal assessment.";
        preparation = "Full bladder recommended.";
        price = 2000;
        isActive = true;
      },
      {
        name = "Anomaly Scan";
        category = "Pregnancy Sonography";
        description = "Detailed anatomical survey of fetus.";
        preparation = "None";
        price = 3000;
        isActive = true;
      },
      {
        name = "Growth Scan";
        category = "Pregnancy Sonography";
        description = "Assessment of fetal growth parameters.";
        preparation = "None";
        price = 2000;
        isActive = true;
      },
      {
        name = "Growth Doppler";
        category = "Doppler Studies";
        description = "Doppler ultrasound for fetal growth assessment.";
        preparation = "None";
        price = 2500;
        isActive = true;
      },
      {
        name = "Thyroid Scan";
        category = "General Sonography";
        description = "Ultrasound scan of the thyroid gland.";
        preparation = "None";
        price = 1200;
        isActive = true;
      },
      {
        name = "Breast Scan";
        category = "General Sonography";
        description = "Ultrasound scan of breast tissue.";
        preparation = "None";
        price = 1500;
        isActive = true;
      },
      {
        name = "Kidney Scan";
        category = "General Sonography";
        description = "Ultrasound scan of kidneys.";
        preparation = "Full bladder recommended.";
        price = 1200;
        isActive = true;
      },
      {
        name = "3D/4D Sonography";
        category = "Pregnancy Sonography";
        description = "3D/4D ultrasound imaging.";
        preparation = "None";
        price = 3500;
        isActive = true;
      },
    ];

    for (doctor in doctorList.values()) {
      doctors.add(doctor.name, doctor);
    };

    for (service in servicesList.values()) {
      services.add(service.name, service);
    };
  };

  // ─── Doctor functions ─────────────────────────────────────────────────────

  // Public: anyone (including guests) can view doctors
  public query func getDoctor(name : Text) : async Doctor {
    switch (doctors.get(name)) {
      case (null) { Runtime.trap("Doctor not found") };
      case (?doctor) { doctor };
    };
  };

  // Public: anyone (including guests) can view all doctors
  public query func getAllDoctors() : async [Doctor] {
    doctors.values().toArray().sort(func(a, b) { Text.compare(a.name, b.name) });
  };

  // Admin-only: create doctor
  public shared ({ caller }) func createDoctor(doctor : Doctor) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create doctors");
    };
    doctors.add(doctor.name, doctor);
    adminActivityLog.add({
      action = "Created doctor: " # doctor.name;
      performedBy = caller;
      timestamp = Time.now();
    });
  };

  // Admin-only: update doctor
  public shared ({ caller }) func updateDoctor(name : Text, updatedDoctor : Doctor) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update doctors");
    };
    doctors.add(name, updatedDoctor);
    adminActivityLog.add({
      action = "Updated doctor: " # name;
      performedBy = caller;
      timestamp = Time.now();
    });
  };

  // ─── Service functions ────────────────────────────────────────────────────

  // Public: anyone (including guests) can view services
  public query func getService(name : Text) : async Service {
    switch (services.get(name)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) { service };
    };
  };

  // Public: anyone (including guests) can view all services
  public query func getAllServices() : async [Service] {
    services.values().toArray().sort(func(a, b) { Text.compare(a.name, b.name) });
  };

  // Admin-only: create service
  public shared ({ caller }) func createService(service : Service) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create services");
    };
    services.add(service.name, service);
    adminActivityLog.add({
      action = "Created service: " # service.name;
      performedBy = caller;
      timestamp = Time.now();
    });
  };

  // Admin-only: update service
  public shared ({ caller }) func updateService(name : Text, updatedService : Service) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update services");
    };
    services.add(name, updatedService);
    adminActivityLog.add({
      action = "Updated service: " # name;
      performedBy = caller;
      timestamp = Time.now();
    });
  };

  // ─── Patient functions ────────────────────────────────────────────────────

  // Authenticated users only: a user can only create their own patient record
  public shared ({ caller }) func createPatient(patient : Patient) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can create a patient record");
    };
    if (caller != patient.id) {
      Runtime.trap("Unauthorized: You can only create your own patient record");
    };
    patients.add(patient.id, patient);
  };

  // A patient can update their own record; admin can update any record
  public shared ({ caller }) func updatePatient(patientId : Principal, updatedPatient : Patient) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update patient records");
    };
    if (caller != patientId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only update your own patient record");
    };
    patients.add(patientId, updatedPatient);
  };

  // Admin-only: list all patients
  public query ({ caller }) func getAllPatients() : async [Patient] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all patients");
    };
    patients.values().toArray();
  };

  // A patient can view their own record; admin can view any record
  public query ({ caller }) func getPatient(patientId : Principal) : async ?Patient {
    if (caller != patientId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own patient record");
    };
    patients.get(patientId);
  };

  // ─── Appointment functions ────────────────────────────────────────────────

  // Authenticated users only: submit an appointment for themselves
  public shared ({ caller }) func submitAppointmentRequest(
    doctorId : Text,
    serviceId : Text,
    requestedDate : Text,
    requestedTimeSlot : Text,
    patientName : Text,
    patientPhone : Text,
    patientAddress : Text,
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can submit appointment requests");
    };

    let appointmentId = nextAppointmentId;
    nextAppointmentId += 1;

    let newAppointment : Appointment = {
      id = appointmentId;
      patientId = caller;
      doctorId;
      serviceId;
      requestedDate;
      requestedTimeSlot;
      status = #pending;
      adminNote = "";
      createdAt = Time.now();
    };

    appointments.add(appointmentId, newAppointment);
    appointmentId;
  };

  // Admin-only: approve an appointment (uses caller, not a passed-in principal)
  public shared ({ caller }) func approveAppointment(appointmentId : Nat, note : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can approve appointments");
    };

    switch (appointments.get(appointmentId)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) {
        let updatedAppointment = {
          appointment with
          status = #approved;
          adminNote = note;
        };
        appointments.add(appointmentId, updatedAppointment);
        adminActivityLog.add({
          action = "Approved appointment #" # appointmentId.toText();
          performedBy = caller;
          timestamp = Time.now();
        });
      };
    };
  };

  // Admin-only: cancel an appointment (uses caller, not a passed-in principal)
  public shared ({ caller }) func cancelAppointment(appointmentId : Nat, note : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can cancel appointments");
    };

    switch (appointments.get(appointmentId)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) {
        let updatedAppointment = {
          appointment with
          status = #cancelled;
          adminNote = note;
        };
        appointments.add(appointmentId, updatedAppointment);
        adminActivityLog.add({
          action = "Cancelled appointment #" # appointmentId.toText();
          performedBy = caller;
          timestamp = Time.now();
        });
      };
    };
  };

  // Admin-only: reschedule an appointment (uses caller, not a passed-in principal)
  public shared ({ caller }) func rescheduleAppointment(appointmentId : Nat, newDate : Text, newTimeSlot : Text, note : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can reschedule appointments");
    };

    switch (appointments.get(appointmentId)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) {
        let updatedAppointment = {
          appointment with
          requestedDate = newDate;
          requestedTimeSlot = newTimeSlot;
          status = #rescheduled;
          adminNote = note;
        };
        appointments.add(appointmentId, updatedAppointment);
        adminActivityLog.add({
          action = "Rescheduled appointment #" # appointmentId.toText() # " to " # newDate # " " # newTimeSlot;
          performedBy = caller;
          timestamp = Time.now();
        });
      };
    };
  };

  // A patient can only view their own appointments; admin can view any patient's appointments
  public query ({ caller }) func getPatientAppointments(patientId : Principal) : async [Appointment] {
    if (caller != patientId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own appointments");
    };
    let all = appointments.values().toArray();
    all.filter(func(a : Appointment) : Bool { a.patientId == patientId });
  };

  // Admin-only: view all appointments
  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all appointments");
    };
    appointments.values().toArray();
  };

  // Admin-only: filter appointments by status
  public query ({ caller }) func getAppointmentsByStatus(status : AppointmentStatus) : async [Appointment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can filter appointments by status");
    };
    let all = appointments.values().toArray();
    all.filter(
      func(a : Appointment) : Bool {
        switch (status, a.status) {
          case (#pending, #pending) { true };
          case (#approved, #approved) { true };
          case (#cancelled, #cancelled) { true };
          case (#rescheduled, #rescheduled) { true };
          case _ { false };
        };
      },
    );
  };

  // ─── Pregnancy Tracker ────────────────────────────────────────────────────

  // A patient can only set their own tracker; admin can set any patient's tracker
  public shared ({ caller }) func setPregnancyTracker(patientId : Principal, lmpDate : Time.Time, weekDesc : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can set pregnancy tracker");
    };
    if (caller != patientId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only set your own pregnancy tracker");
    };

    let currentTime = Time.now();
    let msPerWeek = 604800000000000;
    let currentWeek = ((currentTime - lmpDate) / msPerWeek) + 1;
    let estimatedDueDate = lmpDate + (40 * msPerWeek);

    let tracker : PregnancyTracker = {
      lmpDate;
      currentWeek = Int.abs(currentWeek);
      estimatedDueDate;
      weekDescription = weekDesc;
    };

    pregnancyTrackers.add(patientId, tracker);
  };

  // A patient can only view their own tracker; admin can view any patient's tracker
  public query ({ caller }) func getPregnancyTracker(patientId : Principal) : async ?PregnancyTracker {
    if (caller != patientId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own pregnancy tracker");
    };
    pregnancyTrackers.get(patientId);
  };

  // ─── Admin Dashboard ──────────────────────────────────────────────────────

  // Admin-only: dashboard stats
  public query ({ caller }) func getAdminDashboardStats() : async AdminDashboardStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view dashboard stats");
    };

    let totalPatients = patients.size();
    let doctorsCount = doctors.size();

    let allAppointments = appointments.values().toArray();

    // Count today's appointments (approved or pending created today)
    let nowNs = Time.now();
    let dayNs : Int = 86400000000000;
    let startOfDay = nowNs - (nowNs % dayNs);
    let todaysAppointments = allAppointments.filter(
      func(a : Appointment) : Bool {
        a.createdAt >= startOfDay and a.createdAt < startOfDay + dayNs;
      },
    ).size();

    // Total revenue: sum prices of approved appointments
    var totalRevenue = 0;
    for (appt in allAppointments.values()) {
      switch (appt.status) {
        case (#approved) {
          switch (services.get(appt.serviceId)) {
            case (?svc) { totalRevenue += svc.price };
            case (null) {};
          };
        };
        case _ {};
      };
    };

    {
      totalPatients;
      todaysAppointments;
      totalRevenue;
      doctorsCount;
    };
  };

  // Admin-only: activity log
  public query ({ caller }) func getAdminActivityLog() : async [AdminActivityLog] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view the activity log");
    };
    let all = adminActivityLog.toArray();
    // Return last 50 entries
    let size = all.size();
    if (size <= 50) {
      all;
    } else {
      all.sliceToArray(size - 50, size) : [AdminActivityLog];
    };
  };
};
