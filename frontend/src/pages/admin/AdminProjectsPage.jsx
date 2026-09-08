import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import { useProjects } from "@/hooks/useProjects";
import {
  upsertFooterService,
  removeFooterService,
  getServiceForProject,
} from "@/services/footerConfig";

const CATEGORIES = [
  { value: "interior", label: "Interior" },
  { value: "exterior", label: "Exterior" },
];

const SELECT_CLS =
  "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-[rgba(203,179,122,0.22)]";

// ── Footer Service fieldset ────────────────────────────────────────────────────
function FooterServiceFields({ addToFooter, setAddToFooter, serviceLabel, setServiceLabel, slug, setSlug }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 p-4 grid gap-3">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={addToFooter}
          onChange={(e) => setAddToFooter(e.target.checked)}
          className="h-4 w-4 rounded accent-[var(--color-gold)]"
        />
        <span className="text-sm font-medium">Add to footer under Services</span>
      </label>

      {addToFooter && (
        <>
          <Input
            label="Service display name (shown in footer)"
            value={serviceLabel}
            onChange={(e) => setServiceLabel(e.target.value)}
            placeholder="Modular Kitchen Design"
          />
          <div>
            <label className="mb-1 block text-xs tracking-[0.18em] text-muted uppercase">
              URL slug
            </label>
            <div className="flex items-center gap-0 rounded-xl border border-line bg-surface overflow-hidden focus-within:ring-4 focus-within:ring-[rgba(203,179,122,0.22)]">
              <span className="px-3 py-2.5 text-sm text-muted bg-surface-2 border-r border-line whitespace-nowrap">
                /services/
              </span>
              <input
                className="flex-1 bg-surface px-3 py-2.5 text-sm outline-none"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/--+/g, "-"))
                }
                placeholder="modular-kitchen"
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              Public URL: <span className="font-mono">/services/{slug || "your-slug"}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ── Create form ────────────────────────────────────────────────────────────────
function CreateForm({ onSave, busy }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("interior");
  const [heroImage, setHeroImage] = useState(null);
  const [addToFooter, setAddToFooter] = useState(false);
  const [serviceLabel, setServiceLabel] = useState("");
  const [slug, setSlug] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) {
      toast.error("Title, description and category are required");
      return;
    }
    if (!heroImage) {
      toast.error("Hero image is required");
      return;
    }
    if (addToFooter) {
      if (!serviceLabel.trim()) { toast.error("Service display name is required"); return; }
      if (!slug.trim()) { toast.error("URL slug is required"); return; }
    }
    await onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      heroImage,
      footerService: addToFooter ? { serviceLabel: serviceLabel.trim(), slug: slug.trim(), enabled: true } : null,
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Modern Kitchen Renovation" />
      <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the project" />
      <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Chennai, India" />
      <label className="block">
        <span className="mb-1 block text-xs tracking-[0.18em] text-muted uppercase">Category</span>
        <select
          className={SELECT_CLS}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs tracking-[0.18em] text-muted uppercase">Hero Image *</span>
        <input
          type="file" accept="image/*"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:text-surface file:font-medium"
          onChange={(e) => setHeroImage(e.target.files?.[0] ?? null)}
        />
      </label>
      <FooterServiceFields
        addToFooter={addToFooter} setAddToFooter={setAddToFooter}
        serviceLabel={serviceLabel} setServiceLabel={setServiceLabel}
        slug={slug} setSlug={setSlug}
      />
      <Button type="submit" variant="gold" size="lg" disabled={busy}>
        {busy ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}

