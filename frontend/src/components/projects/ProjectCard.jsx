import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { resolveMediaUrl } from "@/lib/media";

function getCover(project) {
  const cover =
    project?.cover?.url ||
    project?.coverImage ||
    project?.image ||
    project?.images?.[0]?.url ||
    project?.images?.[0];
  return cover || "/projects/interior1.jpeg";
}

export default function ProjectCard({ project }) {
  const cover = resolveMediaUrl(getCover(project));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-soft"
    >
      <Link to={`/projects/${project._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={cover}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-[11px] tracking-[0.18em] uppercase opacity-90">
              {project.category}
            </p>
            <h3 className="mt-1 font-serif text-xl leading-snug">
              {project.title}
            </h3>
            <p className="mt-1 text-sm opacity-90">
              {project.location}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
