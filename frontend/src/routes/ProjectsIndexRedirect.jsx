import { Navigate, useSearchParams } from "react-router-dom";

export default function ProjectsIndexRedirect() {
  const [params] = useSearchParams();
  const category = params.get("category");
  const target = category === "exterior" || category === "all" ? category : "interior";
  const parsedPage = Number(params.get("page") || "1");
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;

  return (
    <Navigate
      to={`/projects/${target}${page > 1 ? `?page=${page}` : ""}`}
      replace
    />
  );
}