/**
 * Hook untuk preset sekolah (TTD, kop surat, dll)
 * Disimpan per schoolId di localStorage
 */
import { useState, useEffect, useCallback } from 'react';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';

export interface SchoolPreset {
  // Kop Surat
  kopSuratUrl?: string;

  // Kepala Sekolah
  ttdKepalaSekolah?: string;
  nipKepalaSekolah?: string;
  ttdImageUrl?: string;

  // Kepala Tata Usaha
  ttdTataUsaha?: string;
  nipTataUsaha?: string;
  ttdTuImageUrl?: string;

  // Format Nomor Surat Default
  defaultNomorFormat?: string;

  // Meta
  updatedAt?: string;
}

const STORAGE_KEY = 'school_preset';

export function useSchoolPreset() {
  const [preset, setPreset] = useState<SchoolPreset>({});
  const [loading, setLoading] = useState(true);
  const schoolId = getSchoolIdSync();

  // Load preset dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${schoolId}`);
      if (stored) {
        setPreset(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load school preset:', err);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  // Save preset ke localStorage
  const savePreset = useCallback((newPreset: Partial<SchoolPreset>) => {
    const updated = {
      ...preset,
      ...newPreset,
      updatedAt: new Date().toISOString(),
    };
    setPreset(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY}_${schoolId}`, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save school preset:', err);
    }
  }, [preset, schoolId]);

  // Quick save TTD
  const saveTTD = useCallback((
    role: 'kepala' | 'tu',
    data: { nama: string; nip?: string; ttdImageUrl?: string }
  ) => {
    if (role === 'kepala') {
      savePreset({
        ttdKepalaSekolah: data.nama,
        nipKepalaSekolah: data.nip,
        ttdImageUrl: data.ttdImageUrl,
      });
    } else {
      savePreset({
        ttdTataUsaha: data.nama,
        nipTataUsaha: data.nip,
        ttdTuImageUrl: data.ttdImageUrl,
      });
    }
  }, [savePreset]);

  // Quick save Kop Surat
  const saveKopSurat = useCallback((url: string) => {
    savePreset({ kopSuratUrl: url });
  }, [savePreset]);

  // Apply preset ke permohonan
  const applyToPermohonan = useCallback(() => {
    return {
      kopSuratUrl: preset.kopSuratUrl,
      ttdKepalaSekolah: preset.ttdKepalaSekolah,
      nipKepalaSekolah: preset.nipKepalaSekolah,
      ttdTataUsaha: preset.ttdTataUsaha,
      nipTataUsaha: preset.nipTataUsaha,
    };
  }, [preset]);

  return {
    preset,
    loading,
    savePreset,
    saveTTD,
    saveKopSurat,
    applyToPermohonan,
  };
}
