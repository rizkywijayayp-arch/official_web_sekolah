/**
 * Attendance Service
 *
 * SECURITY: Semua method memerlukan schoolId.
 * Tidak ada fallback — jika schoolId null, operasi ditolak.
 * X-School-Id header disisipkan via getInitialOptions().
 */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { attendanceCreationModel } from "../models";
import { getInitialOptions } from "../utils/http";

/**
 * Throws jika schoolId null — mencegah data leakage antar tenant.
 */
function requireSchoolId(schoolId: number | null | undefined, context: string): number {
  if (!schoolId) {
    throw new Error(
      `[tenant-isolation] attendanceService.${context}: schoolId WAJIB ada. ` +
      `Tidak boleh null/undefined. Pastikan user sudah login dengan konteks sekolah yang benar.`
    );
  }
  return schoolId;
}

export const attendanceService = {
  create: (data: attendanceCreationModel, schoolId: number) => {
    requireSchoolId(schoolId, "create");
    return http.post<{ message: string; sekolahId: number }, attendanceCreationModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.attedance.createAttedance,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data);
  },

  remove: (data: attendanceCreationModel, schoolId: number) => {
    requireSchoolId(schoolId, "remove");
    console.log("data id", data);
    return http.delete<{ message: string; sekolahId: number }, attendanceCreationModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.attedance.createAttedanceRemove + `/${data?.userId}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data);
  },

  createGo: (data: attendanceCreationModel, schoolId: number) => {
    requireSchoolId(schoolId, "createGo");
    return http.post<{ message: string; sekolahId: number }, attendanceCreationModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.attedance.createAttedanceGo,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )(data);
  },
};
