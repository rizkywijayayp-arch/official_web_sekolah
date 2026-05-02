/**
 * Course Service
 *
 * SECURITY: schoolId WAJIB ada di setiap method (termasuk path-based get/delete/update).
 * schoolId di-param juga, karena backend perlu tahu tenant context secara eksplisit.
 * Tidak ada fallback. X-School-Id header via getInitialOptions().
 */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { CourseCreationModel, CourseDataModel } from "../models/course";

function requireSchoolId(schoolId: number | null | undefined, context: string): number {
  if (!schoolId) {
    throw new Error(
      `[tenant-isolation] courseService.${context}: schoolId WAJIB ada. ` +
      `Tidak boleh null/undefined. Pastikan user sudah login dengan konteks sekolah yang benar.`
    );
  }
  return schoolId;
}

export const courseService = {
  all: (schoolId: number) => {
    requireSchoolId(schoolId, "all");
    return http.get<BaseResponse<CourseDataModel[]>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )();
  },

  get: (id: number, schoolId: number) => {
    requireSchoolId(schoolId, "get");
    return http.get<CourseDataModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )({ path: String(id) });
  },

  delete: (id: number, schoolId: number) => {
    requireSchoolId(schoolId, "delete");
    return http.delete<BaseResponse<CourseDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )({ path: String(id) });
  },

  create: (data: CourseCreationModel, schoolId: number) => {
    requireSchoolId(schoolId, "create");
    return http.post<BaseResponse, CourseCreationModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data);
  },

  update: (id: number, data: CourseCreationModel, schoolId: number) => {
    requireSchoolId(schoolId, "update");
    return http.put<{ message: string; sekolahId: number }, CourseCreationModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.school.courses,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data, { path: String(id) });
  },
};
