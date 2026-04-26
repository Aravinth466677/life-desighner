import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveMediaUrl } from "@/lib/media";

function normalizeImages(project) {
  const fromNew = Array.isArray(project?.gallery)
    ? project.gallery.map((g) => (typeof g === "string" ? g : g.url))
    : [];

  const fromImages = Array.isArray(project?.images)
    ? project.images.map((g) => (typeof g === "string" ? g : g.url))
    : [];

  const cover =
    project?.cover?.url || project?.coverImage || project?.image || null;

  const all = [cover, ...fromNew, ...fromImages].filter(Boolean);
  return Array.from(new Set(all));
}

export default function ProjectGallery({ project }) {
  const images = useMemo(
    () => normalizeImages(project).map(resolveMediaUrl).filter(Boolean),
    [project]
  );
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_160px]">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
        <div className="relative aspect-[4/3] md:aspect-[16/10]">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[active]}
              src={images[active]}
              alt={project?.title || "Project image"}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0.6, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.6, scale: 1.02 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {images.map((src, idx) => {
          const isActive = idx === active;
          return (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActive(idx)}
              className={[
                "shrink-0 overflow-hidden rounded-xl border",
                isActive ? "border-ink" : "border-line hover:border-ink/40",
              ].join(" ")}
              aria-label={`Select image ${idx + 1}`}
            >
              <img
                src={src}
                alt=""
                className="h-20 w-24 object-cover md:h-20 md:w-full"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
