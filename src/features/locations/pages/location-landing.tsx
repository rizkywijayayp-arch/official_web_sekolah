import { APP_CONFIG } from "@/core/configs";
import {
    lang
} from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { StudentLocationMap } from "../containers/student-location-map";

export const LocationLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`Lokasi Siswa | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: "Lokasi Siswa", url: "/admin/lokasi-siswa" }]}
      title="Lokasi Siswa"
      description="Pantau lokasi siswa secara real-time dengan peta interaktif"
    >
      <StudentLocationMap />
    </DashboardPageLayout>
  );
};