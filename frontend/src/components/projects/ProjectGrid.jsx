import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectGrid({ items = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <ProjectCard key={p._id} project={p} />
      ))}
    </div>
  );
}

