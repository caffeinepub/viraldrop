import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import {
  AlertTriangle,
  Database,
  Edit2,
  Flame,
  Loader2,
  LogOut,
  Package,
  Plus,
  Shield,
  ShieldOff,
  Tag,
  Trash2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { ProductBadge, ProductCategory, UserRole } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAssignAdminRole,
  useCreateFlashSale,
  useCreateProduct,
  useDeleteProduct,
  useIsCallerAdmin,
  useProducts,
  useSeedData,
  useUpdateProduct,
} from "../hooks/useQueries";

const CATEGORIES = [
  { value: ProductCategory.techGadgets, label: "Tech Gadgets" },
  { value: ProductCategory.homeEssentials, label: "Home Essentials" },
  { value: ProductCategory.fashion, label: "Fashion" },
  { value: ProductCategory.petGear, label: "Pet Gear" },
];

const BADGES = [
  { value: "none", label: "None" },
  { value: ProductBadge.hot, label: "🔥 Hot" },
  { value: ProductBadge.viral, label: "⚡ Viral" },
  { value: ProductBadge.new_, label: "✨ New" },
  { value: ProductBadge.sale, label: "🏷️ Sale" },
];

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: ProductCategory;
  badge: string;
  imageUrl: string;
  inStock: string;
  isTrending: boolean;
};

const defaultForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: ProductCategory.techGadgets,
  badge: "none",
  imageUrl: "",
  inStock: "100",
  isTrending: false,
};

function formToProduct(form: ProductFormData, existing?: Product): Product {
  return {
    id: existing?.id ?? 0n,
    name: form.name,
    description: form.description,
    price: BigInt(Math.round(Number.parseFloat(form.price) * 100)),
    originalPrice: form.originalPrice
      ? BigInt(Math.round(Number.parseFloat(form.originalPrice) * 100))
      : undefined,
    category: form.category,
    badge: form.badge !== "none" ? (form.badge as ProductBadge) : undefined,
    imageUrl: form.imageUrl,
    inStock: BigInt(Number.parseInt(form.inStock, 10) || 0),
    isTrending: form.isTrending,
    rating: existing?.rating ?? 0,
    reviewCount: existing?.reviewCount ?? 0n,
  };
}

function productToForm(p: Product): ProductFormData {
  return {
    name: p.name,
    description: p.description,
    price: (Number(p.price) / 100).toFixed(2),
    originalPrice: p.originalPrice
      ? (Number(p.originalPrice) / 100).toFixed(2)
      : "",
    category: p.category,
    badge: p.badge ?? "none",
    imageUrl: p.imageUrl,
    inStock: String(p.inStock),
    isTrending: p.isTrending,
  };
}

