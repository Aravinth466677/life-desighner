import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { optimizeCloudinaryImage } from "../../services/cloudinary";

export default function ProjectCard({ project, showHoverCta = false }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group overflow-hidden rounded-lg border border-line bg-surface shadow-soft"
    >
      <Link to={`/projects/${project.id}`} className="block" aria-label={`Open ${project.title}`}>
        <div className="relative aspect-[16/9] overflow-hidden">
          {project.heroImage ? (
            <img
              srcSet={`
                ${optimizeCloudinaryImage(project.heroImage, 480)} 480w,
                ${optimizeCloudinaryImage(project.heroImage, 800)} 800w,
                ${optimizeCloudinaryImage(project.heroImage, 1200)} 1200w,
                ${optimizeCloudinaryImage(project.heroImage, 1600)} 1600w
              `}
              sizes="(max-width: 640px) 100vw,
                      (max-width: 1024px) 50vw,
                      384px"
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-surface-2" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-3 text-white">
            <h3 className="font-serif text-base leading-tight">{project.title}</h3>
            {project.location && (
              <p className="mt-1 text-xs opacity-90">{project.location}</p>
            )}
          </div>
          {showHoverCta && (
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink opacity-0 shadow-soft transition duration-300 group-hover:opacity-100">
              View more &gt;&gt;
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
