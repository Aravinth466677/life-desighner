import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

import ProjectGallery from "@/components/projects/ProjectGallery";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { getProject } from "@/services/projects";
import { getFooterServices } from "@/services/footerConfig";

export default function ServicePage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [serviceLabel, setServiceLabel] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setProject(null);
      setNotFound(false);

      // Find the footer service entry that matches this slug
      const services = getFooterServices();
      const entry = services.find((s) => s.slug === slug && s.enabled);

      if (!entry) {
        if (alive) { setNotFound(true); setLoading(false); }
        return;
      }

      if (alive) setServiceLabel(entry.serviceLabel);

      try {
        const p = await getProject(entry.projectId);
        if (alive) setProject(p);
      } catch {
        toast.error("Could not load service content");
        if (alive) setNotFound(true);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, [slug]);

  if (loading) {
    return (
      <>
        <Helmet><title>Loading... | Life Designer</title></Helmet>
        <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-10 w-2/3" />
          <Skeleton className="mt-3 h-5 w-1/2" />
          <div className="mt-8">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          </div>
        </main>
      </>
    );
  }

  if (notFound || !project) {
    return (
      <>
        <Helmet><title>Service Not Found | Life Designer</title></Helmet>
        <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
          <p className="text-muted">This service page is not available.</p>
          <div className="mt-6">
            <Button as={Link} to="/" variant="outline">Back to home</Button>
          </div>
        </main>
      </>
    );
  }

  const pageTitle = `${serviceLabel} | Life Designer`;
  const canonicalUrl = `${window.location.origin}/services/${slug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={project.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={project.description} />
        <meta property="og:image" content={project.heroImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: serviceLabel,
            description: project.description,
            image: project.heroImage,
            url: canonicalUrl,
            provider: { "@type": "Organization", name: "Life Designer" },
          })}
        </script>
      </Helmet>

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
        <p className="text-xs tracking-[0.24em] text-muted uppercase">Services</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{serviceLabel}</h1>
        {project.location && (
          <p className="mt-3 text-muted">{project.location}</p>
        )}

        <div className="mt-8">
          <ProjectGallery project={project} />
        </div>

        {project.description && (
          <p className="mt-8 max-w-prose text-muted">{project.description}</p>
        )}

        <div className="mt-10 flex gap-3">
          <Button as={Link} to="/" variant="outline">Back to home</Button>
          <Button as={Link} to="/contact" variant="gold">Start a similar project</Button>
        </div>
      </main>
    </>
  );
}
