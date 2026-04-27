/**
 * Hook untuk fetch data lokasi siswa
 */
import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';

export interface StudentLocationData {
  id: number;
  studentId: number;
  schoolId: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  status: string;
  source: string;
  notes?: string;
  parentConsent: boolean;
  createdAt: string;
  student?: {
    id: number;
    name: string;
    nis: string;
    class: string;
  };
}

interface UseStudentLocationReturn {
  locations: StudentLocationData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStudentLocation(): UseStudentLocationReturn {
  const [locations, setLocations] = useState<StudentLocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const schoolId = getSchoolIdSync();

      const response = await fetch(`${API_CONFIG.BASE_URL}/student-location/latest?schoolId=${schoolId}`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
      });

      const result = await response.json();

      if (result.success) {
        setLocations(result.data || []);
      } else {
        setError(result.message || 'Gagal mengambil data');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('[useStudentLocation] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [refreshKey]);

  const refetch = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { locations, isLoading, error, refetch };
}

// Get all locations by date
export function useStudentLocationHistory(date?: string) {
  const [locations, setLocations] = useState<StudentLocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const schoolId = getSchoolIdSync();
        let url = `${API_CONFIG.BASE_URL}/student-location?schoolId=${schoolId}`;
        if (date) url += `&date=${date}`;

        const response = await fetch(url, {
          headers: {
            'X-API-Key': import.meta.env.VITE_API_KEY || '',
          },
        });

        const result = await response.json();

        if (result.success) {
          setLocations(result.data || []);
        } else {
          setError(result.message || 'Gagal mengambil data');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [date]);

  return { locations, isLoading, error };
}