// ── Edit form ──────────────────────────────────────────────────────────────────
function EditForm({ initial, onSave, busy }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [category, setCategory] = useState(initial?.category ?? "interior");
  const [newHero, setNewHero] = useState(null);
  const [heroPreview, setHeroPreview] = useState(initial?.heroImage ?? null);
  const heroInputRef = useState(null);

  const existing = initial?.id ? getServiceForProject(initial.id) : null;
  const [addToFooter, setAddToFooter] = useState(!!existing);
  const [serviceLabel, setServiceLabel] = useState(existing?.serviceLabel ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");

  const handleHeroChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setNewHero(file);
    setHeroPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) {
      toast.error("Title, description and category are required");
      return;
    }
    if (addToFooter) {
      if (!serviceLabel.trim()) { toast.error("Service display name is required"); return; }
      if (!slug.trim()) { toast.error("URL slug is required"); return; }
    }
    await onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      heroImage: initial?.heroImage ?? "",
      newHeroFile: newHero,
      footerService: addToFooter ? { serviceLabel: serviceLabel.trim(), slug: slug.trim(), enabled: true } : null,
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Modern Kitchen Renovation" />
      <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the project" />
      <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Chennai, India" />
      <label className="block">
        <span className="mb-1 block text-xs tracking-[0.18em] text-muted uppercase">Category</span>
        <select
          className={SELECT_CLS}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <div className="grid gap-2">
        <span className="text-xs tracking-[0.18em] text-muted uppercase">Hero Image</span>
        {heroPreview && (
          <img src={heroPreview} alt="Hero" className="h-36 w-full rounded-xl object-cover border border-line" />
        )}
        <input
          ref={(el) => (heroInputRef[0] = el)}
          type="file" accept="image/*"
          className="hidden"
          onChange={handleHeroChange}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => heroInputRef[0]?.click()}>
          Change Image
        </Button>
        {newHero && <p className="text-xs text-muted">New image selected: {newHero.name}</p>}
      </div>
      <FooterServiceFields
        addToFooter={addToFooter} setAddToFooter={setAddToFooter}
        serviceLabel={serviceLabel} setServiceLabel={setServiceLabel}
        slug={slug} setSlug={setSlug}
      />
      <Button type="submit" variant="gold" size="lg" disabled={busy}>
        {busy ? "Saving..." : "Update Project"}
      </Button>
    </form>
  );
}

