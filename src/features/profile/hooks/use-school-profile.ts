import { API_CONFIG } from "@/config/api";

/**
 * Hook to get school profile/theme data from API
 * Used by website pages to display school-specific content
 */
export const useSchoolProfile = () => {
  const schoolId = getSchoolIdSync();

  const fetchSchoolProfile = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/profileSekolah?schoolId=${schoolId}`);
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      console.error('Gagal load profile sekolah:', err);
      return null;
    }
  };

  return {
    schoolId,
    fetchSchoolProfile,
  };
};

/**
 * Get school profile data (non-hook, for use in utils/initialization)
 */
export const getSchoolProfile = async (schoolId?: string | number) => {
  const id = schoolId || getSchoolIdSync();
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/profileSekolah?schoolId=${id}`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (err) {
    console.error('Gagal load profile sekolah:', err);
    return null;
  }
};

/**
 * Default school name based on type
 */
export const SCHOOL_TYPE_LABELS = {
  smk: 'Sekolah Menengah Kejuruan Negeri',
  sma: 'Sekolah Menengah Atas Negeri',
  smp: 'Sekolah Menengah Pertama Negeri',
  smkn: 'Sekolah Menengah Kejuruan Negeri',
  sman: 'Sekolah Menengah Atas Negeri',
  smpn: 'Sekolah Menengah Pertama Negeri',
};

/**
 * Get school type label from school name
 */
export const getSchoolTypeLabel = (schoolName: string): string => {
  const upperName = schoolName.toUpperCase();
  if (upperName.includes('SMK') || upperName.includes('SEKOLAH MENENGAH KEJURUAN')) {
    return SCHOOL_TYPE_LABELS.smk;
  }
  if (upperName.includes('SMA') || upperName.includes('SEKOLAH MENENGAH ATAS')) {
    return SCHOOL_TYPE_LABELS.sma;
  }
  if (upperName.includes('SMP') || upperName.includes('SEKOLAH MENENGAH PERTAMA')) {
    return SCHOOL_TYPE_LABELS.smp;
  }
  return 'Sekolah Negeri';
};
