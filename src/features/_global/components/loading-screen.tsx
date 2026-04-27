import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_CONFIG } from "@/config/api";
import { getSchoolIdSync } from "../../hooks/getSchoolId";

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

/**
 * Animated loading screen with school logo and welcome message
 * Content is editable from admin dashboard (profileSekolah)
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDuration = 2000,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [schoolProfile, setSchoolProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const schoolId = getSchoolIdSync(); // dynamic schoolId from hostname
        const response = await fetch(`${API_CONFIG.baseUrl}/profileSekolah?schoolId=${schoolId}`);
        const result = await response.json();
        if (result.success && result.data) {
          setSchoolProfile(result.data);
        }
      } catch (err) {
        console.error('Gagal load profile untuk loading screen:', err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  const schoolName = schoolProfile?.schoolName || 'Nayaka Website';
  const schoolTypeLabel = schoolProfile?.schoolTypeLabel || 'Sekolah Menengah Kejuruan Negeri';
  const logoUrl = schoolProfile?.logoUrl;
  const loadingWelcomeText = schoolProfile?.loadingWelcomeText || `Selamat Datang di`;
  const loadingSubtitleText = schoolProfile?.loadingSubtitleText || 'Portal Resmi Sekolah';

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${schoolProfile?.themePrimary || '#1B5E20'} 0%, ${schoolProfile?.themeSurface || '#0B1733'} 100%)`,
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
          </div>

          {/* Animated gradient orbs */}
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ background: schoolProfile?.themeAccent || '#FFFFEB3B' }}
          />
          <motion.div
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ background: schoolProfile?.themeAccent || '#FFFFEB3B' }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-8"
            >
              {logoUrl ? (
                <motion.img
                  src={logoUrl}
                  alt={schoolName}
                  className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-2xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                // No placeholder - wait for admin to set logo
                <motion.div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center"
                  style={{
                    background: schoolProfile?.themeAccent || '#1B5E20',
                    opacity: 0.5,
                  }}
                />
              )}
            </motion.div>

            {/* School Name */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-2"
            >
              <h1
                className="text-2xl md:text-4xl font-bold tracking-tight"
                style={{ color: schoolProfile?.themeAccent || '#FFFFEB3B' }}
              >
                {schoolName}
              </h1>
            </motion.div>

            {/* School Type Label */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-8"
            >
              <p
                className="text-sm md:text-base opacity-80"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {schoolTypeLabel}
              </p>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <p
                className="text-lg md:text-xl font-medium"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {loadingWelcomeText}
              </p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex items-center gap-2"
            >
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ background: schoolProfile?.themeAccent || '#FFFFEB3B' }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ background: schoolProfile?.themeAccent || '#FFFFEB3B' }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ background: schoolProfile?.themeAccent || '#FFFFEB3B' }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </motion.div>

            {/* Powered by */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8"
            >
              <p className="text-xs text-white/40">
                Powered by <span className="font-semibold">Xpresensi</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

LoadingScreen.displayName = 'LoadingScreen';
