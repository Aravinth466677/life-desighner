import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function PublicLayout() {
  return (
    <div className="min-h-dvh bg-surface text-ink">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}

