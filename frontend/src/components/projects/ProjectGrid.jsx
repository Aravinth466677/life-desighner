import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectGrid({ items = [], variant = "grid", showHoverCta = false }) {
  const gridClassName = variant === "featureList"
    ? "grid grid-cols-1 gap-5"
    : "grid grid-cols-1 gap-4 md:grid-cols-3";

  return (
    <div className={gridClassName}>
      {items.map((p) => (
        <ProjectCard key={p.id} project={p} showHoverCta={showHoverCta} />
      ))}
    </div>
  );
}

