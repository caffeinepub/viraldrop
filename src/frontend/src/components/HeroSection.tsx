import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const slides = [
  {
    id: "viral",
    headline: ["DISCOVER THE MOST", "VIRAL", "PRODUCTS"],
    sub: "Shop the hottest trending drops before they sell out. New viral finds added daily.",
    pill1: { label: "LED Galaxy Projector", price: "$29.99" },
    pill2: { label: "Wireless Earbuds", price: "$49.99" },
  },
  {
    id: "trending",
    headline: ["GO VIRAL WITH", "TRENDING", "GADGETS"],
    sub: "Exclusive deals on the products everyone's talking about. Limited time, unlimited hype.",
    pill1: { label: "Smart Ring", price: "$39.99" },
    pill2: { label: "Mini Projector", price: "$59.99" },
  },
  {
    id: "hot",
    headline: ["EPIC DEALS ON", "HOT", "DROPS"],
    sub: "Flash prices you won't find anywhere else. Join thousands of happy customers.",
    pill1: { label: "Pet Camera", price: "$44.99" },
    pill2: { label: "Posture Corrector", price: "$24.99" },
  },
];

interface HeroSectionProps {
  onShopNow: () => void;
}

export default function HeroSection({ onShopNow }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.1 0.005 230) 0%, oklch(0.13 0.02 270) 50%, oklch(0.1 0.005 230) 100%)",
        minHeight: "520px",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 20% 50%, oklch(0.52 0.27 285 / 0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 30%, oklch(0.65 0.28 320 / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 0 60px oklch(0.52 0.27 285 / 0.3)" }}
            >
              <img
                src="/assets/generated/hero-products.dim_800x600.jpg"
                alt="Viral Products"
                className="w-full object-cover"
                style={{ maxHeight: "400px" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, oklch(0.1 0.005 230 / 0.2) 0%, transparent 50%)",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-6 left-4 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.79 0.14 189 / 0.9), oklch(0.65 0.28 320 / 0.9))",
                color: "white",
                backdropFilter: "blur(8px)",
              }}
            >
              <span>🔥</span>
              <span>{slide.pill1.label}</span>
              <span className="font-bold">{slide.pill1.price}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-12 right-4 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.28 320 / 0.9), oklch(0.52 0.27 285 / 0.9))",
                color: "white",
                backdropFilter: "blur(8px)",
              }}
            >
              <span>⚡</span>
              <span>{slide.pill2.label}</span>
              <span className="font-bold">{slide.pill2.price}</span>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              <h1
                className="font-display font-extrabold leading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                <span style={{ color: "oklch(0.96 0.005 230)" }}>
                  {slide.headline[0]}{" "}
                </span>
                <span
                  className="inline-block"
                  style={{
                    color: "oklch(0.79 0.14 189)",
                    textShadow: "0 0 30px oklch(0.79 0.14 189 / 0.6)",
                  }}
                >
                  {slide.headline[1]}
                </span>
                <br />
                <span style={{ color: "oklch(0.96 0.005 230)" }}>
                  {slide.headline[2]}
                </span>
              </h1>

              <p
                className="text-base leading-relaxed max-w-md"
                style={{ color: "oklch(0.72 0.01 230)" }}
              >
                {slide.sub}
              </p>

              <div className="flex items-center gap-4">
                <Button
                  data-ocid="hero.primary_button"
                  onClick={onShopNow}
                  className="px-8 py-3 h-auto text-base font-bold uppercase tracking-wide rounded-full transition-all hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.28 320), oklch(0.52 0.27 285))",
                    color: "white",
                    boxShadow: "0 0 30px oklch(0.65 0.28 320 / 0.4)",
                    border: "none",
                  }}
                >
                  Shop Now – Flash Sale!
                </Button>
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.72 0.01 230)" }}
                >
                  Free shipping on orders $50+
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {slides.map((s, i) => (
                  <button
                    type="button"
                    key={s.id}
                    data-ocid="hero.pagination.toggle"
                    onClick={() => setCurrent(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: i === current ? "24px" : "8px",
                      height: "8px",
                      background:
                        i === current
                          ? "oklch(0.79 0.14 189)"
                          : "oklch(0.26 0.015 230)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
