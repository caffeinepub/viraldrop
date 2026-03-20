import { Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface FlashSaleStripProps {
  endTime?: bigint | null;
}

function formatTime(ms: number) {
  if (ms <= 0) return "00:00:00";
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((totalSecs % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSecs % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function FlashSaleStrip({ endTime }: FlashSaleStripProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const end = endTime
      ? Number(endTime) / 1_000_000
      : Date.now() + 2 * 60 * 60 * 1000 + 34 * 60 * 1000 + 58 * 1000;

    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <section className="py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 py-6 px-8 rounded-2xl text-center flex-wrap"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.17 0.015 285), oklch(0.15 0.02 320))",
            border: "1px solid oklch(0.65 0.28 320 / 0.3)",
            boxShadow: "0 0 40px oklch(0.65 0.28 320 / 0.15)",
          }}
        >
          <div className="flex items-center gap-2">
            <Zap
              className="h-5 w-5 animate-pulse"
              style={{ color: "oklch(0.65 0.28 320)" }}
            />
            <span
              className="font-display font-bold text-lg uppercase tracking-widest"
              style={{ color: "oklch(0.65 0.28 320)" }}
            >
              Flash Sale
            </span>
            <Zap
              className="h-5 w-5 animate-pulse"
              style={{ color: "oklch(0.65 0.28 320)" }}
            />
          </div>

          <span
            className="font-display font-extrabold"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              color: "oklch(0.96 0.005 230)",
            }}
          >
            ENDS IN
          </span>

          <div
            className="font-display font-extrabold tabular-nums"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "oklch(0.79 0.14 189)",
              textShadow: "0 0 30px oklch(0.79 0.14 189 / 0.6)",
              letterSpacing: "0.05em",
            }}
            data-ocid="flash_sale.countdown"
          >
            {formatTime(remaining)}
          </div>

          <span className="text-sm" style={{ color: "oklch(0.72 0.01 230)" }}>
            Don't miss out on up to 70% off!
          </span>
        </motion.div>
      </div>
    </section>
  );
}
