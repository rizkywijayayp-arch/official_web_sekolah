/**
 * Permohonan Print Page - Format Surat Resmi Profesional
 * Dengan QR code, barcode, watermark, dll
 */
import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { API_CONFIG } from '@/config/api';
import { PermohonanData } from '../hooks/usePermohonan';
import { Button } from '@/core/libs';
import { ArrowLeft, Printer, ExternalLink, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';

export const PermohonanPrintPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const printRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: schoolData } = useSchoolProfile();

  const [permohonan, setPermohonan] = useState<PermohonanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermohonan = async () => {
      if (!id) {
        setError('ID tidak valid');
        setLoading(false);
        return;
      }

      try {
        const url = email
          ? `${API_CONFIG.baseUrl}/permohonan/track/${id}?email=${encodeURIComponent(email)}`
          : `${API_CONFIG.baseUrl}/permohonan/${id}`;

        const response = await fetch(url, {
          headers: {
            'X-API-Key': import.meta.env.VITE_API_KEY || '',
          },
        });

        const result = await response.json();

        if (result.success) {
          setPermohonan(result.data);
        } else {
          setError(result.message || 'Permohonan tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal mengambil data permohonan');
      } finally {
        setLoading(false);
      }
    };

    fetchPermohonan();
  }, [id, email]);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${permohonan?.jenisSuratLabel || 'Surat'} - ${schoolData?.schoolName || 'Sekolah'}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                  font-family: 'Times New Roman', Times, serif;
                  padding: 40px 50px;
                  color: #000;
                  font-size: 12pt;
                  line-height: 1.6;
                }
                .watermark-draft {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                  font-size: 100pt;
                  color: rgba(255,0,0,0.1);
                  pointer-events: none;
                  z-index: -1;
                }
                .kop-surat { text-align: center; }
                .kop-surat img { max-width: 100%; max-height: 130px; }
                .kop-header {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 15px;
                  padding: 10px 0;
                }
                .kop-logo { width: 55px; height: 55px; }
                .kop-title { font-size: 16pt; font-weight: bold; text-transform: uppercase; }
                .kop-subtitle { font-size: 10pt; color: #444; }
                .divider { border-top: 3px solid #000; margin: 8px 0 0 0; }
                .divider-thin { border-top: 1px solid #000; margin: 2px 0 25px 0; }
                .nomor-surat {
                  text-align: right;
                  margin-bottom: 25px;
                  font-size: 11pt;
                }
                .perihal { margin: 25px 0; font-size: 11pt; }
                .alamat-surat { margin-bottom: 25px; }
                .body-content { text-align: justify; }
                .paragraf { margin-bottom: 15px; text-indent: 40px; }
                .data-table { margin: 20px 60px; width: calc(100% - 120px); }
                .data-row { display: flex; padding: 4px 0; }
                .data-label { width: 130px; }
                .data-value { flex: 1; }
                .signature-area {
                  margin-top: 45px;
                  display: flex;
                  justify-content: flex-end;
                }
                .signature-box { text-align: center; width: 220px; }
                .signature-date { margin-bottom: 50px; }
                .signature-boxes { display: flex; gap: 25px; margin-top: 10px; }
                .ttd-kepala, .ttd-tu { text-align: center; width: 50%; }
                .signature-name { font-weight: bold; text-decoration: underline; }
                .signature-nip { font-size: 10pt; }
                .signature-title { font-size: 10pt; margin-bottom: 50px; }
                . tembusan { margin-top: 35px; font-size: 10pt; }
                .tembusan-list { margin-left: 20px; }
                .footer-surat {
                  margin-top: 40px;
                  padding-top: 15px;
                  border-top: 1px solid #ccc;
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                  font-size: 9pt;
                  color: #666;
                }
                .qr-code { width: 70px; height: 70px; }
                .qr-info { text-align: right; }
                .barcode { font-family: monospace; letter-spacing: 3px; }
                @media print {
                  body { padding: 25px 35px; }
                  .watermark-draft { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    }
  };

  // Generate QR code URL (using inline SVG placeholder - bisa pakai library QR)
  const getQRCodeUrl = () => {
    if (!permohonan) return '';
    const verifyUrl = `${window.location.origin}/verify/${permohonan.id}`;
    // QR Code via API (bisa pakai Google Charts API atau library local)
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verifyUrl)}`;
  };

  // Generate barcode simulation
  const generateBarcode = (id: number) => {
    return String(id).padStart(12, '0').split('').map(n => '█'.repeat(parseInt(n) + 1)).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat surat...</p>
        </div>
      </div>
    );
  }

  if (error || !permohonan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
          <p className="text-gray-500 mb-4">{error || 'Permohonan tidak ditemukan'}</p>
          <Button onClick={() => navigate('/admin/permohonan')}>Kembali</Button>
        </div>
      </div>
    );
  }

  const isDraft = !['selesai', 'ditolak'].includes(permohonan.status);
  const schoolName = schoolData?.schoolName || 'Nayaka Website';
  const schoolAddress = schoolData?.address || 'Jl. Contoh No. 1, Jakarta';
  const schoolPhone = schoolData?.phoneNumber || '(021) 123-4567';
  const logoUrl = schoolData?.logoUrl;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Watermark DRAFT */}
      {isDraft && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="text-red-500 text-[120px] font-bold opacity-[0.07] rotate-[-45deg]">
            DRAFT
          </div>
        </div>
      )}

      {/* Print Content */}
      <div ref={printRef} className="max-w-3xl mx-auto bg-white shadow-lg relative">
        <div className="p-8">
          {/* Kop Surat */}
          <div className="kop-surat">
            {permohonan.kopSuratUrl ? (
              <img src={permohonan.kopSuratUrl} alt="Kop Surat" />
            ) : (
              <div className="kop-header">
                {logoUrl && <img src={logoUrl} alt="Logo" className="kop-logo" />}
                <div>
                  <div className="kop-title">{schoolName}</div>
                  <div className="kop-subtitle">{schoolAddress}</div>
                  <div className="kop-subtitle">Telp: {schoolPhone}</div>
                </div>
              </div>
            )}
          </div>
          <div className="divider"></div>
          <div className="divider-thin"></div>

          {/* Nomor Surat */}
          <div className="nomor-surat">
            <p><strong>Nomor</strong>&nbsp;&nbsp;&nbsp;: {permohonan.nomorSurat || <em className="text-gray-400">[Belum ada nomor]</em>}</p>
            <p><strong>Lamp</strong>&nbsp;&nbsp;&nbsp;: -</p>
            <p><strong>Perihal</strong>&nbsp;: <strong>{permohonan.jenisSuratLabel}</strong></p>
          </div>

          {/* Alamat Tujuan */}
          <div className="alamat-surat">
            <p>Jakarta, {new Date(permohonan.tanggalPengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>Kepada Yth,</p>
            <p className="font-semibold">{permohonan.dataPemohon?.nama || 'Pemohon'}</p>
            {permohonan.dataPemohon?.alamat && <p className="text-gray-600">{permohonan.dataPemohon.alamat}</p>}
          </div>

          {/* Isi Surat */}
          <div className="body-content">
            <p className="paragraf">Dengan hormat,</p>
            <p className="paragraf">
              Sehubungan dengan permohonan {permohonan.jenisSuratLabel} yang diajukan oleh:
            </p>

            <table className="data-table">
              <tbody>
                {permohonan.dataPemohon && Object.entries(permohonan.dataPemohon).map(([key, value]) => {
                  if (['alamat'].includes(key)) return null;
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return (
                    <tr key={key}>
                      <td style={{ width: '130px' }}>{label}</td>
                      <td>: {value || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="paragraf">
              Dengan ini kami sampaikan bahwa permohonan tersebut telah{' '}
              <strong>
                {permohonan.status === 'selesai' ? 'DISETUJUI' :
                 permohonan.status === 'ditolak' ? 'DITOLAK' :
                 'DALAM PROSES PENERBITAN'}
              </strong>.
            </p>

            {permohonan.catatanAdmin && (
              <p className="paragraf">
                <strong>Catatan:</strong> {permohonan.catatanAdmin}
              </p>
            )}

            <p className="paragraf">
              Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* Tanda Tangan */}
          <div className="signature-area">
            <div className="signature-box">
              <p className="signature-date">Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

              <div className="signature-boxes">
                <div className="ttd-kepala">
                  <p className="signature-title">Kepala Sekolah</p>
                  {permohonan.ttdKepalaSekolah ? (
                    <>
                      <p className="signature-name">{permohonan.ttdKepalaSekolah}</p>
                      {permohonan.nipKepalaSekolah && <p className="signature-nip">NIP. {permohonan.nipKepalaSekolah}</p>}
                    </>
                  ) : (
                    <div style={{ height: '55px' }}></div>
                  )}
                </div>

                <div className="ttd-tu">
                  <p className="signature-title">Kepala Tata Usaha</p>
                  {permohonan.ttdTataUsaha ? (
                    <>
                      <p className="signature-name">{permohonan.ttdTataUsaha}</p>
                      {permohonan.nipTataUsaha && <p className="signature-nip">NIP. {permohonan.nipTataUsaha}</p>}
                    </>
                  ) : (
                    <div style={{ height: '55px' }}></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tembusan */}
          <div className="tembusan">
            <p><strong>Tembusan:</strong></p>
            <ol className="tembusan-list">
              <li>Arsip</li>
            </ol>
          </div>

          {/* Footer dengan QR & Barcode */}
          <div className="footer-surat">
            <div>
              <p className="barcode">{generateBarcode(permohonan.id)}</p>
              <p>ID: {permohonan.id}</p>
              <p>Verifikasi di: {window.location.origin}/verify/{permohonan.id}</p>
            </div>
            <div className="qr-info">
              <img src={getQRCodeUrl()} alt="QR Code" className="qr-code" />
              <p>Scan untuk verifikasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-3xl mx-auto mt-6 flex gap-3 no-print">
        <Button variant="outline" onClick={() => navigate('/admin/permohonan')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Cetak Surat
        </Button>
        <Button variant="outline" onClick={() => window.open(`/verify/${permohonan.id}`, '_blank')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Link Verifikasi
        </Button>
      </div>
    </div>
  );
};
