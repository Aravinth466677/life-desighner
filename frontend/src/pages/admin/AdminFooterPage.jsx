import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useFooterConfig } from "@/hooks/useFooterConfig";
import { useProjects } from "@/hooks/useProjects";

const SELECT_CLS =
  "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-[rgba(203,179,122,0.22)]";

const LABEL_CLS = "mb-1 block text-xs tracking-[0.18em] text-muted uppercase";

// ── Suggested internal routes ──────────────────────────────────────────────────
const ROUTE_SUGGESTIONS = [
  "/",
  "/projects",
  "/projects/interior",
  "/projects/exterior",
  "/projects/all",
  "/contact",
];

// ── Add Internal Link form ─────────────────────────────────────────────────────
function InternalLinkForm({ onSave, initial, onClose }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [route, setRoute] = useState(initial?.route ?? "");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!route.trim() || !route.startsWith("/")) {
      toast.error("Route must start with /");
      return;
    }
    onSave({ title: title.trim(), route: route.trim(), type: "internal" });
    onClose();
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input
        label="Display Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Interior Design Projects"
      />
      <div>
        <label className={LABEL_CLS}>Internal Route</label>
        <input
          list="route-suggestions"
          className={SELECT_CLS}
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          placeholder="/projects/interior"
        />
        <datalist id="route-suggestions">
          {ROUTE_SUGGESTIONS.map((r) => <option key={r} value={r} />)}
        </datalist>
        <p className="mt-1 text-xs text-muted">Must start with /</p>
      </div>
      <Button type="submit" variant="gold" size="lg">
        {initial ? "Update Link" : "Add Link"}
      </Button>
    </form>
  );
}

// ── Add Project Link form ──────────────────────────────────────────────────────
function ProjectLinkForm({ onSave, allProjects, onClose }) {
  const [projectId, setProjectId] = useState("");
  const [customTitle, setCustomTitle] = useState("");

  const selected = allProjects.find((p) => String(p.id) === projectId);

  const submit = (e) => {
    e.preventDefault();
    if (!projectId) { toast.error("Select a project"); return; }
    onSave({
      type: "project",
      projectId: String(projectId),
      title: customTitle.trim() || selected?.title || "",
    });
    onClose();
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div>
        <label className={LABEL_CLS}>Project</label>
        <select
          className={SELECT_CLS}
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">— select a project —</option>
          {allProjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.category})
            </option>
          ))}
        </select>
      </div>
      {selected && (
        <p className="text-xs text-muted">
          Generated route: <span className="font-mono">/projects/{selected.id}</span>
        </p>
      )}
      <Input
        label="Custom Display Title (optional)"
        value={customTitle}
        onChange={(e) => setCustomTitle(e.target.value)}
        placeholder={selected?.title ?? "Leave blank to use project title"}
      />
      <Button type="submit" variant="gold" size="lg">Add Project Link</Button>
    </form>
  );
}

// ── Add / Edit Service form ────────────────────────────────────────────────────
function ServiceForm({ onSave, initial, onClose }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [route, setRoute] = useState(initial?.route ?? "");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!route.trim() || !route.startsWith("/")) {
      toast.error("Route must start with /");
      return;
    }
    onSave({ title: title.trim(), route: route.trim() });
    onClose();
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input
        label="Service Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Modular Kitchen Design"
      />
      <Input
        label="Internal Route"
        value={route}
        onChange={(e) => setRoute(e.target.value)}
        placeholder="/services/modular-kitchen"
      />
      <Button type="submit" variant="gold" size="lg">
        {initial ? "Update Service" : "Add Service"}
      </Button>
    </form>
  );
}

