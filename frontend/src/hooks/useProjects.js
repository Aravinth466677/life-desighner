import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadGallery,
  deleteGalleryImage,
} from "@/services/projects";

const LIMIT = 12;

export function useProjects({ category } = {}) {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listProjects();
      setAllProjects(data);
    } catch {
      toast.error("Failed to load projects");
      setAllProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Client-side filter + paginate since backend returns flat array
  function paginate(page = 1) {
    const filtered = category && category !== "all"
      ? allProjects.filter((p) => p.category === category)
      : allProjects;
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / LIMIT));
    const safePage = Math.min(Math.max(1, page), pages);
    const items = filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT);
    return { items, page: safePage, pages, total };
  }

  const create = async ({ title, description, category: cat, location, heroImage }) => {
    await createProject({ title, description, category: cat, location, heroImage });
    toast.success("Project created");
    await load();
  };

  const update = async (id, body) => {
    await updateProject(id, body);
    toast.success("Project updated");
    await load();
  };

  const remove = async (id) => {
    await deleteProject(id);
    toast.success("Deleted");
    await load();
  };

  const addImages = async (id, files) => {
    await uploadGallery(id, files);
    toast.success("Images uploaded");
    await load();
  };

  const removeImage = async (imageId) => {
    await deleteGalleryImage(imageId);
    toast.success("Image removed");
    await load();
  };

  return { allProjects, loading, load, paginate, create, update, remove, addImages, removeImage };
}
