import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ─── Doctors ─────────────────────────────────────────────────────────────────

export function useGetAllDoctors() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDoctors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateDoctor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, updatedDoctor }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateDoctor(name, updatedDoctor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

// ─── Services ─────────────────────────────────────────────────────────────────

export function useGetAllServices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

// ─── Admin Check ──────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["isCallerAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export function useGetPatientAppointments() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["patientAppointments", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getPatientAppointments(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetAllAppointments() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["allAppointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSubmitAppointmentRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitAppointmentRequest(
        params.doctorId,
        params.serviceId,
        params.requestedDate,
        params.requestedTimeSlot,
        params.patientName,
        params.patientPhone,
        params.patientAddress,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
    },
  });
}

export function useApproveAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, note }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.approveAppointment(appointmentId, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useCancelAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, note }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.cancelAppointment(appointmentId, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

export function useRescheduleAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, newDate, newTimeSlot, note }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.rescheduleAppointment(
        appointmentId,
        newDate,
        newTimeSlot,
        note,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["activityLog"] });
    },
  });
}

// ─── Patients ─────────────────────────────────────────────────────────────────

export function useGetAllPatients() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPatients();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// ─── Admin Dashboard Stats ────────────────────────────────────────────────────

export function useGetAdminDashboardStats() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAdminDashboardStats();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export function useGetAdminActivityLog() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["activityLog"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminActivityLog();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// ─── Pregnancy Tracker ────────────────────────────────────────────────────────

export function useGetPregnancyTracker() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["pregnancyTracker", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getPregnancyTracker(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSetPregnancyTracker() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lmpDate, weekDesc }) => {
      if (!actor || !identity) throw new Error("Actor not available");
      return actor.setPregnancyTracker(
        identity.getPrincipal(),
        lmpDate,
        weekDesc,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pregnancyTracker"] });
    },
  });
}

// ─── Initialize System ────────────────────────────────────────────────────────

export function useInitializeSystem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.initializeSystem();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
