/**
 * School Settings Page
 * Admin page for managing school profile, logo, favicon, and other settings
 */
import { APP_CONFIG } from '@/core/configs';
import { DashboardPageLayout } from '@/features/_global';
import { SchoolInformation } from '@/features/schools';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';
import { simpleEncode } from '@/core/libs';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SchoolSettings = () => {
  const schoolId = getSchoolIdSync();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to school detail if no schoolId
    if (!schoolId) {
      navigate('/schools');
    }
  }, [schoolId, navigate]);

  if (!schoolId) {
    return null;
  }

  // Encode school ID for the route
  const encodedId = simpleEncode(String(schoolId));

  return (
    <DashboardPageLayout
      siteTitle={`Pengaturan Sekolah | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        { label: 'Pengaturan Sekolah', url: '/schools/settings' },
      ]}
      title="Pengaturan Sekolah"
      description="Kelola profil, logo, favicon, dan pengaturan sekolah"
    >
      <SchoolInformation id={schoolId} />
    </DashboardPageLayout>
  );
};
