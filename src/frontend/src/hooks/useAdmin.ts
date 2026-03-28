import { useCallback, useEffect, useState } from "react";

const ADMIN_SESSION_KEY = "imb_admin";
const PERMISSIONS_KEY = "imb_permissions";

const ADMIN_USERNAME = "Infinexy Solutions";
const ADMIN_PASSWORD = "Year@2026";

interface Permissions {
  allowView: boolean;
  allowDownload: boolean;
}

const DEFAULT_PERMISSIONS: Permissions = {
  allowView: true,
  allowDownload: false,
};

function loadPermissions(): Permissions {
  try {
    const raw = localStorage.getItem(PERMISSIONS_KEY);
    if (raw) return { ...DEFAULT_PERMISSIONS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_PERMISSIONS };
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  });

  const [permissions, setPermissions] = useState<Permissions>(loadPermissions);

  // Sync permissions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
  }, [permissions]);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  }, []);

  const setPermission = useCallback(
    (key: "allowView" | "allowDownload", val: boolean) => {
      setPermissions((prev) => ({ ...prev, [key]: val }));
    },
    [],
  );

  return { isAdmin, permissions, login, logout, setPermission };
}
