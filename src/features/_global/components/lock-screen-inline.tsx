import { Lock, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface MenuSettings {
  isOpen: boolean;
  openedAt: string | null;
  closedAt: string | null;
  messageLock: string | null;
}

interface LockScreenInlineProps {
  settings: MenuSettings | null;
  defaultMessage?: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const formatCountdown = (countdown: Countdown) => ({
  days: String(countdown.days).padStart(2, "0"),
  hours: String(countdown.hours).padStart(2, "0"),
  minutes: String(countdown.minutes).padStart(2, "0"),
  seconds: String(countdown.seconds).padStart(2, "0"),
});

export const LockScreenInline = ({
  settings,
  defaultMessage = "Menu belum dibuka",
}: LockScreenInlineProps) => {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate target date from openedAt
  const targetDate = settings?.openedAt ? new Date(settings.openedAt) : null;

  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { days, hours, minutes, seconds } = formatCountdown(countdown);

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border-2 border-slate-100 rounded-[2rem] shadow-xl shadow-slate-900/5 p-10 text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">
          {settings?.messageLock || defaultMessage}
        </h2>

        {/* Schedule Info */}
        {settings?.openedAt && (
          <p className="text-slate-500 mb-8 flex items-center justify-center gap-2">
            <Clock size={16} />
            {formatDate(settings.openedAt)}
          </p>
        )}

        {/* Countdown Timer */}
        {targetDate && new Date() < targetDate && (
          <div className="flex justify-center gap-3 md:gap-4">
            {[
              { value: days, label: "Hari" },
              { value: hours, label: "Jam" },
              { value: minutes, label: "Menit" },
              { value: seconds, label: "Detik" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="bg-blue-600 text-white px-4 py-3 md:px-5 md:py-4 rounded-2xl min-w-[70px] shadow-lg shadow-blue-600/20">
                  <div className="text-2xl md:text-3xl font-black">{value}</div>
                </div>
                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LockScreenInline;
