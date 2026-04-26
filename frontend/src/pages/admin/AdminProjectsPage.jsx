import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import { createProject, deleteProject, listProjects, updateProject } from "@/services/projects";
import { resolveMediaUrl } from "@/lib/media";

const CATEGORY_OPTIONS = [
  { value: "interior", label: "Interior" },
  { value: "exterior", label: "Exterior" },
];

function ProjectForm({ initial, onSave, busy }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [category, setCategory] = useState(initial?.category ?? "interior");
  const [cover, setCover] = useState(null);
  const [gallery, setGallery] = useState([]);

  const isEdit = !!initial?._id;

  const submit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !category) {
      toast.error("Title, location, and category are required");
      return;
    }
    if (!isEdit && !cover) {
      toast.error("Cover image is required");
      return;
    }

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("location", location.trim());
    fd.set("category", category);

    if (cover) fd.append("cover", cover);
    for (const f of gallery) fd.append("gallery", f);

    await onSave(fd);
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Modern Kitchen Renovation"
      />
      <Input
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Chennai, India"
      />

      <label className="block">
        <span className="mb-1 block text-xs tracking-[0.18em] text-muted uppercase">
          Category
        </span>
        <select
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-[rgba(203,179,122,0.22)]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs tracking-[0.18em] text-muted uppercase">
          Cover Image {isEdit ? "(optional)" : ""}
        </span>
        <input
          type="file"
          accept="image/*"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:text-surface file:font-medium file:hover:bg-ink/90"
          onChange={(e) => setCover(e.target.files?.[0] ?? null)}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs tracking-[0.18em] text-muted uppercase">
          Gallery Images (optional)
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:text-surface file:font-medium file:hover:bg-ink/90"
          onChange={(e) => setGallery(Array.from(e.target.files ?? []))}
        />
        {!!gallery.length && (
          <p className="mt-1 text-xs text-muted">
            Selected: {gallery.length}
          </p>
        )}
      </label>

      <Button type="submit" variant="gold" size="lg" disabled={busy}>
        {busy ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
      </Button>
    </form>
  );
}

export default function AdminProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listProjects({ page: 1, limit: 200 });
      setProjects(res.items ?? []);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const onEdit = (p) => {
    setEditing(p);
    setOpen(true);
  };

  const coverFrom = (p) =>
    resolveMediaUrl(
      p?.cover?.url || p?.coverImage || p?.image || p?.images?.[0]?.url || p?.images?.[0]
    );

  const stats = useMemo(() => {
    const interior = projects.filter((p) => p.category === "interior").length;
    const exterior = projects.filter((p) => p.category === "exterior").length;
    return { total: projects.length, interior, exterior };
  }, [projects]);

  const save = async (formData) => {
    setBusy(true);
    try {
      if (editing?._id) {
        await updateProject(editing._id, formData);
        toast.success("Project updated");
      } else {
        await createProject(formData);
        toast.success("Project created");
      }
      setOpen(false);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      toast.success("Deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.24em] text-muted uppercase">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl">
            Projects
          </h1>
          <p className="mt-2 text-sm text-muted">
            Total: {stats.total} · Interior: {stats.interior} · Exterior: {stats.exterior}
          </p>
        </div>
        <Button variant="gold" onClick={onCreate}>
          New Project
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-line bg-surface shadow-soft overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </div>
            </div>
          ))}

        {!loading &&
          projects.map((p) => (
            <div key={p._id} className="rounded-2xl border border-line bg-surface shadow-soft overflow-hidden">
              <div className="aspect-[4/3] bg-surface-2">
                {coverFrom(p) ? (
                  <img
                    src={coverFrom(p)}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <p className="text-xs tracking-[0.18em] uppercase text-muted">
                  {p.category}
                </p>
                <h3 className="mt-1 font-serif text-xl">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {p.location}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => onEdit(p)}>
                    Edit
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={() => remove(p._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Modal
        open={open}
        onClose={() => (busy ? null : setOpen(false))}
        title={editing ? "Edit Project" : "New Project"}
      >
        <ProjectForm initial={editing} onSave={save} busy={busy} />
      </Modal>
    </div>
  );
}
