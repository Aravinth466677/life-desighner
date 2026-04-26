import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectGridSkeleton from "@/components/projects/ProjectGridSkeleton";
import { listProjects } from "@/services/projects";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listProjects({ page: 1, limit: 6 })
      .then((data) => {
        if (!alive) return;
        setItems(data.items ?? []);
      })
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          {/* Mobile Hero with overlay text */}
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
                <div className="relative">
                  <picture>
                    <img
                      src="/hero-mobile.png"
                      alt="Luxury interior design"
                      className="aspect-[9/11] w-full object-cover"
                      loading="eager"
                    />
                  </picture>
                  {/* Mobile gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  
                  {/* Text overlay on image */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h1 className="font-serif text-3xl leading-[1.05] text-white drop-shadow-lg">
                      Live beautifully.
                      <span className="block text-gold">
                        Design with intention.
                      </span>
                    </h1>
                    <p className="mt-4 text-sm text-white/90 drop-shadow-md">
                      We craft luxury interiors and exteriors with calm palettes, rich textures, and timeless proportions—built for everyday living.
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                      <Button as={Link} to="/projects" variant="gold" size="lg">
                        View Projects
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop Hero */}
          <div className="hidden md:grid md:grid-cols-2 md:items-center md:gap-10">
            <div>
              <h1 className="font-serif text-4xl leading-[1.05] md:text-6xl">
                Live beautifully.
                <span className="block text-gold">
                  Design with intention.
                </span>
              </h1>
              <p className="mt-5 max-w-prose text-muted">
                We craft luxury interiors and exteriors with calm palettes, rich
                textures, and timeless proportions—built for everyday living.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button as={Link} to="/projects" variant="gold" size="lg">
                  View Projects
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4">
                {[
                  { k: "5★", v: "Client Rating" },
                ].map((x) => (
                  <div key={x.v} className="rounded-2xl border border-line bg-surface-2 p-4">
                    <p className="font-serif text-2xl">{x.k}</p>
                    <p className="mt-1 text-xs tracking-[0.16em] uppercase text-muted">
                      {x.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
                <div className="relative">
                  <picture>
                    <img
                      src="/hero-desktop.png"
                      alt="Luxury interior design"
                      className="aspect-[4/4] w-full object-cover"
                      loading="eager"
                    />
                  </picture>
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-6 -left-6">
                <div className="rounded-3xl border border-line bg-surface px-5 py-4 shadow-soft">
                  <p className="text-xs tracking-[0.18em] uppercase text-muted">
                    Signature Finish
                  </p>
                  <p className="mt-1 font-serif text-xl">Warm neutrals + brass</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-muted uppercase">
              Selected Work
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Crafted spaces, photographed beautifully.
            </h2>
          </div>
          <Button as={Link} to="/projects" variant="outline" className="shrink-0">
            See all
          </Button>
        </div>

        <div className="mt-8">
          {loading ? <ProjectGridSkeleton count={6} /> : <ProjectGrid items={items} />}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <div className="rounded-3xl border border-line bg-surface-2 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-[1fr_240px] md:items-center">
              <div>
                <p className="text-xs tracking-[0.24em] text-muted uppercase">
                  Ready to start
                </p>
                <h3 className="mt-2 font-serif text-3xl md:text-4xl">
                  Let’s design a home that feels like you.
                </h3>
                <p className="mt-3 text-muted">
                  Share your WhatsApp number—we’ll reach out with a short
                  discovery call and next steps.
                </p>
              </div>
              <Button as={Link} to="/contact" variant="gold" size="lg" className="w-full">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
