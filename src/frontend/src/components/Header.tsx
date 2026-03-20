import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search, Settings, ShoppingCart, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavChange: (section: string) => void;
}

export default function Header({
  cartCount,
  onCartOpen,
  searchQuery,
  onSearchChange,
  onNavChange,
}: HeaderProps) {
  const [activeNav, setActiveNav] = useState("new-drops");

  const handleNav = (key: string) => {
    setActiveNav(key);
    onNavChange(key);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "oklch(0.12 0.005 230)",
        borderBottom: "1px solid oklch(0.26 0.015 230 / 0.5)",
      }}
    >
      {/* Top bar */}
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/viraldrop-logo-transparent.dim_80x80.png"
              alt="ViralDrop"
              className="h-8 w-8 object-contain"
            />
            <span
              className="font-display font-bold text-xl tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.79 0.14 189), oklch(0.65 0.28 320))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ViralDrop
            </span>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: "oklch(0.72 0.01 230)" }}
              />
              <Input
                data-ocid="header.search_input"
                placeholder="Search trending products…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 h-9 rounded-full text-sm"
                style={{
                  background: "oklch(0.16 0.01 230)",
                  border: "1px solid oklch(0.26 0.015 230)",
                  color: "oklch(0.96 0.005 230)",
                }}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "oklch(0.72 0.01 230)" }}
              data-ocid="header.account_button"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </Button>

            <a
              href="/admin"
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors hover:bg-white/5"
              style={{ color: "oklch(0.55 0.01 230)" }}
              data-ocid="nav.admin.link"
              title="Admin Panel"
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </a>

            <Button
              variant="ghost"
              size="sm"
              className="relative"
              style={{ color: "oklch(0.72 0.01 230)" }}
              onClick={onCartOpen}
              data-ocid="header.cart_button"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "oklch(0.65 0.28 320)", color: "white" }}
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Nav row */}
      <nav
        className="border-t"
        style={{
          borderColor: "oklch(0.26 0.015 230 / 0.3)",
          background: "oklch(0.11 0.005 230)",
        }}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-1 h-11">
            {[
              { key: "new-drops", label: "New Drops" },
              { key: "best-sellers", label: "Best Sellers" },
              { key: "flash-sales", label: "Flash Sales" },
            ].map((item) => (
              <button
                type="button"
                key={item.key}
                data-ocid={`nav.${item.key.replace("-", "_")}.link`}
                onClick={() => handleNav(item.key)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors relative"
                style={{
                  color:
                    activeNav === item.key
                      ? "oklch(0.79 0.14 189)"
                      : "oklch(0.72 0.01 230)",
                }}
              >
                {item.label}
                {activeNav === item.key && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: "oklch(0.79 0.14 189)" }}
                  />
                )}
              </button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="nav.categories.link"
                  className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1"
                  style={{ color: "oklch(0.72 0.01 230)" }}
                >
                  Categories
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Chevron down</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                style={{
                  background: "oklch(0.17 0.01 230)",
                  border: "1px solid oklch(0.26 0.015 230)",
                }}
              >
                {["Tech Gadgets", "Home Essentials", "Fashion", "Pet Gear"].map(
                  (cat) => (
                    <DropdownMenuItem
                      key={cat}
                      className="cursor-pointer"
                      style={{ color: "oklch(0.96 0.005 230)" }}
                      onClick={() =>
                        handleNav(`cat-${cat.toLowerCase().replace(" ", "-")}`)
                      }
                      data-ocid="nav.categories.dropdown_menu"
                    >
                      {cat}
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}
