import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ProductCategory } from "./backend.d";
import CartPanel from "./components/CartPanel";
import CategoryCards from "./components/CategoryCards";
import FlashSaleStrip from "./components/FlashSaleStrip";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";
import { useActor } from "./hooks/useActor";
import {
  useAddToCart,
  useCart,
  useFlashSale,
  useProducts,
  useSeedData,
} from "./hooks/useQueries";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function AppInner() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const { actor, isFetching } = useActor();
  const seedData = useSeedData();
  const seeded = useRef(false);

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: cartItems = [] } = useCart();
  const { data: flashSale } = useFlashSale();
  const addToCart = useAddToCart();
  const [addingId, setAddingId] = useState<bigint | null>(null);

  // Seed data on first load
  // biome-ignore lint/correctness/useExhaustiveDependencies: seedData.mutate is stable
  useEffect(() => {
    if (actor && !isFetching && !seeded.current) {
      seeded.current = true;
      if (products.length === 0) {
        seedData.mutate();
      }
    }
  }, [actor, isFetching, products.length]);

  const handleAddToCart = async (productId: bigint) => {
    setAddingId(productId);
    try {
      await addToCart.mutateAsync({ productId, quantity: 1n });
      toast.success("Added to cart! 🔥", { duration: 2000 });
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  const handleCategorySelect = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShopNow = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavChange = (section: string) => {
    if (section === "flash-sales") {
      document
        .getElementById("flash-sale-strip")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  return (
    <div className="min-h-screen font-body">
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavChange={handleNavChange}
      />

      <main>
        <HeroSection onShopNow={handleShopNow} />
        <CategoryCards onCategorySelect={handleCategorySelect} />
        <div ref={productsSectionRef}>
          <ProductsSection
            products={products}
            isLoading={productsLoading}
            onAddToCart={handleAddToCart}
            addingId={addingId}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
        <div id="flash-sale-strip">
          <FlashSaleStrip endTime={flashSale?.endTime} />
        </div>
      </main>

      <Footer />

      <CartPanel
        open={cartOpen}
        onOpenChange={setCartOpen}
        cartItems={cartItems}
        products={products}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.17 0.01 230)",
            border: "1px solid oklch(0.26 0.015 230)",
            color: "oklch(0.96 0.005 230)",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
