import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">
        404
      </p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-prose text-muted">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <div className="mt-6">
        <Button as={Link} to="/" variant="gold">
          Back to home
        </Button>
      </div>
    </main>
  );
}

