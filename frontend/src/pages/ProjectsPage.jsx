import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import CategoryPills from "@/components/projects/CategoryPills";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectGridSkeleton from "@/components/projects/ProjectGridSkeleton";
import Button from "@/components/ui/Button";
import { listProjects } from "@/services/projects";

const LIMIT = 12;

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const page = Math.max(1, Number(params.get("page") || "1"));

  const [loading, setLoading] = useState(true);
  const [all, setAll] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listProjects()
      .then((data) => { if (alive) setAll(data); })
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(
    () => category === "all" ? all : all.filter((p) => p.category === category),
    [all, category]
  );

  const pages = Math.max(1, Math.ceil(filtered.length / LIMIT));
  const safePage = Math.min(page, pages);
  const items = filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT);

  const title = category === "interior" ? "Interior Projects"
    : category === "exterior" ? "Exterior Projects"
    : "Projects";

  const setCategory = (next) => {
    const p = new URLSearchParams(params);
    if (next === "all") p.delete("category"); else p.set("category", next);
    p.delete("page");
    setParams(p);
  };

  const goPage = (n) => {
    const p = new URLSearchParams(params);
    p.set("page", String(n));
    setParams(p);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <p className="text-xs tracking-[0.24em] text-muted uppercase">Projects</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-prose text-muted">
        Filter by category and open a project to view the full gallery.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryPills value={category} onChange={setCategory} />
        <p className="text-sm text-muted">{filtered.length ? `${filtered.length} total` : ""}</p>
      </div>

      <div className="mt-8">
        {loading ? <ProjectGridSkeleton count={9} /> : <ProjectGrid items={items} />}
      </div>

      {pages > 1 && (
        <div className="mt-10 flex items-center justify-between">
          <Button variant="outline" disabled={safePage <= 1} onClick={() => goPage(safePage - 1)}>Previous</Button>
          <p className="text-sm text-muted">Page {safePage} of {pages}</p>
          <Button variant="outline" disabled={safePage >= pages} onClick={() => goPage(safePage + 1)}>Next</Button>
        </div>
      )}
    </main>
  );
}
