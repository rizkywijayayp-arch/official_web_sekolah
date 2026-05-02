/**
 * Biodata Service
 *
 * SECURITY: schoolId WAJIB ada di setiap method.
 * Tidak ada fallback — data leakage dicegah via requireSchoolId().
 * X-School-Id header disisipkan via getInitialOptions().
 */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { BiodataSiswa } from "../models/biodata";
import { BiodataGuru } from "../models/biodata-guru";

function requireSchoolId(schoolId: number | null | undefined, context: string): number {
  if (!schoolId) {
    throw new Error(
      `[tenant-isolation] biodataService.${context}: schoolId WAJIB ada. ` +
      `Tidak boleh null/undefined. Pastikan user sudah login dengan konteks sekolah yang benar.`
    );
  }
  return schoolId;
}

export const biodataService = {
  siswa: (schoolId: number) => {
    requireSchoolId(schoolId, "siswa");
    return http.get<BaseResponse<BiodataSiswa[]>>(
      API_CONFIG.baseUrlOld + SERVICE_ENDPOINTS.biodata.siswa,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )();
  },

  checkAllAttendances: (schoolId: number) => {
    requireSchoolId(schoolId, "checkAllAttendances");
    return http.get<BaseResponse<BiodataSiswa[]>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.biodata.allAttedance,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )();
  },

  siswaById: (id: number, schoolId: number) => {
    requireSchoolId(schoolId, "siswaById");
    return http.get<BaseResponse<BiodataSiswa>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.biodata.siswa,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )({ path: String(id) });
  },

  guru: (schoolId: number) => {
    requireSchoolId(schoolId, "guru");
    return http.get<BaseResponse<BiodataGuru[]>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.biodata.guru}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )();
  },

  checkAttendance: (id: number | string, schoolId: number) => {
    requireSchoolId(schoolId, "checkAttendance");
    return http.get<BaseResponse<BiodataSiswa>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.biodata.attedance}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )({ path: String(id) });
  },

  guruById: (id: number, schoolId: number) => {
    requireSchoolId(schoolId, "guruById");
    return http.get<BaseResponse<BiodataGuru>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.teacher.detail}`,
      { ...getInitialOptions(), params: { sekolahId: schoolId } },
    )({ path: String(id) });
  },
};
