/**
 * SLiMS Integration Service
 *
 * SECURITY: schoolId WAJIB ada. SLiMS adalah sistem eksternal per-sekolah.
 * baseUrl berbeda per sekolah (karena tiap sekolah punya instance SLiMS sendiri),
 * tetapi schoolId tetap dikirim di body untuk validasi di sisi backend proxy.
 * Tidak ada fallback. X-School-Id header via getInitialOptions().
 */
import { SERVICE_ENDPOINTS } from "@/core/configs/app";
import { getInitialOptions } from "../utils/http";
import { SlimsTodayVisitor, SlimsVisitorStats } from "../models/slims";

function requireSchoolId(schoolId: number | null | undefined, context: string): number {
  if (!schoolId) {
    throw new Error(
      `[tenant-isolation] slimsService.${context}: schoolId WAJIB ada. ` +
      `Tidak boleh null/undefined. Pastikan user sudah login dengan konteks sekolah yang benar.`
    );
  }
  return schoolId;
}

export const slimsService = {
  async getVisitorStats(
    baseUrl: string,
    start: string,
    end: string,
    schoolId: number,
  ): Promise<SlimsVisitorStats> {
    requireSchoolId(schoolId, "getVisitorStats");

    const opts = getInitialOptions();
    const response = await fetch(baseUrl + SERVICE_ENDPOINTS.library.vistor, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers as Record<string, string>),
        Authorization: opts.bearerToken ? `Bearer ${opts.bearerToken}` : "",
      },
      body: JSON.stringify({
        start_date: start,
        end_date: end,
        sekolahId: schoolId, // validated by backend proxy
      }),
    });

    if (!response.ok) {
      throw new Error("Gagal melakukan fetch data dari SLiMS.");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error("Gagal mengambil statistik pengunjung dari SLiMS.");
    }

    return result.data as SlimsVisitorStats;
  },

  async getTodayVisitors(baseUrl: string, schoolId: number): Promise<SlimsTodayVisitor> {
    requireSchoolId(schoolId, "getTodayVisitors");

    const opts = getInitialOptions();
    const response = await fetch(baseUrl + SERVICE_ENDPOINTS.library.vistor, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(opts.headers as Record<string, string>),
        Authorization: opts.bearerToken ? `Bearer ${opts.bearerToken}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data visitor hari ini dari SLiMS.");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error("Response dari SLiMS tidak sukses.");
    }

    return result.data as SlimsTodayVisitor;
  },
};
