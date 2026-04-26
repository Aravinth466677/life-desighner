import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { submitLead } from "@/services/leads";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  whatsapp: z.string().trim().min(8, "Enter a valid WhatsApp number"),
  place: z.string().trim().min(2, "Enter your place"),
});

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M19.05 4.94A9.9 9.9 0 0 0 12.02 2C6.53 2 2.06 6.47 2.06 11.96c0 1.76.46 3.48 1.33 5L2 22l5.19-1.36a9.9 9.9 0 0 0 4.83 1.23h.01c5.49 0 9.96-4.47 9.97-9.96A9.9 9.9 0 0 0 19.05 4.94ZM12.03 20.2h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.08.81.82-3-.2-.31a8.2 8.2 0 0 1-1.27-4.4c0-4.53 3.69-8.22 8.23-8.22a8.16 8.16 0 0 1 5.82 2.41 8.16 8.16 0 0 1 2.4 5.82c0 4.53-3.69 8.22-8.23 8.22Zm4.5-6.13c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.12-.57.12-.17.25-.65.8-.8.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.64-1.22-1.43-1.36-1.67-.14-.25-.02-.38.1-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.57-1.36-.78-1.87-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.72 2.62 4.17 3.68.58.25 1.03.4 1.39.51.58.18 1.11.15 1.53.09.47-.07 1.47-.6 1.68-1.17.21-.58.21-1.07.15-1.17-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.75a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h8.5a4 4 0 0 0 4-4v-8.5a4 4 0 0 0-4-4h-8.5Zm8.94 1.31a1.13 1.13 0 1 1 0 2.25 1.13 1.13 0 0 1 0-2.25ZM12 6.73A5.27 5.27 0 1 1 6.73 12 5.27 5.27 0 0 1 12 6.73Zm0 1.75A3.52 3.52 0 1 0 15.52 12 3.52 3.52 0 0 0 12 8.48Z" />
    </svg>
  );
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      whatsapp: "",
      place: "",
    },
  });

  const onSubmit = async (values) => {
    await submitLead(values);
    toast.success("Submitted. We will reach out on WhatsApp within 2-3 business days.");
    reset();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      

      <div className="mt-10 grid gap-8 md:grid-cols-[1.15fr_0.85fr]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border border-line bg-surface p-6 shadow-soft md:p-8"
        >
          <div className="grid gap-4">
            <Input
              label="Name"
              placeholder="Your full name"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              label="WhatsApp"
              placeholder="+91 98765 43210"
              {...register("whatsapp")}
              error={errors.whatsapp?.message}
            />
            <Input
              label="Place"
              placeholder="Chennai"
              {...register("place")}
              error={errors.place?.message}
            />

            <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <p className="text-xs text-muted">
              By submitting, you agree to be contacted on WhatsApp regarding
              your inquiry.
            </p>
          </div>
        </form>

        <div className="rounded-3xl border border-line bg-surface-2 p-6 md:p-8">

          <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs tracking-[0.24em] text-muted uppercase">
              Response expectations
            </p>
            <p className="mt-2 text-sm text-muted">
              We typically respond within 2-3 business days.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs tracking-[0.24em] text-muted uppercase">
              Direct contact
            </p>
            <div className="mt-3 grid gap-3">
              <a
                href="https://wa.me/919361756242"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3 text-muted transition-colors hover:text-ink"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft">
                  <WhatsAppIcon />
                </span>
                <span>
                  <span className="block text-xs tracking-[0.18em] uppercase">
                    WhatsApp
                  </span>
                  <span className="block text-sm">+91 93617 56242</span>
                </span>
              </a>

              <a
                href="https://www.instagram.com/life_designer__3d?igsh=MTZybDd5dGQzbDcybQ=="
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3 text-muted transition-colors hover:text-ink"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)] text-white shadow-soft">
                  <InstagramIcon />
                </span>
                <span>
                  <span className="block text-xs tracking-[0.18em] uppercase">
                    Instagram
                  </span>
                  <span className="block text-sm">@life_designer__3d</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
