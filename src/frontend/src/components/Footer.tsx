import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're subscribed! 🔥 Viral drops coming your way.");
    setEmail("");
  };

  return (
    <footer
      className="mt-8 pt-12 pb-8"
      style={{
        background: "oklch(0.11 0.005 230)",
        borderTop: "1px solid oklch(0.26 0.015 230 / 0.4)",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Support links */}
          <div>
            <h3
              className="font-display font-semibold text-sm uppercase tracking-widest mb-4"
              style={{ color: "oklch(0.79 0.14 189)" }}
            >
              Support
            </h3>
            <ul className="flex flex-col gap-2">
              {["FAQ", "Returns", "Contact Us", "About Us"].map((link) => (
                <li key={link}>
                  <a
                    href="/"
                    className="text-sm transition-colors hover:text-teal"
                    style={{ color: "oklch(0.72 0.01 230)" }}
                    data-ocid={`footer.${link.toLowerCase().replace(" ", "_")}.link`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className="font-display font-semibold text-sm uppercase tracking-widest mb-4"
              style={{ color: "oklch(0.79 0.14 189)" }}
            >
              Stay in the Loop
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "oklch(0.72 0.01 230)" }}
            >
              Get viral drops before they sell out. No spam, only heat.
            </p>
            <form onSubmit={handleSignup} className="flex gap-2">
              <Input
                data-ocid="footer.newsletter.input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-9 text-sm rounded-lg"
                style={{
                  background: "oklch(0.16 0.01 230)",
                  border: "1px solid oklch(0.26 0.015 230)",
                  color: "oklch(0.96 0.005 230)",
                }}
              />
              <Button
                data-ocid="footer.newsletter.submit_button"
                type="submit"
                size="sm"
                className="h-9 px-4 font-semibold text-sm shrink-0"
                style={{
                  background: "oklch(0.79 0.14 189)",
                  color: "oklch(0.1 0.005 230)",
                  border: "none",
                }}
              >
                Sign up
              </Button>
            </form>
          </div>

          {/* Social */}
          <div>
            <h3
              className="font-display font-semibold text-sm uppercase tracking-widest mb-4"
              style={{ color: "oklch(0.79 0.14 189)" }}
            >
              Follow the Hype
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "oklch(0.72 0.01 230)" }}
            >
              See our products go viral on social media.
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: SiTiktok, label: "TikTok" },
                { Icon: SiInstagram, label: "Instagram" },
                { Icon: SiYoutube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="/"
                  aria-label={label}
                  data-ocid={`footer.${label.toLowerCase()}.link`}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "oklch(0.22 0.015 230)",
                    color: "oklch(0.72 0.01 230)",
                    border: "1px solid oklch(0.26 0.015 230 / 0.6)",
                  }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-8 text-center text-xs"
          style={{
            borderTop: "1px solid oklch(0.26 0.015 230 / 0.4)",
            color: "oklch(0.55 0.01 230)",
          }}
        >
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "oklch(0.72 0.01 230)" }}
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
