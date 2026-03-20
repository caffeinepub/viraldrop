import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import type { CartItem, Product } from "../backend.d";
import { useRemoveFromCart, useUpdateCartQuantity } from "../hooks/useQueries";

interface CartPanelProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cartItems: CartItem[];
  products: Product[];
}

export default function CartPanel({
  open,
  onOpenChange,
  cartItems,
  products,
}: CartPanelProps) {
  const updateQty = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();

  const getProduct = (id: bigint) => products.find((p) => p.id === id);

  const total = cartItems.reduce((sum, item) => {
    const p = getProduct(item.productId);
    return sum + (p ? Number(p.price) * Number(item.quantity) : 0);
  }, 0);

  const handleRemove = async (productId: bigint) => {
    try {
      await removeItem.mutateAsync(productId);
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQty = async (productId: bigint, quantity: bigint) => {
    if (quantity <= 0n) {
      await handleRemove(productId);
      return;
    }
    try {
      await updateQty.mutateAsync({ productId, quantity });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
        style={{
          background: "oklch(0.12 0.005 230)",
          border: "none",
          borderLeft: "1px solid oklch(0.26 0.015 230)",
        }}
        data-ocid="cart.sheet"
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle
            className="flex items-center gap-2 font-display font-bold text-xl"
            style={{ color: "oklch(0.96 0.005 230)" }}
          >
            <ShoppingBag
              className="h-5 w-5"
              style={{ color: "oklch(0.79 0.14 189)" }}
            />
            Your Cart
            {cartItems.length > 0 && (
              <span
                className="ml-auto text-sm font-normal px-2.5 py-0.5 rounded-full"
                style={{
                  background: "oklch(0.79 0.14 189 / 0.15)",
                  color: "oklch(0.79 0.14 189)",
                }}
              >
                {cartItems.length} items
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <Separator style={{ background: "oklch(0.26 0.015 230 / 0.5)" }} />

        {cartItems.length === 0 ? (
          <div
            data-ocid="cart.empty_state"
            className="flex flex-col items-center justify-center flex-1 gap-4 p-8"
          >
            <ShoppingBag
              className="h-12 w-12"
              style={{ color: "oklch(0.4 0.01 230)" }}
            />
            <p
              className="font-semibold"
              style={{ color: "oklch(0.72 0.01 230)" }}
            >
              Your cart is empty
            </p>
            <p
              className="text-sm text-center"
              style={{ color: "oklch(0.55 0.01 230)" }}
            >
              Add some viral products to get started!
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {cartItems.map((item, i) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                const price = Number(product.price) / 100;
                return (
                  <div
                    key={String(item.productId)}
                    data-ocid={`cart.item.${i + 1}`}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{ background: "oklch(0.17 0.01 230)" }}
                  >
                    <img
                      src={
                        product.imageUrl ||
                        `https://picsum.photos/seed/${product.id}/400/400`
                      }
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "oklch(0.96 0.005 230)" }}
                      >
                        {product.name}
                      </p>
                      <p
                        className="text-sm font-bold mt-1"
                        style={{ color: "oklch(0.79 0.14 189)" }}
                      >
                        ${price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          data-ocid={`cart.qty_decrease.${i + 1}`}
                          onClick={() =>
                            handleQty(item.productId, item.quantity - 1n)
                          }
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          style={{
                            background: "oklch(0.26 0.015 230)",
                            color: "oklch(0.96 0.005 230)",
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span
                          className="text-sm font-semibold w-6 text-center"
                          style={{ color: "oklch(0.96 0.005 230)" }}
                        >
                          {String(item.quantity)}
                        </span>
                        <button
                          type="button"
                          data-ocid={`cart.qty_increase.${i + 1}`}
                          onClick={() =>
                            handleQty(item.productId, item.quantity + 1n)
                          }
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          style={{
                            background: "oklch(0.26 0.015 230)",
                            color: "oklch(0.96 0.005 230)",
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-ocid={`cart.delete_button.${i + 1}`}
                      onClick={() => handleRemove(item.productId)}
                      className="self-start p-1 rounded-lg transition-colors"
                      style={{ color: "oklch(0.55 0.01 230)" }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div
              className="p-6 pt-4 flex flex-col gap-4"
              style={{ borderTop: "1px solid oklch(0.26 0.015 230 / 0.5)" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-semibold"
                  style={{ color: "oklch(0.72 0.01 230)" }}
                >
                  Total
                </span>
                <span
                  className="font-display font-bold text-xl"
                  style={{ color: "oklch(0.79 0.14 189)" }}
                >
                  ${(total / 100).toFixed(2)}
                </span>
              </div>
              <Button
                data-ocid="cart.checkout_button"
                className="w-full h-11 font-bold text-sm uppercase tracking-wide"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.28 320), oklch(0.52 0.27 285))",
                  color: "white",
                  border: "none",
                  boxShadow: "0 0 20px oklch(0.65 0.28 320 / 0.4)",
                }}
              >
                Checkout – ${(total / 100).toFixed(2)}
              </Button>
              <p
                className="text-xs text-center"
                style={{ color: "oklch(0.55 0.01 230)" }}
              >
                Free shipping on orders over $50
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
