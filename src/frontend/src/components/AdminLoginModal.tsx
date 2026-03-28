import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../hooks/useAdmin";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const success = login(username, password);
    setIsLoading(false);
    if (success) {
      setUsername("");
      setPassword("");
      onClose();
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close via Escape is handled by inner dialog keyboard trap
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="admin.modal"
    >
      <div
        className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "#0A1424",
          border: "1px solid #22324A",
        }}
      >
        {/* Header */}
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{ borderBottom: "1px solid #22324A" }}
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "rgba(210,176,76,0.15)" }}
          >
            <ShieldCheck className="w-7 h-7" style={{ color: "#D2B04C" }} />
          </div>
          <h2 className="text-xl font-black" style={{ color: "#E8EEF7" }}>
            Admin Portal
          </h2>
          <p className="text-sm mt-1" style={{ color: "#7F8CA3" }}>
            Sign in to manage your Movies Box
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
        >
          <div className="space-y-2">
            <Label style={{ color: "#AAB6C6" }}>Username</Label>
            <Input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              style={{
                background: "#111E31",
                borderColor: "#263A55",
                color: "#E8EEF7",
              }}
              data-ocid="admin.login.input"
            />
          </div>

          <div className="space-y-2">
            <Label style={{ color: "#AAB6C6" }}>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{
                  background: "#111E31",
                  borderColor: error ? "#B53A3A" : "#263A55",
                  color: "#E8EEF7",
                  paddingRight: "2.5rem",
                }}
                data-ocid="admin.password.input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#7F8CA3" }}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="text-sm px-3 py-2 rounded-lg"
              style={{
                color: "#E57373",
                background: "rgba(181,58,58,0.15)",
                border: "1px solid rgba(181,58,58,0.3)",
              }}
              data-ocid="admin.login.error_state"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-bold uppercase tracking-wider mt-2"
            style={{ background: "#D2B04C", color: "#0B1220" }}
            data-ocid="admin.login.submit_button"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: "#0B1220",
                    borderTopColor: "transparent",
                  }}
                />
                Verifying…
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            style={{ color: "#7F8CA3" }}
            onClick={onClose}
            data-ocid="admin.login.cancel_button"
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}
