import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// gallery items: { id, imageUrl, displayOrder }
function buildImages(project) {
  const hero = project?.heroImage ?? null;
  const rest = Array.isArray(project?.gallery)
    ? project.gallery.map((g) => (typeof g === "string" ? g : g.imageUrl)).filter(Boolean)
    : [];
  return [...new Set([hero, ...rest].filter(Boolean))];
}

export default function ProjectGallery({ project }) {
  const images = buildImages(project);
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

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(idx)}
              className={[
                "shrink-0 overflow-hidden rounded-xl border",
                idx === active ? "border-ink" : "border-line hover:border-ink/40",
              ].join(" ")}
              aria-label={`Select image ${idx + 1}`}
            >
              <img src={src} alt="" className="h-20 w-24 object-cover md:h-20 md:w-full" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
