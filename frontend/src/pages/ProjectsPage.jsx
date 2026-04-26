import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import CategoryPills from "@/components/projects/CategoryPills";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectGridSkeleton from "@/components/projects/ProjectGridSkeleton";
import Button from "@/components/ui/Button";
import { listProjects } from "@/services/projects";

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const page = Number(params.get("page") || "1");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0 });

  const limit = 12;

  useEffect(() => {
    let alive = true;
    setLoading(true);

    listProjects({ page, limit, category })
      .then((res) => {
        if (!alive) return;

        // If backend returns a non-paginated array, we paginate client-side.
        const items = res.items ?? [];
        if (Array.isArray(items) && res.pages === 1 && res.total === items.length) {
          const filtered =
            category === "all"
              ? items
              : items.filter((p) => p.category === category);

          const pages = Math.max(1, Math.ceil(filtered.length / limit));
          const safePage = Math.min(Math.max(1, page), pages);
          const start = (safePage - 1) * limit;
          const slice = filtered.slice(start, start + limit);

          setData({ items: slice, page: safePage, pages, total: filtered.length });
        } else {
          setData(res);
        }
      })
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [category, page, setParams]);

  const canPrev = data.page > 1;
  const canNext = data.page < data.pages;

  const title = useMemo(() => {
    if (category === "interior") return "Interior Projects";
    if (category === "exterior") return "Exterior Projects";
    return "Projects";
  }, [category]);

  const setCategory = (next) => {
    const nextParams = new URLSearchParams(params);
    if (next === "all") nextParams.delete("category");
    else nextParams.set("category", next);
    nextParams.delete("page");
    setParams(nextParams);
  };

  const goPage = (nextPage) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("page", String(nextPage));
    setParams(nextParams);
  };

  return (
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <p className="text-xs tracking-[0.24em] text-muted uppercase">
        Projects
      </p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-prose text-muted">
        Filter by category and open a project to view the cover and full gallery.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryPills value={category} onChange={setCategory} />
        <p className="text-sm text-muted">
          {data.total ? `${data.total} total` : ""}
        </p>
      </div>

      <div className="mt-8">
        {loading ? <ProjectGridSkeleton count={9} /> : <ProjectGrid items={data.items} />}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="outline"
          disabled={!canPrev}
          onClick={() => goPage(data.page - 1)}
        >
          Previous
        </Button>
        <p className="text-sm text-muted">
          Page {data.page} of {data.pages}
        </p>
        <Button
          variant="outline"
          disabled={!canNext}
          onClick={() => goPage(data.page + 1)}
        >
          Next
        </Button>
      </div>
    </main>
  );
}
