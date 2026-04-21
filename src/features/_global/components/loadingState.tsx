import { motion } from "framer-motion";

interface LoadingStateProps {
  variant?: "card" | "list" | "hero" | "inline";
  count?: number;
}

export const LoadingState = ({ variant = "card", count = 1 }: LoadingStateProps) => {
  const shimmerClass = "bg-slate-200 rounded animate-shimmer";

  if (variant === "inline") {
    return (
      <span className="flex items-center gap-2 text-slate-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full"
        />
        <span className="text-sm">Memuat...</span>
      </span>
    );
  }

  if (variant === "hero") {
    return (
      <div className="space-y-4 p-6">
        <motion.div className={`h-12 ${shimmerClass}`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.div className={`h-6 w-3/4 ${shimmerClass}`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} />
        <motion.div className={`h-6 w-1/2 ${shimmerClass}`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            <motion.div className={`w-12 h-12 ${shimmerClass}`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <div className="flex-1 space-y-2">
              <motion.div className={`h-4 w-3/4 ${shimmerClass}`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} />
              <motion.div className={`h-3 w-1/2 ${shimmerClass}`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.1 }} />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} className="bg-white rounded-xl shadow-sm p-4 space-y-3"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <motion.div className={`h-40 w-full ${shimmerClass}`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.div className={`h-5 w-3/4 ${shimmerClass}`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} />
          <motion.div className={`h-4 w-1/2 ${shimmerClass}`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.1 }} />
        </motion.div>
      ))}
    </div>
  );
};

// Skeleton for specific content
export const NewsCardSkeleton = () => (
  <motion.div className="bg-white rounded-xl shadow-sm overflow-hidden"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <motion.div className="h-48 bg-slate-200 animate-shimmer" />
    <div className="p-4 space-y-2">
      <motion.div className="h-4 w-3/4 bg-slate-200 rounded animate-shimmer" />
      <motion.div className="h-3 w-1/2 bg-slate-200 rounded animate-shimmer" />
      <motion.div className="h-3 w-full bg-slate-200 rounded animate-shimmer" />
    </div>
  </motion.div>
);

export const ProfileCardSkeleton = () => (
  <motion.div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <motion.div className="w-16 h-16 rounded-full bg-slate-200 animate-shimmer" />
    <div className="flex-1 space-y-2">
      <motion.div className="h-5 w-1/2 bg-slate-200 rounded animate-shimmer" />
      <motion.div className="h-4 w-1/3 bg-slate-200 rounded animate-shimmer" />
    </div>
  </motion.div>
);
