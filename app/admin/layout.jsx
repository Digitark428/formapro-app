"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { useStore } from "@/lib/store";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authed, hydrated } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (hydrated && !authed && !isLogin) router.replace("/admin/login");
  }, [hydrated, authed, isLogin, router]);

  // Login page renders standalone (no shell)
  if (isLogin) return children;

  if (!hydrated || !authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <div className="flex items-center gap-3 text-ink-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          Chargement de l'espace admin…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-[262px]">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="bg-linegrid min-h-[calc(100vh-57px)] p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
