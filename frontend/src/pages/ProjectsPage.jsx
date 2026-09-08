import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import CategoryPills from "@/components/projects/CategoryPills";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectGridSkeleton from "@/components/projects/ProjectGridSkeleton";
import Button from "@/components/ui/Button";
import { listProjects } from "@/services/projects";

const LIMIT = 12;

export default function ProjectsPage({ category = "interior" }) {
  const [params, setParams] = useSearchParams();
  const parsedPage = Number(params.get("page") || "1");
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;

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

  useEffect(() => {
  if (loading) return;

  if (page !== safePage) {
    const p = new URLSearchParams(params);

    if (safePage === 1) {
      p.delete("page");
    } else {
      p.set("page", String(safePage));
    }

    setParams(p, { replace: true });
    }
  }, [loading, page, safePage, params, setParams]);

  const items = filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT);

  const title = category === "interior" ? "Interior Design Projects | Life Designer"
    : category === "exterior" ? "Exterior Design Projects | Life Designer"
    : "Projects | Life Designer";

  const description = category === "interior" ? "Explore our interior design projects across Tamil Nadu, featuring thoughtfully designed living rooms, bedrooms, modular kitchens, and complete residential spaces that combine functionality, comfort, and timeless style."
    : category === "exterior" ? "Explore our exterior design projects across Tamil Nadu, creating attractive and functional building exteriors with thoughtful materials, modern details, and designs that complement each property's character."
    : "Explore our Interior and Exterior design projects";

  const canonicalPath = `/projects/${category}`;
  const canonicalUrl = `${window.location.origin}${canonicalPath}${safePage > 1 ? `?page=${safePage}` : ""}`;
  const pagePath = (nextPage) => `${canonicalPath}${nextPage > 1 ? `?page=${nextPage}` : ""}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={description} />

      </Helmet>
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
        <p className="text-xs tracking-[0.24em] text-muted uppercase">Projects</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{title.substring(0, title.indexOf("|") - 1)}</h1>
        <p className="mt-3 max-w-prose text-muted">
          {description}
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CategoryPills value={category} />
          <p className="text-sm text-muted">{filtered.length ? `${filtered.length} total` : ""}</p>
        </div>

        <div className="mt-8">
          {loading ? <ProjectGridSkeleton count={9} /> : <ProjectGrid items={items} />}
        </div>

        {pages > 1 && (
          <div className="mt-10 flex items-center justify-between">
            {safePage > 1 ? (
              <Button
                as={Link}
                to={pagePath(safePage - 1)}
                variant="outline"
              >
                Previous
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Previous
              </Button>
            )}

            <p className="text-sm text-muted">
              Page {safePage} of {pages}
            </p>

            {safePage < pages ? (
              <Button
                as={Link}
                to={`${canonicalPath}?page=${safePage + 1}`}
                variant="outline"
              >
                Next
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Next
              </Button>
            )}
          </div>
        )}
      </main>
    </>
  );
}
