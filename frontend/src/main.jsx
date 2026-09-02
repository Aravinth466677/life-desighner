import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { router } from "@/app/router";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import "@/styles/tailwind.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3500,
        }}
      />
    </ThemeProvider>
  </StrictMode>
);

