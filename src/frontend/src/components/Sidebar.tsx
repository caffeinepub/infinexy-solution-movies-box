import { Film, Grid, Settings, X } from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  type Category,
  type NavView,
} from "../types";

interface SidebarProps {
  activeView: NavView;
  onViewChange: (view: NavView) => void;
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

export function Sidebar({
  activeView,
  onViewChange,
  isOpen,
  onClose,
  isAdmin,
}: SidebarProps) {
  const navItem = (view: NavView, label: string, icon?: React.ReactNode) => {
    const isActive = activeView === view;
    return (
      <button
        key={view}
        type="button"
        onClick={() => {
          onViewChange(view);
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
        style={{
          background: isActive ? "#D2B04C" : "transparent",
          color: isActive ? "#0B1220" : "#AAB6C6",
        }}
        data-ocid={`nav.${view}.link`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0A1424", borderRight: "1px solid #22324A" }}
      >
        {/* Brand */}
        <div className="p-4 border-b" style={{ borderColor: "#22324A" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(210,176,76,0.15)" }}
              >
                <Film className="w-5 h-5" style={{ color: "#D2B04C" }} />
              </div>
              <div>
                <p
                  className="text-xs font-black leading-tight uppercase tracking-wide"
                  style={{ color: "#D2B04C" }}
                >
                  Infinexy Solution
                </p>
                <p
                  className="text-xs font-semibold leading-tight uppercase tracking-wide"
                  style={{ color: "#7F8CA3" }}
                >
                  Movies Box
                </p>
              </div>
            </div>
            <button
              type="button"
              className="lg:hidden text-[#7F8CA3] hover:text-[#E8EEF7]"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Movies Library */}
          <div>
            <p
              className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "#7F8CA3" }}
            >
              Movies Library
            </p>
            <div className="space-y-0.5">
              {navItem("all", "All Movies", <Grid className="w-4 h-4" />)}
              {CATEGORIES.map((cat) =>
                navItem(
                  cat,
                  `${cat} Movies`,
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ background: CATEGORY_COLORS[cat] }}
                  />,
                ),
              )}
            </div>
          </div>

          {/* Manage — admin only */}
          {isAdmin && (
            <div>
              <p
                className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "#7F8CA3" }}
              >
                Manage
              </p>
              <div className="space-y-0.5">
                {navItem(
                  "manage",
                  "Management Panel",
                  <Settings className="w-4 h-4" />,
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t" style={{ borderColor: "#22324A" }}>
          <p className="text-[11px] text-center" style={{ color: "#7F8CA3" }}>
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "#D2B04C" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </aside>
    </>
  );
}
