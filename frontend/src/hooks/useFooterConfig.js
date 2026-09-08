import { useState } from "react";
import {
  getFooterServices,
  saveFooterServices,
} from "@/services/footerConfig";

export function useFooterConfig() {
  const [services, setServices] = useState(() => getFooterServices());

  function refresh() {
    const latest = getFooterServices();
    setServices(latest);
  }

  function toggleService(projectId) {
    const next = services.map((s) =>
      String(s.projectId) === String(projectId)
        ? { ...s, enabled: !s.enabled }
        : s
    );
    setServices(next);
    saveFooterServices(next);
  }

  function removeService(projectId) {
    const next = services.filter((s) => String(s.projectId) !== String(projectId));
    setServices(next);
    saveFooterServices(next);
  }

  return { services, refresh, toggleService, removeService };
}
