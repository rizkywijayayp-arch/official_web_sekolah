/**
 * Print Page untuk Surat Keterangan Lulus
 * Dengan statement/keterangan yang bisa dikustomisasi
 */
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_CONFIG } from '@/config/api';
import { GraduationData } from '@/features/graduation/hooks/useGraduation';
import { Button } from '@/core/libs';
import { ArrowLeft, Printer, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
import { Textarea } from '@/core/libs';
import { useSchoolPreset } from '@/features/layanan-persuratan/hooks/useSchoolPreset';

export const KeteranganLulusPrintPage = () => {
  const { id } = useParams<{ id: string }>();
  const printRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: schoolData } = useSchoolProfile();
  const { preset } = useSchoolPreset();

  const [kelulusan, setKelulusan] = useState<GraduationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customStatement, setCustomStatement] = useState('');
  const [editMode, setEditMode] = useState(true);

  // Get jenjang options based on school type
  const getJenjangOptions = () => {
    const schoolType = schoolData?.schoolType || '';
    if (schoolType.includes('SD') || schoolType.includes('MI')) {
      return [{ label: 'SD / MI', jenjang: 'SD / MI', kelas: 'Kelas 6' }];
    }
    if (schoolType.includes('SMP') || schoolType.includes('MTs')) {
      return [{ label: 'SMP / MTs', jenjang: 'SMP / MTs', kelas: 'Kelas 9' }];
    }
    if (schoolType.includes('SMA') || schoolType.includes('MA')) {
      return [{ label: 'SMA / MA', jenjang: 'SMA / MA', kelas: 'Kelas 12' }];
    }
    if (schoolType.includes('SMK') || schoolType.includes('MAK')) {
      return [{ label: 'SMK / MAK', jenjang: 'SMK / MAK', kelas: 'Kelas 12' }];
    }
    return [
      { label: 'SD / MI', jenjang: 'SD / MI', kelas: 'Kelas 6' },
      { label: 'SMP / MTs', jenjang: 'SMP / MTs', kelas: 'Kelas 9' },
      { label: 'SMA / MA', jenjang: 'SMA / MA', kelas: 'Kelas 12' },
      { label: 'SMK / MAK', jenjang: 'SMK / MAK', kelas: 'Kelas 12' },
    ];
  };

  // Get label based on jenjang
  const getJenjangLabel = (jenjang: string) => {
    const options = getJenjangOptions();
    const found = options.find(o => o.jenjang === jenjang);
    return found?.label || jenjang;
  };

  useEffect(() => {
    const fetchKelulusan = async () => {
      if (!id) {
        setError('ID tidak valid');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/kelulusan/${id}`, {
          headers: {
            'X-API-Key': import.meta.env.VITE_API_KEY || '',
          },
        });

        const result = await response.json();

        if (result.success) {
          setKelulusan(result.data);
        } else {
          setError(result.message || 'Data tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal mengambil data kelulusan');
      } finally {
        setLoading(false);
      }
    };

    fetchKelulusan();
  }, [id]);

  // Template statement yang bisa dipilih
  const STATEMENT_TEMPLATES = [
    {
      label: 'Pendaftaran Kuliah',
      text: 'dengan ini menyatakan bahwa nama tersebut di atas telah menyelesaikan seluruh program pembelajaran pada paket keahlian yang ditempuh di sekolah ini. Surat keterangan ini dibuat untuk keperluan pendaftaran kuliah/perguruan tinggi.'
    },
    {
      label: 'Pencarian Kerja',
      text: 'dengan ini menyatakan bahwa nama tersebut di atas telah menyelesaikan seluruh program pembelajaran pada paket keahlian yang ditempuh di sekolah ini. Surat keterangan ini dibuat untuk keperluan melamar pekerjaan.'
    },
    {
      label: 'Administrasi',
      text: 'dengan ini menyatakan bahwa nama tersebut di atas telah menyelesaikan seluruh program pembelajaran pada paket keahlian yang ditempuh di sekolah ini. Surat keterangan ini dibuat untuk keperluan administrasi umum.'
    },
    {
      label: 'Daftar Haji',
      text: 'dengan ini menyatakan bahwa nama tersebut di atas telah menyelesaikan seluruh program pembelajaran pada paket keahlian yang ditempuh di sekolah ini. Surat keterangan ini dibuat untuk keperluan pendaftaran ibadah haji.'
    },
    {
      label: 'Keperluan Visa',
      text: 'dengan ini menyatakan bahwa nama tersebut di atas telah menyelesaikan seluruh program pembelajaran pada paket keahlian yang ditempuh di sekolah ini. Surat keterangan ini dibuat untuk keperluan pengajuan visa luar negeri.'
    },
  ];

  const applyTemplate = (text: string) => {
    setCustomStatement(text);
    setEditMode(false);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Surat Keterangan Lulus - ${kelulusan?.nama || 'Siswa'}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                  font-family: 'Times New Roman', Times, serif;
                  padding: 40px 50px;
                  color: #000;
                  font-size: 12pt;
                  line-height: 1.6;
                }
                .kop-surat { text-align: center; }
                .kop-surat img { max-width: 100%; max-height: 130px; }
                .kop-header {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 15px;
                  margin-bottom: 10px;
                }
                .kop-header h1 { font-size: 18pt; margin: 0; }
                .kop-header h2 { font-size: 14pt; margin: 0; }
                .kop-header p { font-size: 10pt; margin: 0; }
                .kop-line { border-top: 3px solid black; margin: 5px 0; }
                .kop-address { font-size: 10pt; margin-top: 5px; }
                .nomor-surat { text-align: center; margin: 20px 0; font-size: 11pt; }
                .perihal { text-align: center; margin-bottom: 20px; font-size: 12pt; }
                .content { text-align: justify; }
                .content p { margin-bottom: 15px; }
                .signature { margin-top: 50px; float: right; width: 250px; }
                .signature .title { margin-bottom: 80px; }
                .signature .name { font-weight: bold; text-decoration: underline; }
                .signature .nip { font-size: 10pt; }
                .qr-section { margin-top: 30px; text-align: center; font-size: 9pt; }
                @media print {
                  body { padding: 20px; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  if (!kelulusan) return null;

  const kopSuratUrl = preset.kopSuratUrl || kelulusan.kopSuratUrl || schoolData?.logoUrl;
  const kepalaSekolah = preset.ttdKepalaSekolah || kelulusan.ttdKepalaSekolah || schoolData?.headmasterName || 'Kepala Sekolah';
  const nipKepala = preset.nipKepalaSekolah || kelulusan.nipKepalaSekolah || '-';
  const tataUsaha = preset.ttdTataUsaha || kelulusan.ttdTataUsaha || '-';
  const nipTU = preset.nipTataUsaha || kelulusan.nipTataUsaha || '-';

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Toolbar */}
      <div className="max-w-4xl mx-auto mb-4 flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div className="flex-1" />
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Cetak
        </Button>
      </div>

      {/* Print Preview */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        <div ref={printRef} className="p-8">
          {/* Kop Surat */}
          {kopSuratUrl ? (
            <div className="kop-surat mb-4">
              <img src={kopSuratUrl} alt="Kop Surat" />
            </div>
          ) : (
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold">{schoolData?.schoolName || 'Nama Sekolah'}</h1>
              <p className="text-sm">{schoolData?.address || 'Alamat Sekolah'}</p>
              <p className="text-sm">Telp: {schoolData?.phone || '-'}</p>
            </div>
          )}
          <div className="border-t-2 border-black mb-4" />

          {/* Nomor Surat */}
          <div className="nomor-surat">
            <p>Nomor: {kelulusan.nomorSurat || `__________`}</p>
            <p>Lampiran: -</p>
            <p>Perihal: <strong>Surat Keterangan Lulus</strong></p>
          </div>

          {/* Kepada */}
          <div className="mb-4">
            <p>Kepada Yth.</p>
            <p>Bapak/Ibu {kelulusan.nama}</p>
            <p>di Tempat</p>
          </div>

          {/* Content */}
          <div className="content">
            <p>Dengan hormat,</p>
            <p>
              Bersama surat ini, kami {schoolData?.schoolName || 'Sekolah'} certify bahwa:
            </p>
            <table className="ml-8 my-4">
              <tbody>
                <tr>
                  <td className="pr-4">Nama</td>
                  <td>: {kelulusan.nama}</td>
                </tr>
                <tr>
                  <td className="pr-4">NISN</td>
                  <td>: {kelulusan.nisn}</td>
                </tr>
                <tr>
                  <td className="pr-4">NIS</td>
                  <td>: {kelulusan.nis || '-'}</td>
                </tr>
                <tr>
                  <td className="pr-4">Jenjang</td>
                  <td>: {getJenjangLabel(kelulusan.jenjang)}</td>
                </tr>
                <tr>
                  <td className="pr-4">Jurusan</td>
                  <td>: {kelulusan.jurusan || '-'}</td>
                </tr>
                <tr>
                  <td className="pr-4">Kelas</td>
                  <td>: {kelulusan.kelas}</td>
                </tr>
                <tr>
                  <td className="pr-4">Tahun Lulus</td>
                  <td>: {kelulusan.tahunLulus}</td>
                </tr>
              </tbody>
            </table>
            <p>
              {customStatement || 'dengan ini menyatakan bahwa nama tersebut di atas telah menyelesaikan seluruh program pembelajaran pada paket keahlian yang ditempuh di sekolah ini. Surat keterangan ini dibuat untuk keperluan administrasi.'}
            </p>
            <p>Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
          </div>

          {/* Signature */}
          <div className="signature text-center mt-12">
            <p className="mb-2">{schoolData?.city || 'Kota'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mb-16">Kepala Sekolah</p>
            <p className="font-bold underline">{kepalaSekolah}</p>
            <p className="text-sm">NIP. {nipKepala}</p>
          </div>

          {/* QR Code Section */}
          <div className="qr-section mt-8 pt-4 border-t">
            <p>Verifikasi surat: {window.location.origin}/verify/{kelulusan.id}</p>
          </div>
        </div>
      </div>

      {/* Statement Editor (outside print) */}
      <div className="max-w-4xl mx-auto mt-4 bg-white shadow-lg p-4">
        <h3 className="font-semibold mb-3">Template Pernyataan</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {STATEMENT_TEMPLATES.map((template, idx) => (
            <button
              key={idx}
              onClick={() => applyTemplate(template.text)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              {template.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Keterangan Custom</label>
          <Textarea
            value={customStatement}
            onChange={(e) => { setCustomStatement(e.target.value); setEditMode(true); }}
            placeholder="Tulis keterangan custom di sini..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
