import { userService } from "@/core/services/user";
import { useAuth } from "@/features/auth/hooks";
import { useProfile } from "@/features/profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface MutationVars {
  type: "change-password" | "update-profile" | "update-photo";
  data?: unknown;
}

export const useProfile = () => {
  const auth = useAuth();
  const profile = useProfile();
  const authRef = useRef(auth);
  authRef.current = auth;
  const schoolId = profile?.user?.sekolahId ?? profile?.sekolah?.id;

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(schoolId),
    enabled: auth.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 menit
    refetchOnWindowFocus: false, 
  });

  const mutation = useMutation({
    mutationFn: (vars: MutationVars) => {
      switch (vars.type) {
        case "change-password":
          return userService.changePassword(vars.data, schoolId);
        case "update-profile":
          return userService.updateProfile(vars.data, schoolId);
        case "update-photo":
          return userService.updatePhoto(vars.data, {
            contentType: "form-data",
          });
        default:
          throw new Error("invalid mutation type");
      }
    },
  });

  useEffect(() => {
    if (
      query.isError &&
      query.error?.message?.toLowerCase?.()?.includes?.("unauthorized")
    ) {
      authRef.current?.logout();
    }
  }, [query.isError, query.error?.message]);

  const data = query.data?.data;

  const updateProfile = (data: unknown) =>
    mutation.mutateAsync({ type: "update-profile", data });
  const changePassword = (data: unknown) =>
    mutation.mutateAsync({ type: "change-password", data });

  const updatePhoto = (data: unknown) => {
    const formData = new FormData();
    if (data) formData.append("file", data as Blob);
    return mutation.mutateAsync({ type: "update-photo", data: formData });
  };

  return {
    query,
    mutation,
    updateProfile,
    changePassword,
    updatePhoto,
    ...data,
  };
};
