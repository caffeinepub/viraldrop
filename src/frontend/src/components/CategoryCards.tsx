import { motion } from "motion/react";
import { ProductCategory } from "../backend.d";

const categories = [
  {
    id: ProductCategory.techGadgets,
    label: "Tech Gadgets",
    icon: "📱",
    desc: "Smartwatches, earbuds & more",
    color: "oklch(0.79 0.14 189)",
  },
  {
    id: ProductCategory.homeEssentials,
    label: "Home Essentials",
    icon: "🏠",
    desc: "Organizers, lights & decor",
    color: "oklch(0.65 0.28 320)",
  },
  {
    id: ProductCategory.fashion,
    label: "Fashion",
    icon: "👗",
    desc: "Trending styles & accessories",
    color: "oklch(0.52 0.27 285)",
  },
  {
    id: ProductCategory.petGear,
    label: "Pet Gear",
    icon: "🐾",
    desc: "Toys, trackers & feeders",
    color: "oklch(0.83 0.17 90)",
  },
];

interface CategoryCardsProps {
  onCategorySelect: (cat: ProductCategory) => void;
}

export default function CategoryCards({
  onCategorySelect,
}: CategoryCardsProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-display font-semibold text-2xl mb-8"
          style={{ color: "oklch(0.96 0.005 230)" }}
        >
          Trending Categories
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              data-ocid={`categories.item.${i + 1}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              onClick={() => onCategorySelect(cat.id)}
              className="relative flex flex-col items-center gap-3 p-6 rounded-2xl text-center transition-all cursor-pointer group"
              style={{
                background: "oklch(0.17 0.01 230)",
                border: `1px solid ${cat.color}30`,
                boxShadow: "0 4px 24px oklch(0 0 0 / 0.3)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all"
                style={{
                  background: `${cat.color}18`,
                  border: `1px solid ${cat.color}40`,
                  boxShadow: `0 0 20px ${cat.color}20`,
                }}
              >
                {cat.icon}
              </div>
              <div>
                <p
                  className="font-display font-semibold text-sm"
                  style={{ color: "oklch(0.96 0.005 230)" }}
                >
                  {cat.label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "oklch(0.72 0.01 230)" }}
                >
                  {cat.desc}
                </p>
              </div>
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `${cat.color}08` }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
