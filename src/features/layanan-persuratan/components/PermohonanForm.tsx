import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Printer
} from 'lucide-react';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
import { API_CONFIG } from '@/config/api';
import { FORM_SCHEMAS, JENIS_SURAT } from '../utils/formSchema';

interface PermohonanFormProps {
  jenisSurat: string;
  onBack: () => void;
}

export const PermohonanForm: React.FC<PermohonanFormProps> = ({ jenisSurat, onBack }) => {
  const { data: schoolData } = useSchoolProfile();
  const schema = FORM_SCHEMAS[jenisSurat];
  const printRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const primaryColor = schoolData?.themePrimary || '#1e6fb5';
  const schoolName = schoolData?.schoolName || 'Sekolah';
  const logoUrl = schoolData?.logoUrl;

  if (!schema) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-white">Form tidak ditemukan</div>
      </div>
    );
  }

  // Split fields into steps (3-4 fields per step)
  const fieldsPerStep = 3;
  const totalFields = schema.fields.length;
  const totalSteps = Math.ceil(totalFields / fieldsPerStep);
  const steps = [];
  for (let i = 0; i < totalSteps; i++) {
    steps.push(schema.fields.slice(i * fieldsPerStep, (i + 1) * fieldsPerStep));
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/permohonan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
        body: JSON.stringify({
          jenisSurat,
          jenisSuratLabel: JENIS_SURAT[jenisSurat as keyof typeof JENIS_SURAT],
          dataPemohon: formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setSubmittedId(result.data?.id || null);
      } else {
        setError(result.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal mengirim permohonan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Bukti Permohonan - ${schema.title}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .logo { width: 60px; height: 60px; }
                h1 { font-size: 18px; margin: 10px 0; }
                h2 { font-size: 14px; margin: 5px 0; color: #666; }
                .info-box { border: 1px solid #ccc; padding: 15px; margin: 15px 0; border-radius: 8px; }
                .field { margin: 8px 0; display: flex; }
                .label { font-weight: bold; width: 150px; }
                .value { flex: 1; }
                .success-icon { text-align: center; font-size: 48px; margin: 20px 0; }
                .id-box { background: #f5f5f5; padding: 10px; text-align: center; margin: 15px 0; border-radius: 8px; }
                .id-number { font-size: 24px; font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                @media print { body { padding: 0; } }
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

  const isCurrentStepValid = () => {
    const currentFields = steps[currentStep];
    return currentFields.every(field => {
      if (!field.required) return true;
      return formData[field.name] && formData[field.name].trim() !== '';
    });
  };

  const isFormValid = () => {
    return schema.fields.every(field => {
      if (!field.required) return true;
      return formData[field.name] && formData[field.name].trim() !== '';
    });
  };

  // Success state
  if (isSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-[380px] rounded-3xl p-6 text-center"
          style={{ background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-white text-xl font-bold mb-2">Permohonan Terkirim!</h2>
          <p className="text-white/80 text-sm mb-4">
            Permohonan {schema.title} berhasil dikirim.<br />
            Tim kami akan segera memproses.
          </p>

          {/* Print-friendly content */}
          <div ref={printRef} className="hidden-print">
            <div className="id-box mb-4">
              <p className="text-white/60 text-xs mb-1">ID Permohonan</p>
              <p className="id-number text-white">#{submittedId || 'N/A'}</p>
            </div>

            <div className="info-box bg-white/10 border-white/20 text-left">
              <h3 className="text-white font-bold text-sm mb-2">{schema.title}</h3>
              {Object.entries(formData).slice(0, 4).map(([key, value]) => (
                <div key={key} className="field text-white/80 text-xs">
                  <span className="label capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="value">{value}</span>
                </div>
              ))}
            </div>

            <p className="text-white/60 text-xs mb-4">
              Tanggal: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="flex-1 py-3 rounded-full bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Cetak
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex-1 py-3 bg-white rounded-full font-semibold"
              style={{ color: primaryColor }}
            >
              Kembali
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
    >
      <div
        className="w-full max-w-[380px] rounded-3xl p-5 pb-7 relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}dd 30%, ${primaryColor}bb 60%, ${primaryColor}aa 100%)` }}
      >
        {/* Radial glow */}
        <div
          className="absolute -top-15 -right-15 w-50 h-50 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(100,180,255,0.15) 0%, transparent 70%)' }}
        />

        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white bg-white/15"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-white text-sm font-bold">{schema.title}</h1>
          </div>
        </div>

        {/* Logo & Info */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white/50">
            {logoUrl ? (
              <img src={logoUrl} alt={schoolName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold" style={{ color: primaryColor }}>
                {schoolName.substring(0, 3).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-white w-6' : 'bg-white/30 w-3'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />
            <span className="text-red-200 text-xs">{error}</span>
          </motion.div>
        )}

        {/* Form fields */}
        <div className="space-y-3 mb-4">
          {steps[currentStep].map((field) => (
            <div key={field.name}>
              <label className="block text-white/80 text-xs mb-1.5 font-medium">
                {field.label}
                {field.required && <span className="text-yellow-300 ml-0.5">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-white/15 border border-white/25 text-white text-sm placeholder-white/50 outline-none focus:border-white/50"
                  style={{ color: formData[field.name] ? 'white' : 'rgba(255,255,255,0.5)' }}
                >
                  <option value="" className="text-gray-800">Pilih {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt} className="text-gray-800">{opt}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-white/15 border border-white/25 text-white text-sm placeholder-white/50 outline-none focus:border-white/50 resize-none"
                />
              ) : (
                <input
                  type={field.type === 'phone' ? 'tel' : field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-full bg-white/15 border border-white/25 text-white text-sm placeholder-white/50 outline-none focus:border-white/50"
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {currentStep > 0 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="flex-1 py-3 rounded-full bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </motion.button>
          ) : (
            <div className="flex-1" />
          )}

          {currentStep < totalSteps - 1 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className={`flex-1 py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-1 ${
                isCurrentStepValid()
                  ? 'bg-white text-white'
                  : 'bg-white/30 text-white/50 cursor-not-allowed'
              }`}
              style={isCurrentStepValid() ? { color: primaryColor } : {}}
            >
              Lanjut
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className={`flex-1 py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 ${
                isFormValid() && !isSubmitting
                  ? 'bg-white text-white'
                  : 'bg-white/30 text-white/50 cursor-not-allowed'
              }`}
              style={isFormValid() && !isSubmitting ? { color: primaryColor } : {}}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermohonanForm;