import { API_CONFIG } from "@/config/api";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { useEffect, useState } from "react";

interface MenuSettings {
  isOpen: boolean;
  openedAt: string | null;
  closedAt: string | null;
  messageLock: string | null;
}

interface UseMenuSettingsResult {
  settings: MenuSettings | null;
  isLocked: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useMenuSettings = (menuKey: string): UseMenuSettingsResult => {
  const schoolId = getSchoolIdSync();
  const [settings, setSettings] = useState<MenuSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${API_CONFIG.BASE_URL}/menu-settings/${menuKey}?schoolId=${schoolId}`
        );

        if (!res.ok) {
          // If endpoint doesn't exist, try ppdb endpoint as fallback
          const fallbackRes = await fetch(
            `${API_CONFIG.BASE_URL}/${menuKey}?schoolId=${schoolId}`
          );
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            // Transform ppdb data to MenuSettings format
            if (data.data && data.data[0]) {
              const config = data.data[0];
              const now = new Date();
              const startDate = config.startDate ? new Date(config.startDate) : null;
              const endDate = config.endDate ? new Date(config.endDate) : null;

              setSettings({
                isOpen: startDate ? now >= startDate && (endDate ? now <= endDate : true) : false,
                openedAt: config.startDate || null,
                closedAt: config.endDate || null,
                messageLock: null,
              });
            } else {
              setSettings(null);
            }
          }
          return;
        }

        const data = await res.json();
        if (data.success && data.data) {
          setSettings(data.data);
        } else {
          setSettings(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat pengaturan");
      } finally {
        setIsLoading(false);
      }
    };

    if (schoolId && menuKey) {
      fetchSettings();
    }
  }, [menuKey, schoolId]);

  const isLocked = !settings?.isOpen || (
    settings.openedAt
      ? new Date() < new Date(settings.openedAt)
      : true
  );

  return { settings, isLocked, isLoading, error };
};

export default useMenuSettings;
