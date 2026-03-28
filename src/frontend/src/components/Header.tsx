import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Film,
  Link2,
  LogOut,
  Menu,
  Search,
  Shield,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onUploadClick: () => void;
  onMenuClick: () => void;
  isAdmin: boolean;
  onAdminLoginClick: () => void;
  onLogout: () => void;
}

function ShareButton() {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Infinexy Solution Movies Box",
          text: "Check out this movie collection!",
          url,
        });
        return;
      } catch {
        // user cancelled or unsupported — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!", {
        description:
          "Share this link with anyone to let them browse the movie collection.",
      });
    } catch {
      toast.error(
        "Could not copy link. Please copy it manually from your browser.",
      );
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleShare}
      className="shrink-0 text-xs px-3 font-semibold"
      style={{ color: "#AAB6C6", border: "1px solid #22324A" }}
      title="Share this Movies Box"
      data-ocid="header.share_button"
    >
      <Link2 className="w-4 h-4 sm:mr-1.5" style={{ color: "#D2B04C" }} />
      <span className="hidden sm:inline">Share</span>
    </Button>
  );
}

export function Header({
  searchQuery,
  onSearchChange,
  onUploadClick,
  onMenuClick,
  isAdmin,
  onAdminLoginClick,
  onLogout,
}: HeaderProps) {
  return (
    <header
      className="flex items-center gap-3 px-4 py-3 border-b sticky top-0 z-30"
      style={{
        background: "#0A1424",
        borderColor: "#22324A",
      }}
    >
      <button
        type="button"
        className="lg:hidden p-2 rounded text-[#AAB6C6] hover:text-[#E8EEF7] transition-colors"
        onClick={onMenuClick}
        aria-label="Toggle menu"
        data-ocid="nav.toggle"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Brand - mobile only */}
      <div className="lg:hidden flex items-center gap-2 mr-auto">
        <Film className="w-5 h-5" style={{ color: "#D2B04C" }} />
        <span className="text-sm font-bold" style={{ color: "#D2B04C" }}>
          IMB
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "#7F8CA3" }}
        />
        <Input
          placeholder="Search movies, directors, genres…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 text-sm"
          style={{
            background: "#111E31",
            borderColor: "#263A55",
            color: "#E8EEF7",
          }}
          data-ocid="header.search_input"
        />
      </div>

      {/* Right-side controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Share button — always visible */}
        <ShareButton />

        {isAdmin ? (
          <>
            {/* Admin badge */}
            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: "#22c55e", color: "#fff" }}
              data-ocid="admin.badge"
            >
              <Shield className="w-3 h-3" />
              Admin
            </span>

            {/* Upload button — admin only */}
            <Button
              onClick={onUploadClick}
              className="shrink-0 font-bold uppercase text-xs tracking-wider px-4"
              style={{
                background: "#D2B04C",
                color: "#0B1220",
              }}
              data-ocid="header.upload_button"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Upload Movie</span>
              <span className="sm:hidden">Upload</span>
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              onClick={onLogout}
              className="shrink-0 text-xs px-3 font-semibold"
              style={{ color: "#ff6b6b", border: "1px solid #3A2222" }}
              title="Logout from Admin"
              data-ocid="admin.logout.button"
            >
              <LogOut className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </>
        ) : (
          /* Non-admin: show Admin login button */
          <Button
            variant="ghost"
            onClick={onAdminLoginClick}
            className="shrink-0 text-xs px-3 font-semibold"
            style={{
              color: "#AAB6C6",
              border: "1px solid #22324A",
            }}
            data-ocid="admin.login.open_modal_button"
          >
            <Shield
              className="w-4 h-4 sm:mr-1.5"
              style={{ color: "#D2B04C" }}
            />
            <span className="hidden sm:inline">Admin</span>
          </Button>
        )}
      </div>
    </header>
  );
}
