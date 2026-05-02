import { attendanceCreationModel } from "@/core/models";
import { attendanceService } from "@/core/services/attedance";
import { useProfile } from "@/features/profile";
import { useMutation } from "@tanstack/react-query";

export const useAttendanceCreation = () => {
  const profile = useProfile();
  const schoolId = profile?.user?.sekolahId ?? profile?.sekolah?.id;

  const createMutation = useMutation({
    mutationFn: (vars: attendanceCreationModel) => attendanceService.create(vars, schoolId)
  });
  const createMutationRemove = useMutation({
    mutationFn: (vars: attendanceCreationModel) => attendanceService.remove(vars, schoolId)
  });
  const createMutationGo = useMutation({
    mutationFn: (vars: attendanceCreationModel) => attendanceService.createGo(vars, schoolId)
  });

  const create = (form: attendanceCreationModel) =>
    createMutation.mutateAsync(form);

  const remove = (form: attendanceCreationModel) =>
    createMutationRemove.mutateAsync(form);

  const createGo = (form: attendanceCreationModel) =>
    createMutationGo.mutateAsync(form);

  const isLoading =
    createMutation.isPending
  const isLoadingGo =
    createMutationGo.isPending

  return {
    isLoading,
    isLoadingGo,
    create,
    createGo,
    remove
  };
};
