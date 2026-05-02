import { getToken } from "@/features/auth/utils";
import { APP_CONFIG } from "../configs/app";

/**
 * Reads the active schoolId from localStorage user object.
 * This is the SINGLE SOURCE OF TRUTH for schoolId on the client.
 * Returns null if not found — caller MUST handle null explicitly.
 */
function getSchoolIdFromStorage(): string | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.sekolahId ?? user?.schoolId ?? user?.id ?? null;
  } catch {
    return null;
  }
}

export const getInitialOptions = () => {
  const token = getToken();
  const schoolId = getSchoolIdFromStorage();

  if (!schoolId) {
    console.warn(
      "[tenant-isolation] getInitialOptions: no schoolId found in localStorage user object. " +
      "Requests will be rejected by backend enforceTenant middleware."
    );
  }

  return {
    bearerToken: token,
    credentials: "include",
    headers: {
      ...(schoolId ? { "X-School-Id": String(schoolId) } : {}),
    },
  };
};

export const getStaticFile = (path: string, context?: string) => {
  // console.log("ada", path);
  if (path?.includes("static")) {
    return `${APP_CONFIG.staticUrl}/${path}`;
  }

  const oldStatic = "https://hris.sanivokasi.com/storage";

  if (path && context) {
    switch (context) {
      case "hadir":
        return `${oldStatic}/dokument/hadir/${path}`;
      case "cuti":
        return `${oldStatic}/cuti/${path}`;
      case "lembur":
        return `${oldStatic}/lembur/${path}`;
      case "photo":
        return `${oldStatic}/images/${path}`;
    }
  }

  if (!path.includes("base64")) {
    return `data:image/jpeg;base64,${path}`; // Menampilkan gambar base64
  }

  if (path.includes("base64")) {
    return path;
  }

  return "";
};
