import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export const Default404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        {/* 404 Visual */}
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[150px] font-black text-slate-200 leading-none select-none"
          >
            404
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <Search size={40} className="text-blue-600" />
            </div>
          </motion.div>
        </div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-slate-800 mb-3"
        >
          Halaman Tidak Ditemukan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 mb-8"
        >
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          Mungkin ada kesalahan dalam URL atau halaman telah dihapus.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <Home size={18} />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
            Halaman Sebelumnya
          </button>
        </motion.div>

        {/* Suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-4 bg-slate-100 rounded-xl"
        >
          <p className="text-sm text-slate-600">
            <span className="font-semibold">Tips:</span> Gunakan menu navigasi di atas untuk menemukan halaman yang Anda cari.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Default404;
