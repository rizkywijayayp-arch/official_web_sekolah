import { CourseCreationModel } from "@/core/models/course";
import { scheduleService } from "@/core/services";
import { useProfile } from "@/features/profile";
import { useMutation } from "@tanstack/react-query";

export const useScheduleCreation = () => {
  const profile = useProfile();
  const schoolId = profile?.user?.sekolahId ?? profile?.sekolah?.id;

  const createMutation = useMutation({
    mutationFn: (vars: CourseCreationModel) => scheduleService.create(vars, schoolId),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: CourseCreationModel }) =>
      scheduleService.update(vars.id, vars.payload, schoolId),
  });

  const deleteMutation = useMutation({
    mutationFn: (vars: { id: number }) => scheduleService.delete(vars.id, schoolId),
  });

  const create = (form: CourseCreationModel) =>
    createMutation.mutateAsync(form);

  const update = (id: number, payload: CourseCreationModel) =>
    updateMutation.mutateAsync({ id, payload });

  const remove = (id: number) => deleteMutation.mutateAsync({ id });

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    isLoading,
    create,
    update,
    delete: remove,
  };
};