function badgeColor(badge?: ProductBadge | string) {
  switch (badge) {
    case ProductBadge.hot:
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case ProductBadge.viral:
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case ProductBadge.new_:
      return "bg-teal-500/20 text-teal-400 border-teal-500/30";
    case ProductBadge.sale:
      return "bg-pink-500/20 text-pink-400 border-pink-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = loginStatus === "success";

  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createFlashSale = useCreateFlashSale();
  const seedData = useSeedData();
  const assignAdmin = useAssignAdminRole();

  // Product form modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(defaultForm);

  // Delete confirm dialog
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Flash sale form
  const [fsProductIds, setFsProductIds] = useState<Set<bigint>>(new Set());
  const [fsDiscount, setFsDiscount] = useState("20");
  const [fsDuration, setFsDuration] = useState("60");

  // Assign admin
  const [adminPrincipal, setAdminPrincipal] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setForm(productToForm(editingProduct));
    } else {
      setForm(defaultForm);
    }
  }, [editingProduct]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setFormOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          product: formToProduct(form, editingProduct),
        });
        toast.success("Product updated!");
      } else {
        await createProduct.mutateAsync(formToProduct(form));
        toast.success("Product created!");
      }
      setFormOpen(false);
      setEditingProduct(null);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleFlashSale = async () => {
    if (fsProductIds.size === 0) {
      toast.error("Select at least one product");
      return;
    }
    try {
      await createFlashSale.mutateAsync({
        productIds: Array.from(fsProductIds),
        discountPercent: BigInt(Number.parseInt(fsDiscount, 10) || 0),
        durationMinutes: BigInt(Number.parseInt(fsDuration, 10) || 60),
      });
      toast.success("Flash sale started! 🔥");
      setFsProductIds(new Set());
    } catch {
      toast.error("Failed to create flash sale");
    }
  };

  const handleSeedData = async () => {
    try {
      await seedData.mutateAsync();
      toast.success("Sample data loaded!");
    } catch {
      toast.error("Failed to seed data");
    }
  };

  const handleAssignAdmin = async () => {
    if (!adminPrincipal.trim()) {
      toast.error("Enter a principal");
      return;
    }
    try {
      const principal = Principal.fromText(adminPrincipal.trim());
      await assignAdmin.mutateAsync({ user: principal, role: UserRole.admin });
      toast.success("Admin role assigned!");
      setAdminPrincipal("");
    } catch {
      toast.error("Invalid principal or failed to assign role");
    }
  };

  const toggleFsProduct = (id: bigint) => {
    setFsProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Loading / Auth states ──────────────────────────────────────────────────

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.10 0.005 230)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-4 rounded-2xl p-8 text-center"
          style={{
            background: "oklch(0.14 0.01 230)",
            border: "1px solid oklch(0.26 0.015 230)",
          }}
          data-ocid="admin.panel"
        >
          <Shield
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: "oklch(0.79 0.14 189)" }}
          />
          <h1
            className="font-display text-2xl font-bold mb-2"
            style={{ color: "oklch(0.96 0.005 230)" }}
          >
            Admin Panel
          </h1>
          <p className="text-sm mb-6" style={{ color: "oklch(0.62 0.01 230)" }}>
            Sign in with Internet Identity to manage your store.
          </p>
          <Button
            onClick={login}
            className="w-full font-semibold"
            disabled={loginStatus === "logging-in"}
            style={{
              background: "oklch(0.79 0.14 189)",
              color: "oklch(0.10 0.005 230)",
            }}
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-xs mt-4" style={{ color: "oklch(0.45 0.01 230)" }}>
            <a
              href="/"
              className="hover:underline"
              style={{ color: "oklch(0.62 0.01 230)" }}
            >
              ← Back to store
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          Checking permissions…
        </span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.10 0.005 230)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full mx-4 rounded-2xl p-8 text-center"
          style={{
            background: "oklch(0.14 0.01 230)",
            border: "1px solid oklch(0.4 0.22 25 / 0.4)",
          }}
          data-ocid="admin.panel"
        >
          <ShieldOff
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: "oklch(0.65 0.28 25)" }}
          />
          <h2
            className="font-display text-xl font-bold mb-2"
            style={{ color: "oklch(0.96 0.005 230)" }}
          >
            Access Denied
          </h2>
          <p className="text-sm mb-2" style={{ color: "oklch(0.62 0.01 230)" }}>
            Your account doesn't have admin permissions yet.
          </p>
          <p
            className="text-xs mb-6 font-mono px-3 py-2 rounded-lg"
            style={{
              background: "oklch(0.10 0.005 230)",
              color: "oklch(0.72 0.01 230)",
              border: "1px solid oklch(0.26 0.015 230)",
            }}
          >
            {identity?.getPrincipal().toString()}
          </p>
          <p className="text-xs mb-4" style={{ color: "oklch(0.55 0.01 230)" }}>
            To grant yourself admin access, ask the current admin to assign the
            admin role to the principal shown above.
          </p>

          {/* Self-assign section for first-time setup */}
          <div
            className="rounded-xl p-4 mb-4 text-left"
            style={{
              background: "oklch(0.12 0.005 230)",
              border: "1px solid oklch(0.26 0.015 230)",
            }}
          >
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "oklch(0.79 0.14 189)" }}
            >
              First-time setup
            </p>
            <p
              className="text-xs mb-3"
              style={{ color: "oklch(0.55 0.01 230)" }}
            >
              Enter the principal to assign admin role (use your own principal
              above):
            </p>
            <div className="flex gap-2">
              <Input
                value={adminPrincipal}
                onChange={(e) => setAdminPrincipal(e.target.value)}
                placeholder="Principal text…"
                className="text-xs h-8"
                data-ocid="admin.input"
              />
              <Button
                size="sm"
                onClick={handleAssignAdmin}
                disabled={assignAdmin.isPending}
                data-ocid="admin.submit_button"
              >
                {assignAdmin.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Assign"
                )}
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            className="w-full"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  const uniqueCategories = new Set(products.map((p) => p.category)).size;

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "oklch(0.09 0.005 230)" }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "oklch(0.12 0.005 230)",
          borderBottom: "1px solid oklch(0.26 0.015 230 / 0.5)",
        }}
      >
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2"
              data-ocid="admin.link"
            >
              <img
                src="/assets/generated/viraldrop-logo-transparent.dim_80x80.png"
                alt="ViralDrop"
                className="h-7 w-7 object-contain"
              />
            </a>
            <span className="text-sm" style={{ color: "oklch(0.46 0.01 230)" }}>
              /
            </span>
            <span
              className="font-display font-semibold text-sm"
              style={{ color: "oklch(0.79 0.14 189)" }}
            >
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono hidden sm:block"
              style={{ color: "oklch(0.46 0.01 230)" }}
            >
              {identity?.getPrincipal().toString().slice(0, 20)}…
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              data-ocid="admin.secondary_button"
            >
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          data-ocid="admin.section"
        >
          {[
            {
              icon: Package,
              label: "Total Products",
              value: products.length,
              color: "oklch(0.79 0.14 189)",
            },
            {
              icon: Tag,
              label: "Categories",
              value: uniqueCategories,
              color: "oklch(0.65 0.28 320)",
            },
            {
              icon: Flame,
              label: "Trending Products",
              value: products.filter((p) => p.isTrending).length,
              color: "oklch(0.83 0.17 90)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-5 flex items-center gap-4"
              style={{
                background: "oklch(0.14 0.01 230)",
                border: "1px solid oklch(0.26 0.015 230)",
              }}
              data-ocid="admin.card"
            >
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${stat.color.replace(")", " / 0.15)")}` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p
                  className="text-2xl font-display font-bold"
                  style={{ color: "oklch(0.96 0.005 230)" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.01 230)" }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Products Table */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.14 0.01 230)",
            border: "1px solid oklch(0.26 0.015 230)",
          }}
          data-ocid="admin.section"
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "oklch(0.26 0.015 230)" }}
          >
            <h2
              className="font-display font-semibold text-lg"
              style={{ color: "oklch(0.96 0.005 230)" }}
            >
              Products
            </h2>
            <Button
              size="sm"
              onClick={handleOpenAdd}
              style={{
                background: "oklch(0.79 0.14 189)",
                color: "oklch(0.10 0.005 230)",
              }}
              data-ocid="admin.primary_button"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </div>

          {productsLoading ? (
            <div
              className="flex items-center justify-center py-16"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="admin.empty_state"
            >
              <Package
                className="h-10 w-10 mb-3"
                style={{ color: "oklch(0.35 0.01 230)" }}
              />
              <p style={{ color: "oklch(0.55 0.01 230)" }}>
                No products yet. Add one or seed sample data.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow style={{ borderColor: "oklch(0.26 0.015 230)" }}>
                    {[
                      "Name",
                      "Category",
                      "Price",
                      "Badge",
                      "Stock",
                      "Trending",
                      "Actions",
                    ].map((h) => (
                      <TableHead
                        key={h}
                        style={{ color: "oklch(0.55 0.01 230)" }}
                        className="text-xs uppercase tracking-wider"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, idx) => (
                    <TableRow
                      key={String(product.id)}
                      style={{ borderColor: "oklch(0.20 0.01 230)" }}
                      className="hover:bg-white/[0.02] transition-colors"
                      data-ocid={`admin.item.${idx + 1}`}
                    >
                      <TableCell
                        className="font-medium text-sm max-w-[200px] truncate"
                        style={{ color: "oklch(0.96 0.005 230)" }}
                      >
                        <div className="flex items-center gap-2">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-8 w-8 rounded object-cover shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          <span className="truncate">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        className="text-sm"
                        style={{ color: "oklch(0.72 0.01 230)" }}
                      >
                        {CATEGORIES.find((c) => c.value === product.category)
                          ?.label ?? product.category}
                      </TableCell>
                      <TableCell
                        className="text-sm font-mono"
                        style={{ color: "oklch(0.79 0.14 189)" }}
                      >
                        ${(Number(product.price) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {product.badge ? (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badgeColor(
                              product.badge,
                            )}`}
                          >
                            {product.badge}
                          </span>
                        ) : (
                          <span
                            className="text-xs"
                            style={{ color: "oklch(0.35 0.01 230)" }}
                          >
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell
                        className="text-sm font-mono"
                        style={{ color: "oklch(0.72 0.01 230)" }}
                      >
                        {String(product.inStock)}
                      </TableCell>
                      <TableCell>
                        {product.isTrending ? (
                          <span
                            className="text-xs"
                            style={{ color: "oklch(0.83 0.17 90)" }}
                          >
                            ✓ Yes
                          </span>
                        ) : (
                          <span
                            className="text-xs"
                            style={{ color: "oklch(0.35 0.01 230)" }}
                          >
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(product)}
                            className="h-7 w-7 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                            style={{ color: "oklch(0.72 0.01 230)" }}
                            data-ocid={`admin.edit_button.${idx + 1}`}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            className="h-7 w-7 rounded flex items-center justify-center hover:bg-red-500/10 transition-colors"
                            style={{ color: "oklch(0.65 0.28 25)" }}
                            data-ocid={`admin.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.section>

        {/* Flash Sale + Tools row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flash Sale Panel */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.14 0.01 230)",
              border: "1px solid oklch(0.26 0.015 230)",
            }}
            data-ocid="admin.section"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap
                className="h-5 w-5"
                style={{ color: "oklch(0.83 0.17 90)" }}
              />
              <h2
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.96 0.005 230)" }}
              >
                Create Flash Sale
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label
                  className="text-xs mb-1 block"
                  style={{ color: "oklch(0.62 0.01 230)" }}
                >
                  Discount %
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="99"
                  value={fsDiscount}
                  onChange={(e) => setFsDiscount(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label
                  className="text-xs mb-1 block"
                  style={{ color: "oklch(0.62 0.01 230)" }}
                >
                  Duration (minutes)
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={fsDuration}
                  onChange={(e) => setFsDuration(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="admin.input"
                />
              </div>
            </div>

            <p
              className="text-xs mb-2"
              style={{ color: "oklch(0.55 0.01 230)" }}
            >
              Select products to include:
            </p>
            <div
              className="max-h-40 overflow-y-auto space-y-1 mb-4 rounded-lg p-2"
              style={{ background: "oklch(0.10 0.005 230)" }}
            >
              {products.length === 0 ? (
                <p
                  className="text-xs text-center py-4"
                  style={{ color: "oklch(0.35 0.01 230)" }}
                >
                  No products available
                </p>
              ) : (
                products.map((p) => (
                  <label
                    key={String(p.id)}
                    htmlFor={`fs-product-${p.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-white/5"
                  >
                    <Checkbox
                      id={`fs-product-${p.id}`}
                      checked={fsProductIds.has(p.id)}
                      onCheckedChange={() => toggleFsProduct(p.id)}
                      data-ocid="admin.checkbox"
                    />
                    <span
                      className="text-sm truncate"
                      style={{ color: "oklch(0.82 0.005 230)" }}
                    >
                      {p.name}
                    </span>
                    <span
                      className="text-xs ml-auto font-mono shrink-0"
                      style={{ color: "oklch(0.55 0.01 230)" }}
                    >
                      ${(Number(p.price) / 100).toFixed(2)}
                    </span>
                  </label>
                ))
              )}
            </div>

            <Button
              className="w-full font-semibold"
              onClick={handleFlashSale}
              disabled={createFlashSale.isPending || fsProductIds.size === 0}
              style={{
                background: "oklch(0.83 0.17 90)",
                color: "oklch(0.10 0.005 230)",
              }}
              data-ocid="admin.submit_button"
            >
              {createFlashSale.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Start Flash Sale ({fsProductIds.size} selected)
            </Button>
          </motion.section>

          {/* Tools column */}
          <div className="space-y-6">
            {/* Seed Data */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl p-6"
              style={{
                background: "oklch(0.14 0.01 230)",
                border: "1px solid oklch(0.26 0.015 230)",
              }}
              data-ocid="admin.section"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database
                  className="h-5 w-5"
                  style={{ color: "oklch(0.65 0.28 320)" }}
                />
                <h2
                  className="font-display font-semibold text-base"
                  style={{ color: "oklch(0.96 0.005 230)" }}
                >
                  Seed Sample Data
                </h2>
              </div>
              <p
                className="text-xs mb-4"
                style={{ color: "oklch(0.55 0.01 230)" }}
              >
                Reset and populate the store with sample viral products.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSeedData}
                disabled={seedData.isPending}
                data-ocid="admin.primary_button"
              >
                {seedData.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Database className="mr-2 h-4 w-4" />
                )}
                Load Sample Products
              </Button>
            </motion.section>

            {/* Assign Admin */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-6"
              style={{
                background: "oklch(0.14 0.01 230)",
                border: "1px solid oklch(0.26 0.015 230)",
              }}
              data-ocid="admin.section"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield
                  className="h-5 w-5"
                  style={{ color: "oklch(0.79 0.14 189)" }}
                />
                <h2
                  className="font-display font-semibold text-base"
                  style={{ color: "oklch(0.96 0.005 230)" }}
                >
                  Assign Admin Role
                </h2>
              </div>
              <p
                className="text-xs mb-4"
                style={{ color: "oklch(0.55 0.01 230)" }}
              >
                Enter a Principal to grant admin access.
              </p>
              <div className="flex gap-2">
                <Input
                  value={adminPrincipal}
                  onChange={(e) => setAdminPrincipal(e.target.value)}
                  placeholder="xxxx-xxxx-…"
                  className="text-xs h-9"
                  data-ocid="admin.input"
                />
                <Button
                  size="sm"
                  onClick={handleAssignAdmin}
                  disabled={assignAdmin.isPending}
                  className="shrink-0"
                  data-ocid="admin.submit_button"
                >
                  {assignAdmin.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Assign"
                  )}
                </Button>
              </div>
              <p
                className="text-xs mt-2"
                style={{ color: "oklch(0.45 0.01 230)" }}
              >
                Your principal:{" "}
                <span className="font-mono">
                  {identity?.getPrincipal().toString()}
                </span>
              </p>
            </motion.section>
          </div>
        </div>
      </main>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          style={{
            background: "oklch(0.14 0.01 230)",
            border: "1px solid oklch(0.26 0.015 230)",
          }}
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "oklch(0.96 0.005 230)" }}>
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{ color: "oklch(0.62 0.01 230)" }}
              >
                Product Name *
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Magnetic Phone Mount Pro"
                data-ocid="admin.input"
              />
            </div>

            <div>
              <Label
                className="text-xs mb-1 block"
                style={{ color: "oklch(0.62 0.01 230)" }}
              >
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Short product description…"
                rows={3}
                className="resize-none"
                data-ocid="admin.textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  className="text-xs mb-1 block"
                  style={{ color: "oklch(0.62 0.01 230)" }}
                >
                  Price (USD) *
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="29.99"
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label
                  className="text-xs mb-1 block"
                  style={{ color: "oklch(0.62 0.01 230)" }}
                >
                  Original Price (USD)
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, originalPrice: e.target.value }))
                  }
                  placeholder="49.99 (optional)"
                  data-ocid="admin.input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  className="text-xs mb-1 block"
                  style={{ color: "oklch(0.62 0.01 230)" }}
                >
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, category: v as ProductCategory }))
                  }
                >
                  <SelectTrigger data-ocid="admin.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  className="text-xs mb-1 block"
                  style={{ color: "oklch(0.62 0.01 230)" }}
                >
                  Badge
                </Label>
                <Select
                  value={form.badge}
                  onValueChange={(v) => setForm((f) => ({ ...f, badge: v }))}
                >
                  <SelectTrigger data-ocid="admin.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BADGES.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label
                className="text-xs mb-1 block"
                style={{ color: "oklch(0.62 0.01 230)" }}
              >
                Image URL
              </Label>
              <Input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://example.com/product.jpg"
                data-ocid="admin.input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <Label
                  className="text-xs mb-1 block"
                  style={{ color: "oklch(0.62 0.01 230)" }}
                >
                  Stock Quantity
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={form.inStock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, inStock: e.target.value }))
                  }
                  data-ocid="admin.input"
                />
              </div>
              <label
                htmlFor="form-trending"
                className="flex items-center gap-2 cursor-pointer pb-2"
              >
                <Checkbox
                  id="form-trending"
                  checked={form.isTrending}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isTrending: !!v }))
                  }
                  data-ocid="admin.checkbox"
                />
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.82 0.005 230)" }}
                >
                  Trending
                </span>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setFormOpen(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={createProduct.isPending || updateProduct.isPending}
              style={{
                background: "oklch(0.79 0.14 189)",
                color: "oklch(0.10 0.005 230)",
              }}
              data-ocid="admin.save_button"
            >
              {createProduct.isPending || updateProduct.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent
          className="max-w-sm"
          style={{
            background: "oklch(0.14 0.01 230)",
            border: "1px solid oklch(0.4 0.22 25 / 0.4)",
          }}
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2"
              style={{ color: "oklch(0.96 0.005 230)" }}
            >
              <AlertTriangle
                className="h-5 w-5"
                style={{ color: "oklch(0.65 0.28 25)" }}
              />
              Delete Product
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: "oklch(0.72 0.01 230)" }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "oklch(0.96 0.005 230)" }}>
              {deleteTarget?.name}
            </strong>
            ? This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
              style={{
                background: "oklch(0.65 0.28 25)",
                color: "white",
              }}
              data-ocid="admin.delete_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
