/**
 * Form Schema - Definisi field untuk setiap jenis surat
 */

// Field types
export type FieldType = 'text' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'number';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // untuk select
  validation?: string; // regex pattern
  validationMessage?: string;
}

// Schema untuk setiap jenis surat
export const FORM_SCHEMAS: Record<string, { title: string; description: string; fields: FormField[] }> = {

  // === SURAT SISWA ===
  keterangan_aktif: {
    title: 'Surat Keterangan Aktif Sekolah',
    description: 'Surat keterangan siswa masih aktif bersekolah',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama lengkap', required: true },
      { name: 'nisn', label: 'NISN', type: 'text', placeholder: '10 digit NISN', required: true },
      { name: 'nis', label: 'NIS', type: 'text', placeholder: 'Nomor Induk Sekolah', required: true },
      { name: 'kelas', label: 'Kelas', type: 'text', placeholder: 'Contoh: XII IPA 1', required: true },
      { name: 'tahunAjaran', label: 'Tahun Ajaran', type: 'select', options: ['2024/2025', '2025/2026', '2026/2027'], required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
      { name: 'keperluan', label: 'Keperluan', type: 'textarea', placeholder: 'Untuk keperluan apa surat ini dimintakan?', required: true },
    ]
  },

  keterangan_lulus: {
    title: 'Surat Keterangan Lulus',
    description: 'Surat keterangan telah menyelesaikan pendidikan',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama lengkap', required: true },
      { name: 'nisn', label: 'NISN', type: 'text', placeholder: '10 digit NISN', required: true },
      { name: 'nis', label: 'NIS', type: 'text', placeholder: 'Nomor Induk Sekolah', required: true },
      { name: 'jenjang', label: 'Jenjang / Tingkat Terakhir', type: 'select', options: ['SD / MI Kelas 6', 'SMP / MTs Kelas 9', 'SMA / MA Kelas 12', 'SMK / MAK Kelas 12'], required: true },
      { name: 'jurusan', label: 'Jurusan / Paket Keahlian', type: 'text', placeholder: 'Contoh: Teknik Komputer dan Jaringan (jika SMK)', required: false },
      { name: 'kelas', label: 'Kelas Terakhir', type: 'text', placeholder: 'Contoh: XII TKJ 1', required: true },
      { name: 'tahunLulus', label: 'Tahun Lulus', type: 'select', options: ['2024', '2025', '2026'], required: true },
      { name: 'noIjazah', label: 'Nomor Ijazah (jika ada)', type: 'text', placeholder: 'Contoh: DN-2025-001234', required: false },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  keterangan_pindah: {
    title: 'Surat Keterangan Pindah',
    description: 'Surat keterangan perpindahan siswa',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama lengkap', required: true },
      { name: 'nisn', label: 'NISN', type: 'text', placeholder: '10 digit NISN', required: true },
      { name: 'kelas', label: 'Kelas', type: 'text', placeholder: 'Contoh: XI IPA 1', required: true },
      { name: 'alasanPindah', label: 'Alasan Pindah', type: 'textarea', placeholder: 'Alasan perpindahan', required: true },
      { name: 'sekolahTujuan', label: 'Sekolah Tujuan', type: 'text', placeholder: 'Nama sekolah yang dituju', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  lomba: {
    title: 'Surat Keterangan Lomba (Team)',
    description: 'Surat untuk tim lomba/pertandingan',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama pembimbing/ guru', required: true },
      { name: 'nip', label: 'NIP', type: 'text', placeholder: 'Nomor Induk Pegawai', required: true },
      { name: 'jabatan', label: 'Jabatan', type: 'text', placeholder: 'Guru/Pembimbing', required: true },
      { name: 'namaLomba', label: 'Nama Lomba', type: 'text', placeholder: 'Nama lomba yang diikuti', required: true },
      { name: 'penyelenggara', label: 'Penyelenggara', type: 'text', placeholder: 'Nama instansi penyelenggara', required: true },
      { name: 'tanggalLomba', label: 'Tanggal Lomba', type: 'date', required: true },
      { name: 'tempatLomba', label: 'Tempat Lomba', type: 'text', placeholder: 'Lokasi lomba', required: true },
      { name: 'anggotaTim', label: 'Anggota Tim', type: 'textarea', placeholder: 'Nama anggota tim (pisahkan dengan koma)', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  dispensasi: {
    title: 'Surat Dispensasi Siswa',
    description: 'Permohonan dispensasi kegiatan sekolah',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap siswa', required: true },
      { name: 'nis', label: 'NIS', type: 'text', placeholder: 'Nomor Induk Sekolah', required: true },
      { name: 'kelas', label: 'Kelas', type: 'text', placeholder: 'Contoh: XII IPA 1', required: true },
      { name: 'namaOrtu', label: 'Nama Orang Tua', type: 'text', placeholder: 'Nama orang tua/wali', required: true },
      { name: 'kegiatan', label: 'Nama Kegiatan', type: 'text', placeholder: 'Nama kegiatan yang memerlukan dispensasi', required: true },
      { name: 'tanggalMulai', label: 'Tanggal Mulai', type: 'date', required: true },
      { name: 'tanggalSelesai', label: 'Tanggal Selesai', type: 'date', required: true },
      { name: 'alasan', label: 'Alasan / Keterangan', type: 'textarea', placeholder: 'Jelaskan alasan dispensasi', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  // === SURAT KJP ===
  kjp_tutup: {
    title: 'Surat Permohonan Tutup Buku Rekening KJP',
    description: 'Permohonan tutup buku rekening KJP',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama penerima KJP', required: true },
      { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
      { name: 'noKJP', label: 'No. Kartu KJP', type: 'text', placeholder: 'Nomor kartu KJP', required: true },
      { name: 'namaBank', label: 'Nama Bank', type: 'select', options: ['Bank DKI', 'Bank Mandiri', 'Bank BRI', 'Bank BNI', 'Bank BTN'], required: true },
      { name: 'noRekening', label: 'No. Rekening', type: 'text', placeholder: 'Nomor rekening', required: true },
      { name: 'alamat', label: 'Alamat Lengkap', type: 'textarea', placeholder: 'Alamat rumah', required: true },
      { name: 'alasanTutup', label: 'Alasan Tutup Buku', type: 'textarea', placeholder: 'Jelaskan alasan menutup buku rekening', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  kjp_blokir: {
    title: 'Surat Permohonan Buka Blokir KJP',
    description: 'Permohonan buka blokir rekening KJP',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama penerima KJP', required: true },
      { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
      { name: 'noKJP', label: 'No. Kartu KJP', type: 'text', placeholder: 'Nomor kartu KJP', required: true },
      { name: 'namaBank', label: 'Nama Bank', type: 'select', options: ['Bank DKI', 'Bank Mandiri', 'Bank BRI', 'Bank BNI', 'Bank BTN'], required: true },
      { name: 'noRekening', label: 'No. Rekening', type: 'text', placeholder: 'Nomor rekening', required: true },
      { name: 'alasanBlokir', label: 'Alasan Diblokir', type: 'textarea', placeholder: 'Jelaskan mengapa rekening diblokir', required: true },
      { name: 'tanggalBlokir', label: 'Tanggal Diblokir', type: 'date', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  kjp_nama: {
    title: 'Surat Permohonan Perubahan Nama / Wali KJP',
    description: 'Permohonan perubahan data nama atau wali KJP',
    fields: [
      { name: 'namaLama', label: 'Nama Lama (di Kartu KJP)', type: 'text', placeholder: 'Nama sesuai kartu KJP', required: true },
      { name: 'namaBaru', label: 'Nama Baru', type: 'text', placeholder: 'Nama yang baru', required: true },
      { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
      { name: 'noKJP', label: 'No. Kartu KJP', type: 'text', placeholder: 'Nomor kartu KJP', required: true },
      { name: 'hubungan', label: 'Hubungan dengan Penerima', type: 'select', options: ['Diri sendiri', 'Anak', 'Wali'], required: true },
      { name: 'alasan', label: 'Alasan Perubahan', type: 'textarea', placeholder: 'Jelaskan alasan perubahan nama', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  kjp_atm: {
    title: 'Surat Permohonan Ganti Buku / ATM Bank DKI KJP',
    description: 'Permohonan ganti buku tabungan atau ATM Bank DKI',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama penerima KJP', required: true },
      { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
      { name: 'noKJP', label: 'No. Kartu KJP', type: 'text', placeholder: 'Nomor kartu KJP', required: true },
      { name: 'noRekening', label: 'No. Rekening', type: 'text', placeholder: 'Nomor rekening', required: true },
      { name: 'jenisPermohonan', label: 'Jenis Permohonan', type: 'select', options: ['Ganti Buku Tabungan', 'Ganti ATM', 'Ganti PIN'], required: true },
      { name: 'alasan', label: 'Alasan', type: 'textarea', placeholder: 'Jelaskan alasan penggantian', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  // === SURAT GURU & PEGAWAI ===
  izin_guru: {
    title: 'Surat Izin Guru dan Pegawai',
    description: 'Surat izin tidak masuk kerja',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap', required: true },
      { name: 'nip', label: 'NIP', type: 'text', placeholder: 'Nomor Induk Pegawai', required: true },
      { name: 'jabatan', label: 'Jabatan', type: 'select', options: ['Guru', 'Pegawai', 'Tenaga Administrasi', 'Penjaga Sekolah', 'Lainnya'], required: true },
      { name: 'alamat', label: 'Alamat Rumah', type: 'textarea', placeholder: 'Alamat lengkap', required: true },
      { name: 'alasanIzin', label: 'Alasan Izin', type: 'textarea', placeholder: 'Jelaskan alasan tidak masuk', required: true },
      { name: 'tanggalMulai', label: 'Izin Dari Tanggal', type: 'date', required: true },
      { name: 'tanggalSelesai', label: 'Sampai Tanggal', type: 'date', required: true },
      { name: 'tanggalSurat', label: 'Surat Dikeluarkan Tanggal', type: 'date', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  pengalaman: {
    title: 'Surat Keterangan Pengalaman',
    description: 'Surat keterangan pengalaman kerja',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap', required: true },
      { name: 'nip', label: 'NIP', type: 'text', placeholder: 'Nomor Induk Pegawai', required: true },
      { name: 'jabatan', label: 'Jabatan', type: 'text', placeholder: 'Jabatan saat ini', required: true },
      { name: 'unitKerja', label: 'Unit Kerja', type: 'text', placeholder: 'Unit/Bagian kerja', required: true },
      { name: 'tanggalMasuk', label: 'Tanggal Masuk', type: 'date', required: true },
      { name: 'masaKerja', label: 'Masa Kerja (tahun)', type: 'number', placeholder: 'Contoh: 5', required: true },
      { name: 'keperluan', label: 'Keperluan', type: 'textarea', placeholder: 'Untuk keperluan apa surat ini dimintakan?', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  rekomendasi: {
    title: 'Surat Rekomendasi',
    description: 'Surat rekomendasi untuk keperluan tertentu',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama yang direkomendasikan', required: true },
      { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
      { name: 'jabatan', label: 'Jabatan / Posisi', type: 'text', placeholder: 'Jabatan atau posisi', required: true },
      { name: 'instansi', label: 'Instansi Tujuan', type: 'text', placeholder: 'Nama instansi yang dituju', required: true },
      { name: 'keperluan', label: 'Keperluan Rekomendasi', type: 'textarea', placeholder: 'Untuk keperluan apa rekomendasi ini?', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  // === ADMINISTRASI ===
  rt_rw: {
    title: 'Surat Pengantar RT/RW',
    description: 'Surat pengantar untuk keperluan administrasi',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap', required: true },
      { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
      { name: 'alamat', label: 'Alamat Lengkap', type: 'textarea', placeholder: 'Alamat lengkap sesuai KTP', required: true },
      { name: 'rt', label: 'RT', type: 'text', placeholder: 'Contoh: 001', required: true },
      { name: 'rw', label: 'RW', type: 'text', placeholder: 'Contoh: 005', required: true },
      { name: 'kelurahan', label: 'Kelurahan', type: 'text', placeholder: 'Nama kelurahan', required: true },
      { name: 'kecamatan', label: 'Kecamatan', type: 'text', placeholder: 'Nama kecamatan', required: true },
      { name: 'keperluan', label: 'Keperluan', type: 'textarea', placeholder: 'Untuk keperluan apa surat ini dimintakan?', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  domisili: {
    title: 'Surat Keterangan Domisili',
    description: 'Surat keterangan domisili sekolah',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap', required: true },
      { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
      { name: 'alamat', label: 'Alamat Lengkap', type: 'textarea', placeholder: 'Alamat domisili', required: true },
      { name: 'rt', label: 'RT', type: 'text', placeholder: 'Contoh: 001', required: true },
      { name: 'rw', label: 'RW', type: 'text', placeholder: 'Contoh: 005', required: true },
      { name: 'kelurahan', label: 'Kelurahan', type: 'text', placeholder: 'Nama kelurahan', required: true },
      { name: 'kecamatan', label: 'Kecamatan', type: 'text', placeholder: 'Nama kecamatan', required: true },
      { name: 'kota', label: 'Kota/Kabupaten', type: 'text', placeholder: 'Nama kota', required: true },
      { name: 'keperluan', label: 'Keperluan', type: 'textarea', placeholder: 'Untuk keperluan apa surat ini dimintakan?', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    ]
  },

  legalisasi: {
    title: 'Surat Permohonan Legalisasi',
    description: 'Permohonan legalisasi dokumen',
    fields: [
      { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap', required: true },
      { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
      { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
      { name: 'jenisDokumen', label: 'Jenis Dokumen', type: 'select', options: ['Ijazah', 'Transkrip Nilai', 'SKHU', 'Surat Keterangan', 'Lainnya'], required: true },
      { name: 'namaDokumen', label: 'Nama Dokumen', type: 'text', placeholder: 'Contoh: Ijazah SMA tahun 2024', required: true },
      { name: 'jumlah', label: 'Jumlah Lembar', type: 'number', placeholder: 'Jumlah dokumen yang akan dilegalisir', required: true },
      { name: 'keperluan', label: 'Keperluan', type: 'textarea', placeholder: 'Untuk keperluan apa legalisasi ini?', required: true },
    ]
  },
};

// Export semua jenis surat untuk mapping
export const JENIS_SURAT = {
  izin_guru: 'Surat Izin Guru dan Pegawai',
  keterangan_aktif: 'Surat Keterangan Aktif Sekolah',
  keterangan_lulus: 'Surat Keterangan Lulus',
  keterangan_pindah: 'Surat Keterangan Pindah',
  lomba: 'Surat Keterangan Lomba (Team)',
  kjp_tutup: 'Surat Permohonan Tutup Buku Rekening KJP',
  kjp_blokir: 'Surat Permohonan Buka Blokir KJP',
  kjp_nama: 'Surat Permohonan Perubahan Nama / Wali KJP',
  kjp_atm: 'Surat Permohonan Ganti Buku / ATM Bank DKI KJP',
  dispensasi: 'Surat Dispensasi Siswa',
  pengalaman: 'Surat Keterangan Pengalaman',
  rekomendasi: 'Surat Rekomendasi',
  rt_rw: 'Surat Pengantar RT/RW',
  domisili: 'Surat Keterangan Domisili',
  legalisasi: 'Surat Permohonan Legalisasi',
};