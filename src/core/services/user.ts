/**
 * User Service
 *
 * SECURITY: schoolId WAJIB ada di setiap method.
 * Tidak ada fallback. X-School-Id header via getInitialOptions().
 */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { getInitialOptions } from "../utils/http";
import { BaseResponse } from "../models/http";
import { UserCreationModel, UserDataModel } from "../models/user";
import { Profile } from "../models/profile";

function requireSchoolId(schoolId: number | null | undefined, context: string): number {
  if (!schoolId) {
    throw new Error(
      `[tenant-isolation] userService.${context}: schoolId WAJIB ada. ` +
      `Tidak boleh null/undefined. Pastikan user sudah login dengan konteks sekolah yang benar.`
    );
  }
  return schoolId;
}

export const userService = {
  getProfile: (schoolId: number) => {
    requireSchoolId(schoolId, "getProfile");
    return http.get<BaseResponse<Profile>>(
      `${API_CONFIG.baseUrlOld}${SERVICE_ENDPOINTS.user.profile}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )();
  },

  updateProfile: (data: unknown, schoolId: number) => {
    requireSchoolId(schoolId, "updateProfile");
    return http.post(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.profile}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data);
  },

  updatePhoto: (data: unknown, schoolId: number) => {
    requireSchoolId(schoolId, "updatePhoto");
    return http.post(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.photo}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data);
  },

  changePassword: (data: unknown, schoolId: number) => {
    requireSchoolId(schoolId, "changePassword");
    return http.post(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.changePassword}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data);
  },

  getUserDetail: (id: number, schoolId: number) => {
    requireSchoolId(schoolId, "getUserDetail");
    return http.get<BaseResponse<UserDataModel>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.user}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )({ path: String(id) });
  },

  getAdmin: (schoolId: number) => {
    requireSchoolId(schoolId, "getAdmin");
    return http.get<BaseResponse<UserDataModel[]>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.admin}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )();
  },

  updateUser: (userId: number, req: UserCreationModel, schoolId: number) => {
    requireSchoolId(schoolId, "updateUser");
    return http.put<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.user}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(req, { path: String(userId) });
  },

  updateTeacher: (userId: number, req: UserCreationModel, schoolId: number) => {
    requireSchoolId(schoolId, "updateTeacher");
    return http.put<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.update}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(req, { path: String(userId) });
  },

  getParents: (schoolId: number) => {
    requireSchoolId(schoolId, "getParents");
    return http.get<BaseResponse<UserDataModel[]>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.users.parents,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )();
  },
};