// ── Reusable row for a single footer item ──────────────────────────────────────
function ItemRow({ label, sub, enabled, onToggle, onEdit, onDelete, onUp, onDown, isFirst, isLast }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className={`text-sm font-medium truncate ${!enabled ? "opacity-40 line-through" : ""}`}>
          {label}
        </span>
        {sub && <span className="text-xs text-muted font-mono truncate">{sub}</span>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={isFirst}
          onClick={onUp}
          className="rounded-lg border border-line px-2 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
          title="Move up"
        >↑</button>
        <button
          type="button"
          disabled={isLast}
          onClick={onDown}
          className="rounded-lg border border-line px-2 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
          title="Move down"
        >↓</button>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className={enabled ? "" : "opacity-60"}
        >
          {enabled ? "Disable" : "Enable"}
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, children, action }) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AdminFooterPage() {
  const {
    links, services,
    addLink, updateLink, removeLink, toggleLink, moveLinkUp, moveLinkDown,
    addService, updateService, removeService, toggleService, moveServiceUp, moveServiceDown,
  } = useFooterConfig();

  const { allProjects } = useProjects();

  const [modal, setModal] = useState(null); // null | "internal" | "project" | "service" | "editLink" | "editService"
  const [editing, setEditing] = useState(null);

  const internalLinks = links.filter((l) => l.type === "internal");
  const projectLinks = links.filter((l) => l.type === "project");

  const openEditLink = (link) => { setEditing(link); setModal("editLink"); };
  const openEditService = (svc) => { setEditing(svc); setModal("editService"); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSaveLink = (data) => {
    addLink(data);
    toast.success("Link added");
  };

  const handleUpdateLink = (data) => {
    updateLink(editing.id, data);
    toast.success("Link updated");
  };

  const handleSaveService = (data) => {
    addService(data);
    toast.success("Service added");
  };

  const handleUpdateService = (data) => {
    updateService(editing.id, data);
    toast.success("Service updated");
  };

  // Resolve display info for a link row
  function linkRowProps(link, idx, arr) {
    if (link.type === "project") {
      const project = allProjects.find((p) => String(p.id) === String(link.projectId));
      const label = link.title || project?.title || `Project #${link.projectId}`;
      const sub = project ? `/projects/${project.id}` : `⚠ project not found`;
      return { label, sub };
    }
    return { label: link.title, sub: link.route };
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs tracking-[0.24em] text-muted uppercase">Admin</p>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl">Footer Management</h1>
        <p className="mt-2 text-sm text-muted">
          Manage footer links and services. Changes are saved instantly and reflected on the public footer.
        </p>
      </div>

      {/* ── Internal Links ─────────────────────────────────────────────────── */}
      <Section
        title="Internal Links"
        action={
          <Button variant="gold" size="sm" onClick={() => setModal("internal")}>
            + Add Link
          </Button>
        }
      >
        {internalLinks.length === 0 && (
          <p className="text-sm text-muted">No internal links yet.</p>
        )}
        <div className="grid gap-2">
          {internalLinks.map((link, idx) => {
            const { label, sub } = linkRowProps(link, idx, internalLinks);
            return (
              <ItemRow
                key={link.id}
                label={label}
                sub={sub}
                enabled={link.enabled}
                onToggle={() => toggleLink(link.id)}
                onEdit={() => openEditLink(link)}
                onDelete={() => removeLink(link.id)}
                onUp={() => moveLinkUp(link.id)}
                onDown={() => moveLinkDown(link.id)}
                isFirst={idx === 0}
                isLast={idx === internalLinks.length - 1}
              />
            );
          })}
        </div>
      </Section>

      {/* ── Project Links ──────────────────────────────────────────────────── */}
      <Section
        title="Project Links"
        action={
          <Button variant="gold" size="sm" onClick={() => setModal("project")}>
            + Add Project
          </Button>
        }
      >
        {projectLinks.length === 0 && (
          <p className="text-sm text-muted">No project links yet.</p>
        )}
        <div className="grid gap-2">
          {projectLinks.map((link, idx) => {
            const { label, sub } = linkRowProps(link, idx, projectLinks);
            return (
              <ItemRow
                key={link.id}
                label={label}
                sub={sub}
                enabled={link.enabled}
                onToggle={() => toggleLink(link.id)}
                onDelete={() => removeLink(link.id)}
                onUp={() => moveLinkUp(link.id)}
                onDown={() => moveLinkDown(link.id)}
                isFirst={idx === 0}
                isLast={idx === projectLinks.length - 1}
              />
            );
          })}
        </div>
      </Section>

      {/* ── Services ───────────────────────────────────────────────────────── */}
      <Section
        title="Services"
        action={
          <Button variant="gold" size="sm" onClick={() => setModal("service")}>
            + Add Service
          </Button>
        }
      >
        {services.length === 0 && (
          <p className="text-sm text-muted">
            No services yet. The Services section will be hidden from the footer until you add one.
          </p>
        )}
        <div className="grid gap-2">
          {services.map((svc, idx) => (
            <ItemRow
              key={svc.id}
              label={svc.title}
              sub={svc.route}
              enabled={svc.enabled}
              onToggle={() => toggleService(svc.id)}
              onEdit={() => openEditService(svc)}
              onDelete={() => removeService(svc.id)}
              onUp={() => moveServiceUp(svc.id)}
              onDown={() => moveServiceDown(svc.id)}
              isFirst={idx === 0}
              isLast={idx === services.length - 1}
            />
          ))}
        </div>
      </Section>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <Modal open={modal === "internal"} onClose={closeModal} title="Add Internal Link">
        <InternalLinkForm onSave={handleSaveLink} onClose={closeModal} />
      </Modal>

      <Modal open={modal === "editLink"} onClose={closeModal} title="Edit Link">
        <InternalLinkForm onSave={handleUpdateLink} initial={editing} onClose={closeModal} />
      </Modal>

      <Modal open={modal === "project"} onClose={closeModal} title="Add Project Link">
        <ProjectLinkForm onSave={handleSaveLink} allProjects={allProjects} onClose={closeModal} />
      </Modal>

      <Modal open={modal === "service"} onClose={closeModal} title="Add Service">
        <ServiceForm onSave={handleSaveService} onClose={closeModal} />
      </Modal>

      <Modal open={modal === "editService"} onClose={closeModal} title="Edit Service">
        <ServiceForm onSave={handleUpdateService} initial={editing} onClose={closeModal} />
      </Modal>
    </div>
  );
}
