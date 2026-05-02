/**
 * Schedule Service
 *
 * SECURITY: schoolId WAJIB ada di setiap method CRUD.
 * Tidak ada fallback. X-School-Id header via getInitialOptions().
 */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { SchoolDataModel } from "../models/schools";
import { getInitialOptions } from "../utils/http";

function requireSchoolId(schoolId: number | null | undefined, context: string): number {
  if (!schoolId) {
    throw new Error(
      `[tenant-isolation] scheduleService.${context}: schoolId WAJIB ada. ` +
      `Tidak boleh null/undefined. Pastikan user sudah login dengan konteks sekolah yang benar.`
    );
  }
  return schoolId;
}

export const scheduleService = {
  all: (schoolId: number) => {
    requireSchoolId(schoolId, "all");
    return http.get<BaseResponse<SchoolDataModel[]>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.schedules,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )();
  },

  get: (id: number, schoolId: number) => {
    requireSchoolId(schoolId, "get");
    return http.get<BaseResponse<SchoolDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.schedules,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )({ path: String(id) });
  },

  create: (data: unknown, schoolId: number) => {
    requireSchoolId(schoolId, "create");
    return http.post<BaseResponse, unknown>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.create,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data);
  },

  delete: (id: number, schoolId: number) => {
    requireSchoolId(schoolId, "delete");
    return http.delete<BaseResponse<unknown>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.delete,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )({ path: String(id) });
  },

  update: (id: number, data: unknown, schoolId: number) => {
    requireSchoolId(schoolId, "update");
    return http.put<{ message: string; sekolahId: number }, unknown>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.update,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data, { path: String(id) });
  },
};
