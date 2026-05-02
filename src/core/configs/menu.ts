import { VokadashProps } from "@/features/_global";
import { lang } from "../libs";

export const MENU_STAFF: VokadashProps["menus"] = [
  {
    title: lang.text('dashboard'),
    url: "/dashboard",
    icon: "Activity",
    status: "demo",
    disabled: "false",
  },
  {
    title: lang.text('historyAttendanceMapel'),
    url: "/attendance/history",
    icon: "Clock",
    // status: "demo",
    disabled: "false",
  },
  {
    title: lang.text('task'),
    url: "/homework",
    icon: "ClipboardList",
    // status: "demo",
    disabled: "false",
  },
  {
    title: lang.text('graduation'),
    url: "/pengumuman-kelulusan",
    icon: "GraduationCap",
    // status: "demo",
    disabled: "false",
  },
  {
    title: lang.text('task'),
    url: "/ruang-apresiasi",
    icon: "Medal",
    // status: "demo",
    disabled: "false",
  },
  {
    title: lang.text('vote'),
    url: "/vote",
    icon: "Vote",
    // status: "demo",
    disabled: "false",
  },
  {
    title: lang.text('ppid'),
    url: "/ppid",
    icon: "Bullhorn",
    // status: "demo",
    disabled: "false",
  },
  {
    title: "Layanan Persuratan",
    url: "/layanan-persuratan",
    icon: "FileText",
    disabled: "false",
  },
  {
    title: "Kelola Permohonan Surat",
    url: "/admin/permohonan",
    icon: "FileCheck",
    disabled: "false",
  },
  {
    title: "Manajemen Jenis Layanan",
    url: "/admin/permohonan/service-types",
    icon: "Settings",
    disabled: "false",
  },
  {
    title: "Pengaturan Sekolah",
    url: "/schools/settings",
    icon: "Settings",
    disabled: "false",
  },
  {
    title: "Data Kelulusan",
    url: "/admin/kelulusan",
    icon: "Award",
    disabled: "false",
  },
  {
    title: "Lokasi Siswa",
    url: "/admin/lokasi-siswa",
    icon: "MapPin",
    disabled: "false",
  },
  {
    title: lang.text('summarizeByX'),
    url: "/summarize",
    icon: "Cog",
    status: "demo",
    disabled: "false",
  },
  {
    title: lang.text('service'),
    url: "/service",
    icon: "Handshake",
    status: "demo",
    disabled: "false",
  },
  // {
  //   title: lang.text('material'),
  //   url: "/material",
  //   icon: "Book",
  // },
];

export const USER_MENU_STAFF: VokadashProps["usermenus"] = [
  {
    title: lang.text('ProfileInfo'),
    url: "/profile/edit",
  },
  {
    title: lang.text("logout"),
    url: "/logout",
  },
];

export const MENU_CONFIG = {
  staff: MENU_STAFF,
};

export const USERMENU_CONFIG = {
  staff: USER_MENU_STAFF,
};

