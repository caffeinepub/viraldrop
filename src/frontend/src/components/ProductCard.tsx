import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { type Product, ProductBadge } from "../backend.d";

const badgeConfig: Record<string, { label: string; color: string }> = {
  [ProductBadge.hot]: { label: "HOT", color: "oklch(0.65 0.28 320)" },
  [ProductBadge.viral]: { label: "VIRAL", color: "oklch(0.79 0.14 189)" },
  [ProductBadge.new_]: { label: "NEW", color: "oklch(0.52 0.27 285)" },
  [ProductBadge.sale]: { label: "SALE", color: "oklch(0.83 0.17 90)" },
};

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (productId: bigint) => void;
  isAdding?: boolean;
}

export default function ProductCard({
  product,
  index,
  onAddToCart,
  isAdding,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError
    ? `https://picsum.photos/seed/${product.id}/400/400`
    : product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`;

  const badge = product.badge ? badgeConfig[product.badge] : null;
  const salePrice = Number(product.price) / 100;
  const origPrice = product.originalPrice
    ? Number(product.originalPrice) / 100
    : null;

  return (
    <motion.div
      data-ocid={`products.item.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="relative flex flex-col rounded-2xl overflow-hidden group"
      style={{
        background: "oklch(0.17 0.01 230)",
        border: "1px solid oklch(0.26 0.015 230 / 0.6)",
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.3)",
      }}
    >
      {/* Badge */}
      {badge && (
        <div
          className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${badge.color}, oklch(0.52 0.27 285))`,
          }}
        >
          {badge.label}
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, oklch(0.17 0.01 230 / 0.6))",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <p
          className="font-semibold text-sm leading-snug line-clamp-2"
          style={{ color: "oklch(0.96 0.005 230)" }}
        >
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="h-3.5 w-3.5"
                style={{
                  fill:
                    s <= Math.round(product.rating)
                      ? "oklch(0.83 0.17 90)"
                      : "transparent",
                  color:
                    s <= Math.round(product.rating)
                      ? "oklch(0.83 0.17 90)"
                      : "oklch(0.4 0.01 230)",
                }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: "oklch(0.72 0.01 230)" }}>
            ({Number(product.reviewCount)})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span
            className="font-display font-bold text-lg"
            style={{ color: "oklch(0.79 0.14 189)" }}
          >
            ${salePrice.toFixed(2)}
          </span>
          {origPrice && (
            <span
              className="text-sm line-through"
              style={{ color: "oklch(0.55 0.01 230)" }}
            >
              ${origPrice.toFixed(2)}
            </span>
          )}
          {origPrice && (
            <span
              className="text-xs font-semibold"
              style={{ color: "oklch(0.83 0.17 90)" }}
            >
              -{Math.round(((origPrice - salePrice) / origPrice) * 100)}%
            </span>
          )}
        </div>

        <Button
          data-ocid={`products.add_to_cart.${index + 1}`}
          onClick={() => onAddToCart(product.id)}
          disabled={isAdding || product.inStock === 0n}
          className="w-full h-9 text-sm font-semibold mt-auto transition-all hover:scale-[1.02]"
          style={{
            background:
              product.inStock === 0n
                ? "oklch(0.26 0.015 230)"
                : "oklch(0.79 0.14 189)",
            color:
              product.inStock === 0n
                ? "oklch(0.55 0.01 230)"
                : "oklch(0.1 0.005 230)",
            border: "none",
            boxShadow:
              product.inStock > 0n
                ? "0 0 16px oklch(0.79 0.14 189 / 0.3)"
                : "none",
          }}
        >
          {product.inStock === 0n ? (
            "Out of Stock"
          ) : (
            <span className="flex items-center gap-1.5 justify-center">
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
