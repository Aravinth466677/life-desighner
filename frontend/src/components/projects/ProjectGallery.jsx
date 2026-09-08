import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeCloudinaryImage } from "../../services/cloudinary";

function buildImages(project) {
  const hero = project?.heroImage ?? null;
  const items = Array.isArray(project?.gallery) ? project.gallery : [];
  const galleryUrls = items
    .map((g) => (typeof g === "string" ? g : g.imageUrl))
    .filter(Boolean);
  return [...new Set([hero, ...galleryUrls].filter(Boolean))];
}

export default function ProjectGallery({ project }) {
  const images = buildImages(project);
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);

  if (!images.length) return null;

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-soft select-none">
      {/* Main image */}
      <div
        className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={images[active]}
            srcSet={`
              ${optimizeCloudinaryImage(images[active], 480)} 480w,
              ${optimizeCloudinaryImage(images[active], 800)} 800w,
              ${optimizeCloudinaryImage(images[active], 1200)} 1200w,
              ${optimizeCloudinaryImage(images[active], 1600)} 1600w
            `}
            sizes="(max-width: 768px) 100vw, 1200px"
            alt={project?.title || "Project image"}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            draggable={false}
          />
        </AnimatePresence>

        {/* Arrow buttons — visible on desktop, hidden on mobile */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Image counter top-right */}
        {images.length > 1 && (
          <span className="absolute top-3 right-3 rounded-full bg-black/40 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-3">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Go to image ${idx + 1}`}
              className={[
                "rounded-full transition-all duration-200",
                idx === active
                  ? "w-4 h-2 bg-ink"
                  : "w-2 h-2 bg-ink/25 hover:bg-ink/50",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
