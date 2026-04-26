import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProjectGallery from "@/components/projects/ProjectGallery";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { getProject, listProjects } from "@/services/projects";

export default function ProjectPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    getProject(id)
      .then((p) => alive && setProject(p))
      .catch(async () => {
        // Backward compatibility if backend doesn't have /:id yet
        try {
          const data = await listProjects({ page: 1, limit: 200 });
          const found = (data.items ?? []).find((x) => x._id === id);
          if (!found) throw new Error("Not found");
          if (alive) setProject(found);
        } catch {
          toast.error("Project not found");
        }
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        <Skeleton className="mt-3 h-5 w-1/2" />
        <div className="mt-8">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
        <p className="text-muted">No project found.</p>
        <div className="mt-6">
          <Button as={Link} to="/projects" variant="outline">
            Back to projects
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <p className="text-xs tracking-[0.24em] text-muted uppercase">
        {project.category}
      </p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">
        {project.title}
      </h1>
      <p className="mt-3 text-muted">{project.location}</p>

      <div className="mt-8">
        <ProjectGallery project={project} />
      </div>

      <div className="mt-10 flex gap-3">
        <Button as={Link} to="/projects" variant="outline">
          Back
        </Button>
        <Button as={Link} to="/contact" variant="gold">
          Start a similar project
        </Button>
      </div>
    </main>
  );
}