// ── Gallery upload tab ─────────────────────────────────────────────────────────
function GalleryTab({ project, onAddImages, onDeleteImage, busy }) {
  const [queue, setQueue] = useState([]);
  const addInputRef = useState(null);
  const gallery = project?.gallery ?? [];

  const handleAdd = (e) => {
    const incoming = Array.from(e.target.files ?? []).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setQueue((prev) => [...prev, ...incoming]);
    e.target.value = "";
  };

  const removeFromQueue = (idx) => {
    setQueue((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (!queue.length) return;
    await onAddImages(project.id, queue.map((q) => q.file));
    setQueue([]);
  };

  return (
    <div className="grid gap-4">
      {gallery.length > 0 && (
        <div>
          <p className="mb-2 text-xs tracking-[0.18em] text-muted uppercase">Current Gallery ({gallery.length})</p>
          <div className="flex flex-wrap gap-2">
            {gallery.map((item, idx) => {
              const url = typeof item === "string" ? item : (item.imageUrl ?? item.url);
              const imageId = typeof item === "object" ? item.id : null;
              return (
                <div key={idx} className="relative">
                  <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover border border-line" />
                  {imageId && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onDeleteImage(imageId)}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs leading-none shadow disabled:opacity-50 hover:bg-red-600"
                      title="Delete image"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {queue.length > 0 && (
        <div>
          <p className="mb-2 text-xs tracking-[0.18em] text-muted uppercase">To upload ({queue.length})</p>
          <div className="flex flex-wrap gap-2">
            {queue.map(({ preview }, idx) => (
              <div key={idx} className="relative">
                <img src={preview} alt="" className="h-20 w-20 rounded-lg object-cover border border-line" />
                <button
                  type="button"
                  onClick={() => removeFromQueue(idx)}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        ref={(el) => (addInputRef[0] = el)}
        type="file" accept="image/*" multiple
        className="hidden"
        onChange={handleAdd}
      />

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => addInputRef[0]?.click()} disabled={busy}>
          + Add Images
        </Button>
        {queue.length > 0 && (
          <Button variant="gold" disabled={busy} onClick={handleUpload}>
            {busy ? "Uploading..." : `Upload ${queue.length} Image${queue.length > 1 ? "s" : ""}`}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AdminProjectsPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editTab, setEditTab] = useState("info");
  const [busy, setBusy] = useState(false);

  const { allProjects, loading, create, update, remove, addImages, removeImage } = useProjects();

  const stats = useMemo(() => ({
    total: allProjects.length,
    interior: allProjects.filter((p) => p.category === "interior").length,
    exterior: allProjects.filter((p) => p.category === "exterior").length,
  }), [allProjects]);

  const handleCreate = async (fields) => {
    setBusy(true);
    try {
      const { footerService, ...projectFields } = fields;
      const newProject = await create(projectFields);
      const newId = newProject?.id;
      if (newId && footerService) {
        upsertFooterService({ projectId: newId, ...footerService });
      }
      setOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (body) => {
    setBusy(true);
    try {
      const { newHeroFile, footerService, ...jsonBody } = body;
      if (newHeroFile) {
        await addImages(editing.id, [newHeroFile]);
        const { getProject } = await import("@/services/projects");
        const refreshed = await getProject(editing.id);
        const newUrl = refreshed.gallery?.[refreshed.gallery.length - 1] ?? jsonBody.heroImage;
        await update(editing.id, { ...jsonBody, heroImage: newUrl });
      } else {
        await update(editing.id, jsonBody);
      }
      if (footerService) {
        upsertFooterService({ projectId: editing.id, ...footerService });
      } else {
        removeFooterService(editing.id);
      }
      setOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await remove(id);
      removeFooterService(id);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const handleAddImages = async (id, files) => {
    setBusy(true);
    try {
      await addImages(id, files);
      setEditing((prev) => allProjects.find((p) => p.id === prev?.id) ?? prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;
    setBusy(true);
    try {
      await removeImage(imageId);
      setEditing((prev) => ({
        ...prev,
        gallery: (prev.gallery ?? []).filter((img) => img.id !== imageId),
      }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const openNew = () => { setEditing(null); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setEditTab("info"); setOpen(true); };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.24em] text-muted uppercase">Admin</p>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl">Projects</h1>
          <p className="mt-2 text-sm text-muted">
            Total: {stats.total} · Interior: {stats.interior} · Exterior: {stats.exterior}
          </p>
        </div>
        <Button variant="gold" onClick={openNew}>New Project</Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface shadow-soft overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </div>
          </div>
        ))}

        {!loading && allProjects.map((p) => {
          const svc = getServiceForProject(p.id);
          return (
            <div key={p.id} className="rounded-2xl border border-line bg-surface shadow-soft overflow-hidden">
              <div className="aspect-[4/3] bg-surface-2">
                {p.heroImage && (
                  <img src={p.heroImage} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs tracking-[0.18em] uppercase text-muted">{p.category}</p>
                <h3 className="mt-1 font-serif text-xl">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.location}</p>
                {svc && (
                  <p className="mt-1 text-xs text-gold font-mono">
                    /services/{svc.slug} {!svc.enabled && "· disabled"}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => openEdit(p)}>Edit</Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleRemove(p.id)}>Delete</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => (busy ? null : setOpen(false))} title={editing ? "Edit Project" : "New Project"}>
        {editing ? (
          <div>
            <div className="mb-4 flex gap-2 border-b border-line pb-3">
              <button
                type="button"
                onClick={() => setEditTab("info")}
                className={`text-sm px-3 py-1 rounded-lg ${editTab === "info" ? "bg-ink text-surface" : "text-muted hover:text-ink"}`}
              >
                Info
              </button>
              <button
                type="button"
                onClick={() => setEditTab("gallery")}
                className={`text-sm px-3 py-1 rounded-lg ${editTab === "gallery" ? "bg-ink text-surface" : "text-muted hover:text-ink"}`}
              >
                Gallery
              </button>
            </div>
            {editTab === "info"
              ? <EditForm initial={editing} onSave={handleUpdate} busy={busy} />
              : <GalleryTab project={editing} onAddImages={handleAddImages} onDeleteImage={handleDeleteImage} busy={busy} />
            }
          </div>
        ) : (
          <CreateForm onSave={handleCreate} busy={busy} />
        )}
      </Modal>
    </div>
  );
}
