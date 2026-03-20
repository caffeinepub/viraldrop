import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { type Product, ProductCategory } from "../backend.d";
import ProductCard from "./ProductCard";

const CATEGORIES = [
  { id: ProductCategory.techGadgets, label: "Tech Gadgets" },
  { id: ProductCategory.homeEssentials, label: "Home Essentials" },
  { id: ProductCategory.fashion, label: "Fashion" },
  { id: ProductCategory.petGear, label: "Pet Gear" },
];

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 2500 },
  { label: "$25 – $50", min: 2500, max: 5000 },
  { label: "$50 – $100", min: 5000, max: 10000 },
  { label: "$100+", min: 10000, max: Number.POSITIVE_INFINITY },
];

interface ProductsSectionProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (id: bigint) => void;
  addingId?: bigint | null;
  selectedCategory?: ProductCategory | null;
  searchQuery?: string;
}

export default function ProductsSection({
  products,
  isLoading,
  onAddToCart,
  addingId,
  selectedCategory,
  searchQuery,
}: ProductsSectionProps) {
  const [filterCat, setFilterCat] = useState<ProductCategory | null>(
    selectedCategory ?? null,
  );
  const [filterPrice, setFilterPrice] = useState<number | null>(null);
  const [filterRating, setFilterRating] = useState<number>(0);
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true,
    trend: true,
  });

  const toggleSection = (s: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filterCat && p.category !== filterCat) return false;
      if (filterPrice !== null) {
        const range = PRICE_RANGES[filterPrice];
        const price = Number(p.price);
        if (price < range.min || price >= range.max) return false;
      }
      if (filterRating > 0 && p.rating < filterRating) return false;
      if (trendingOnly && !p.isTrending) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [
    products,
    filterCat,
    filterPrice,
    filterRating,
    trendingOnly,
    searchQuery,
  ]);

  const filterBg = {
    background: "oklch(0.17 0.01 230)",
    border: "1px solid oklch(0.26 0.015 230 / 0.6)",
  };

  return (
    <section className="py-12" id="products">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold uppercase tracking-widest mb-8"
          style={{ fontSize: "1.5rem", color: "oklch(0.96 0.005 230)" }}
        >
          <span style={{ color: "oklch(0.65 0.28 320)" }}>HOT DROPS</span> –
          TRENDING NOW
        </motion.h2>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <div
              className="rounded-2xl p-4 flex flex-col gap-4"
              style={filterBg}
            >
              <div
                className="flex items-center gap-2"
                style={{ color: "oklch(0.96 0.005 230)" }}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="font-semibold text-sm">Filters</span>
              </div>

              {/* Category */}
              <div>
                <button
                  type="button"
                  data-ocid="filters.category.toggle"
                  className="flex items-center justify-between w-full text-sm font-semibold mb-2"
                  style={{ color: "oklch(0.96 0.005 230)" }}
                  onClick={() => toggleSection("category")}
                >
                  Category
                  {openSections.category ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
                {openSections.category && (
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setFilterCat(null)}
                      className="text-xs text-left px-2 py-1.5 rounded-lg transition-colors"
                      style={{
                        background: !filterCat
                          ? "oklch(0.79 0.14 189 / 0.15)"
                          : "transparent",
                        color: !filterCat
                          ? "oklch(0.79 0.14 189)"
                          : "oklch(0.72 0.01 230)",
                      }}
                      data-ocid="filters.category.all"
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setFilterCat(c.id)}
                        className="text-xs text-left px-2 py-1.5 rounded-lg transition-colors"
                        style={{
                          background:
                            filterCat === c.id
                              ? "oklch(0.79 0.14 189 / 0.15)"
                              : "transparent",
                          color:
                            filterCat === c.id
                              ? "oklch(0.79 0.14 189)"
                              : "oklch(0.72 0.01 230)",
                        }}
                        data-ocid="filters.category.select"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{ borderTop: "1px solid oklch(0.26 0.015 230 / 0.5)" }}
              />

              {/* Price */}
              <div>
                <button
                  type="button"
                  data-ocid="filters.price.toggle"
                  className="flex items-center justify-between w-full text-sm font-semibold mb-2"
                  style={{ color: "oklch(0.96 0.005 230)" }}
                  onClick={() => toggleSection("price")}
                >
                  Price Range
                  {openSections.price ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
                {openSections.price && (
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setFilterPrice(null)}
                      className="text-xs text-left px-2 py-1.5 rounded-lg"
                      style={{
                        background:
                          filterPrice === null
                            ? "oklch(0.79 0.14 189 / 0.15)"
                            : "transparent",
                        color:
                          filterPrice === null
                            ? "oklch(0.79 0.14 189)"
                            : "oklch(0.72 0.01 230)",
                      }}
                    >
                      Any Price
                    </button>
                    {PRICE_RANGES.map((r, i) => (
                      <button
                        type="button"
                        key={r.label}
                        onClick={() => setFilterPrice(i)}
                        className="text-xs text-left px-2 py-1.5 rounded-lg"
                        style={{
                          background:
                            filterPrice === i
                              ? "oklch(0.79 0.14 189 / 0.15)"
                              : "transparent",
                          color:
                            filterPrice === i
                              ? "oklch(0.79 0.14 189)"
                              : "oklch(0.72 0.01 230)",
                        }}
                        data-ocid="filters.price.select"
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{ borderTop: "1px solid oklch(0.26 0.015 230 / 0.5)" }}
              />

              {/* Rating */}
              <div>
                <button
                  type="button"
                  data-ocid="filters.rating.toggle"
                  className="flex items-center justify-between w-full text-sm font-semibold mb-2"
                  style={{ color: "oklch(0.96 0.005 230)" }}
                  onClick={() => toggleSection("rating")}
                >
                  Min Rating
                  {openSections.rating ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
                {openSections.rating && (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() =>
                          setFilterRating(filterRating === r ? 0 : r)
                        }
                        className="text-sm"
                        style={{ opacity: r <= filterRating ? 1 : 0.35 }}
                        data-ocid="filters.rating.select"
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{ borderTop: "1px solid oklch(0.26 0.015 230 / 0.5)" }}
              />

              {/* Trending */}
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="trending-switch"
                  className="text-sm"
                  style={{ color: "oklch(0.96 0.005 230)" }}
                >
                  Trending Only
                </Label>
                <Switch
                  id="trending-switch"
                  data-ocid="filters.trending.switch"
                  checked={trendingOnly}
                  onCheckedChange={setTrendingOnly}
                  style={
                    trendingOnly ? { background: "oklch(0.79 0.14 189)" } : {}
                  }
                />
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => (
                  <div
                    key={sk}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "oklch(0.17 0.01 230)" }}
                  >
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4 flex flex-col gap-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                data-ocid="products.empty_state"
                className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl"
                style={{ background: "oklch(0.17 0.01 230)" }}
              >
                <span className="text-4xl">🔍</span>
                <p
                  className="font-semibold"
                  style={{ color: "oklch(0.96 0.005 230)" }}
                >
                  No products found
                </p>
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.72 0.01 230)" }}
                >
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product, i) => (
                  <ProductCard
                    key={String(product.id)}
                    product={product}
                    index={i}
                    onAddToCart={onAddToCart}
                    isAdding={addingId === product.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
