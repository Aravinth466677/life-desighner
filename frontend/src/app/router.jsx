import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import RequireAdmin from "@/routes/RequireAdmin";

import HomePage from "@/pages/HomePage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectPage from "@/pages/ProjectPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";

import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminProjectsPage from "@/pages/admin/AdminProjectsPage";
import AdminLeadsPage from "@/pages/admin/AdminLeadsPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/projects", element: <ProjectsPage /> },
          { path: "/projects/:id", element: <ProjectPage /> },
          { path: "/contact", element: <ContactPage /> },
        ],
      },
      { path: "/admin/login", element: <AdminLoginPage /> },
      {
        path: "/admin",
        element: (
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/projects" replace /> },
          { path: "projects", element: <AdminProjectsPage /> },
          { path: "leads", element: <AdminLeadsPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
