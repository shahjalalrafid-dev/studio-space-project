"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/auth/AuthFields";
import {
  CheckIcon,
  CloseIcon,
  ImageIcon,
  MailIcon,
  MapPinIcon,
  UserIcon,
} from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { STUDIO_CATEGORIES } from "@/lib/site";
import type { Studio } from "@/lib/studios";

/**
 * The one form behind /add-studio (create) and /studios/edit/[id] (update).
 *
 * · validates everything client-side before touching MongoDB
 * · image: paste a direct URL *or* upload a file — /api/upload proxies it
 *   to imgbb server-side (the API key never reaches the browser)
 * · host email + name are read-only, stamped server-side from the session
 * · success → Sonner toast → redirect to /my-listings
 */

export const AMENITY_OPTIONS = [
  "High-speed Wi-Fi",
  "Free parking",
  "Makeup station",
  "Green room",
  "Cyc / infinity wall",
  "Blackout capable",
  "Soundproofed",
  "Lighting kit included",
  "Backdrop rolls",
  "Restroom on site",
  "Kitchenette",
  "Freight elevator",
  "Loading dock",
  "Air conditioning",
  "Natural light",
  "Projector & screen",
  "Tool storage",
  "Sink & water access",
] as const;

type FieldErrors = Partial<
  Record<
    | "title"
    | "category"
    | "pricePerHour"
    | "securityDeposit"
    | "capacity"
    | "address"
    | "image"
    | "description",
    string
  >
>;

const EMAIL_LIKE = /^\S+@\S+\.\S+$/;
const URL_LIKE = /^https?:\/\/\S+$/i;

const labelClass = "text-[13px] font-semibold tracking-[0.02em] text-ink-700";
const inputClass = (invalid: boolean) =>
  [
    "h-12 w-full rounded-xl border bg-paper-warm/70 px-3.5 text-[15px] text-ink-950",
    "placeholder:text-ink-400 outline-none transition-colors duration-150",
    invalid
      ? "border-rose-400 bg-rose-50/60 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
      : "border-ink-950/[0.12] focus:border-spotlight/80 focus:bg-white focus:ring-4 focus:ring-spotlight/20",
  ].join(" ");

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[13px] font-medium text-rose-600">{message}</p>;
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-ink-950/[0.08] bg-white p-5 sm:p-6">
      <h2 className="text-[16.5px] font-semibold tracking-[-0.01em] text-ink-950">
        {title}
      </h2>
      <p className="mt-1 text-[14px] text-ink-500">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function StudioForm({
  mode,
  initial,
  studioId,
}: {
  mode: "create" | "edit";
  /** Pre-filled document when editing. */
  initial?: Studio;
  /** MongoDB _id (or slug) used by the PUT request. */
  studioId?: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [pricePerHour, setPricePerHour] = useState(
    initial ? String(initial.pricePerHour) : "",
  );
  const [securityDeposit, setSecurityDeposit] = useState(
    initial ? String(initial.securityDeposit) : "",
  );
  const [capacity, setCapacity] = useState(
    initial ? String(initial.capacity) : "",
  );
  const [address, setAddress] = useState(initial?.address ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [customAmenity, setCustomAmenity] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const preview = URL_LIKE.test(image.trim()) ? image.trim() : "";

  /* --------------------------- amenities --------------------------- */

  function toggleAmenity(option: string) {
    setAmenities((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function addCustomAmenity() {
    const value = customAmenity.trim();
    if (!value) return;
    if (amenities.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setCustomAmenity("");
      toast.info("Already on the list", { description: `“${value}” is ticked below.` });
      return;
    }
    setAmenities((current) => [...current, value]);
    setCustomAmenity("");
  }

  /* ---------------------------- upload ----------------------------- */

  async function onUploadFile(file: File) {
    if (uploading) return;

    if (!file.type.startsWith("image/")) {
      toast.error("That file isn't an image", {
        description: "Pick a jpg, png, webp or gif and try again.",
      });
      return;
    }
    if (file.size > 32 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "imgbb caps uploads at 32 MB — pick a smaller file.",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => null)) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !payload?.url) {
        toast.error("Upload failed", {
          description:
            payload?.error ?? "Couldn't upload the image — paste a URL instead.",
        });
        return;
      }

      setImage(payload.url);
      setFieldErrors((current) => ({ ...current, image: undefined }));
      toast.success("Image uploaded", {
        description: "Hosted on imgbb and linked to this listing.",
      });
    } catch {
      toast.error("Upload failed", {
        description: "Couldn't reach the server — check your connection and retry.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  /* -------------------------- validation --------------------------- */

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const price = Number(pricePerHour);
    const deposit = securityDeposit.trim() === "" ? 0 : Number(securityDeposit);
    const people = Number(capacity);

    if (title.trim().length < 4)
      next.title = "Give the studio a title (at least 4 characters).";
    if (!category) next.category = "Choose the studio category.";
    if (!Number.isFinite(price) || price <= 0)
      next.pricePerHour = "Hourly rate must be a positive number.";
    if (!Number.isFinite(deposit) || deposit < 0)
      next.securityDeposit = "Deposit can't be negative.";
    if (!Number.isInteger(people) || people <= 0)
      next.capacity = "Max capacity must be a whole number above zero.";
    if (address.trim().length < 4)
      next.address = "Add the location / address of the space.";
    if (!URL_LIKE.test(image.trim()))
      next.image = "Upload a photo or paste a direct image URL (https://…).";
    if (description.trim().length < 24)
      next.description = "Write an overview of at least 24 characters.";

    return next;
  }

  /* --------------------------- submit ------------------------------ */

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted fields before saving.");
      toast.error("Check the form", {
        description: "A few fields need your attention before the listing can be saved.",
      });
      return;
    }

    setError(null);
    setBusy(true);

    const body = {
      title: title.trim(),
      category,
      pricePerHour: Number(pricePerHour),
      securityDeposit: securityDeposit.trim() === "" ? 0 : Number(securityDeposit),
      capacity: Number(capacity),
      address: address.trim(),
      image: image.trim(),
      description: description.trim(),
      amenities,
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/studios" : `/api/studios/${studioId ?? initial?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const payload = (await response.json().catch(() => null)) as {
        studio?: { id: string; slug: string };
        error?: string;
      };

      if (!response.ok || !payload?.studio) {
        toast.error(mode === "create" ? "Listing not published" : "Update not saved", {
          description: payload?.error ?? "Something went wrong — try again in a moment.",
        });
        return;
      }

      toast.success(
        mode === "create" ? "Studio published" : "Studio updated",
        {
          description:
            mode === "create"
              ? `“${body.title}” is live and now shows up in My Studio Listings.`
              : `“${body.title}” now reflects your changes.`,
        },
      );

      router.push("/my-listings");
      router.refresh();
    } catch {
      toast.error("Couldn't reach the server", {
        description: "Check your connection and try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  /* ---------------------------- render ----------------------------- */

  const hostName = user?.name ?? initial?.ownerName ?? "";
  const hostEmail = user?.email ?? initial?.ownerEmail ?? "";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[14px] font-medium leading-snug text-rose-700"
        >
          <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-rose-500 text-white">
            <CloseIcon className="size-3" strokeWidth={2.4} />
          </span>
          <span>{error}</span>
        </p>
      ) : null}

      {/* ------------------------- basics -------------------------- */}
      <SectionCard
        title="Studio basics"
        description="What it is called, what kind of space it is, and how it reads to creators browsing the grid."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="studio-title" className={labelClass}>
              Title
            </label>
            <input
              id="studio-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Daylight Cyclorama Loft"
              maxLength={80}
              aria-invalid={fieldErrors.title ? true : undefined}
              className={`mt-1.5 ${inputClass(Boolean(fieldErrors.title))}`}
            />
            <FieldError message={fieldErrors.title} />
          </div>

          <div>
            <label htmlFor="studio-category" className={labelClass}>
              Category
            </label>
            <select
              id="studio-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-invalid={fieldErrors.category ? true : undefined}
              className={`mt-1.5 ${inputClass(Boolean(fieldErrors.category))}`}
            >
              <option value="">Choose a category…</option>
              {STUDIO_CATEGORIES.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.label}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.category} />
          </div>

          <div>
            <label htmlFor="studio-capacity" className={labelClass}>
              Max capacity (people)
            </label>
            <input
              id="studio-capacity"
              type="number"
              min={1}
              step={1}
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              placeholder="8"
              aria-invalid={fieldErrors.capacity ? true : undefined}
              className={`mt-1.5 ${inputClass(Boolean(fieldErrors.capacity))}`}
            />
            <FieldError message={fieldErrors.capacity} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="studio-description" className={labelClass}>
              Detailed overview
            </label>
            <textarea
              id="studio-description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Walk creators through the light, the gear on site, load-in access and what a typical day looks like in the space…"
              maxLength={1600}
              aria-invalid={fieldErrors.description ? true : undefined}
              className={`mt-1.5 w-full rounded-xl border bg-paper-warm/70 px-3.5 py-3 text-[15px] leading-relaxed text-ink-950 outline-none transition-colors placeholder:text-ink-400 ${
                fieldErrors.description
                  ? "border-rose-400 bg-rose-50/60 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                  : "border-ink-950/[0.12] focus:border-spotlight/80 focus:bg-white focus:ring-4 focus:ring-spotlight/20"
              }`}
            />
            <div className="mt-1.5 flex items-start justify-between gap-3">
              <FieldError message={fieldErrors.description} />
              <span className="ml-auto shrink-0 text-[12px] tabular-nums text-ink-400">
                {description.length}/1600
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ------------------------- pricing ------------------------- */}
      <SectionCard
        title="Pricing"
        description="Transparent hourly pricing — the deposit is refunded when the shoot wraps without damage."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="studio-price" className={labelClass}>
              Hourly rate ($)
            </label>
            <div className="relative mt-1.5">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-[15px] font-semibold text-ink-400"
              >
                $
              </span>
              <input
                id="studio-price"
                type="number"
                min={1}
                step={1}
                value={pricePerHour}
                onChange={(event) => setPricePerHour(event.target.value)}
                placeholder="68"
                aria-invalid={fieldErrors.pricePerHour ? true : undefined}
                className={`pl-9 ${inputClass(Boolean(fieldErrors.pricePerHour))}`}
              />
            </div>
            <FieldError message={fieldErrors.pricePerHour} />
          </div>

          <div>
            <label htmlFor="studio-deposit" className={labelClass}>
              Security deposit ($)
            </label>
            <div className="relative mt-1.5">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-[15px] font-semibold text-ink-400"
              >
                $
              </span>
              <input
                id="studio-deposit"
                type="number"
                min={0}
                step={1}
                value={securityDeposit}
                onChange={(event) => setSecurityDeposit(event.target.value)}
                placeholder="250"
                aria-invalid={fieldErrors.securityDeposit ? true : undefined}
                className={`pl-9 ${inputClass(Boolean(fieldErrors.securityDeposit))}`}
              />
            </div>
            <FieldError message={fieldErrors.securityDeposit} />
          </div>
        </div>
      </SectionCard>

      {/* ------------------------ location ------------------------- */}
      <SectionCard
        title="Location"
        description="The full street address — shown on the card and in the booking modal."
      >
        <label htmlFor="studio-address" className={labelClass}>
          Location / Address
        </label>
        <div className="relative mt-1.5">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-ink-400"
          >
            <MapPinIcon className="size-[18px]" />
          </span>
          <input
            id="studio-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="148 Wythe Ave, Brooklyn, NY 11249, USA"
            maxLength={160}
            aria-invalid={fieldErrors.address ? true : undefined}
            className={`pl-11 ${inputClass(Boolean(fieldErrors.address))}`}
          />
        </div>
        <FieldError message={fieldErrors.address} />
      </SectionCard>

      {/* -------------------------- photo -------------------------- */}
      <SectionCard
        title="Cover photo"
        description="Upload a file (proxied through imgbb) or paste a direct https:// image URL."
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="studio-image" className={labelClass}>
              Image URL
            </label>
            <div className="relative mt-1.5">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-ink-400"
              >
                <ImageIcon className="size-[18px]" />
              </span>
              <input
                id="studio-image"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                inputMode="url"
                placeholder="https://…/studio.jpg"
                aria-invalid={fieldErrors.image ? true : undefined}
                className={`pl-11 ${inputClass(Boolean(fieldErrors.image))}`}
              />
            </div>
            <FieldError message={fieldErrors.image} />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-ink-950/15 bg-white px-5 text-[14.5px] font-semibold text-ink-800 transition-colors hover:border-ink-950/30 hover:bg-paper-warm/70 disabled:opacity-70"
          >
            {uploading ? <Spinner className="size-4 text-ink-500" /> : <ImageIcon className="size-[18px]" />}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUploadFile(file);
            }}
          />
        </div>

        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-dashed border-ink-950/15 bg-paper-warm/50 p-3.5">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-ink-950/5">
            {preview ? (
              <Image
                src={preview}
                alt="Cover photo preview"
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center text-ink-400">
                <ImageIcon className="size-6" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink-800">Cover preview</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-ink-500">
              This is the artwork creators see first on the /studios grid and the
              detail banner.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* ------------------------ amenities ------------------------ */}
      <SectionCard
        title="Amenities"
        description="Tick everything the space includes — these render as the checklist on the detail page."
      >
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITY_OPTIONS.map((option) => {
            const checked = amenities.includes(option);
            return (
              <li key={option}>
                <label
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-[14px] transition-colors ${
                    checked
                      ? "border-spotlight/60 bg-spotlight/10 font-semibold text-ink-950"
                      : "border-ink-950/[0.1] bg-white text-ink-600 hover:border-ink-950/25"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAmenity(option)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={`grid size-[18px] shrink-0 place-items-center rounded-md border transition-colors ${
                      checked
                        ? "border-spotlight bg-spotlight text-ink-950"
                        : "border-ink-950/25 bg-white"
                    }`}
                  >
                    {checked ? <CheckIcon className="size-3" /> : null}
                  </span>
                  {option}
                </label>
              </li>
            );
          })}
        </ul>

        {/* custom extras already on the document but not in the presets */}
        {amenities.filter((item) => !(AMENITY_OPTIONS as readonly string[]).includes(item))
          .length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {amenities
              .filter((item) => !(AMENITY_OPTIONS as readonly string[]).includes(item))
              .map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-spotlight/50 bg-spotlight/10 px-3 py-1.5 text-[13px] font-semibold text-ink-900"
                >
                  {item}
                  <button
                    type="button"
                    aria-label={`Remove ${item}`}
                    onClick={() =>
                      setAmenities((current) => current.filter((entry) => entry !== item))
                    }
                    className="text-ink-500 transition-colors hover:text-rose-600"
                  >
                    <CloseIcon className="size-3.5" />
                  </button>
                </li>
              ))}
          </ul>
        ) : null}

        <div className="mt-4 flex gap-2">
          <input
            value={customAmenity}
            onChange={(event) => setCustomAmenity(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomAmenity();
              }
            }}
            placeholder="Add your own amenity…"
            maxLength={40}
            className="h-11 flex-1 rounded-xl border border-ink-950/[0.12] bg-paper-warm/70 px-3.5 text-[15px] text-ink-950 outline-none transition-colors placeholder:text-ink-400 focus:border-spotlight/80 focus:bg-white focus:ring-4 focus:ring-spotlight/20"
          />
          <button
            type="button"
            onClick={addCustomAmenity}
            className="inline-flex h-11 items-center rounded-xl border border-ink-950/15 bg-white px-4 text-[14.5px] font-semibold text-ink-800 transition-colors hover:border-ink-950/30 hover:bg-paper-warm/70"
          >
            Add
          </button>
        </div>

        {amenities.length > 0 ? (
          <p className="mt-3 text-[13px] text-ink-500" aria-live="polite">
            {amenities.length} {amenities.length === 1 ? "amenity" : "amenities"} selected.
          </p>
        ) : null}
      </SectionCard>

      {/* -------------------------- host --------------------------- */}
      <SectionCard
        title="Host details"
        description="Read-only — pulled from your signed-in account so bookings always reach the right person."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className={labelClass}>Host name</span>
            <div className="relative mt-1.5">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-ink-400"
              >
                <UserIcon className="size-[18px]" />
              </span>
              <input
                value={hostName}
                readOnly
                disabled
                placeholder="Your display name"
                className="h-12 w-full cursor-not-allowed rounded-xl border border-ink-950/[0.1] bg-ink-950/[0.04] pl-11 pr-3.5 text-[15px] text-ink-500 outline-none"
              />
            </div>
          </div>
          <div>
            <span className={labelClass}>Host email</span>
            <div className="relative mt-1.5">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-ink-400"
              >
                <MailIcon className="size-[18px]" />
              </span>
              <input
                value={hostEmail}
                readOnly
                disabled
                placeholder="you@studio.com"
                className="h-12 w-full cursor-not-allowed rounded-xl border border-ink-950/[0.1] bg-ink-950/[0.04] pl-11 pr-3.5 text-[15px] text-ink-500 outline-none"
              />
            </div>
          </div>
        </div>
        {!hostEmail || !EMAIL_LIKE.test(hostEmail) ? (
          <p className="mt-3 text-[13px] font-medium text-amber-700">
            Your session hasn&apos;t resolved yet — the listing will be stamped with your
            account email the moment you submit.
          </p>
        ) : null}
      </SectionCard>

      {/* ------------------------- actions ------------------------- */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/my-listings")}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-ink-950/15 bg-white px-6 text-[15px] font-semibold text-ink-700 transition-colors hover:border-ink-950/30 hover:text-ink-950"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-spotlight px-7 text-[15px] font-semibold text-ink-950 shadow-[0_14px_28px_-18px_rgba(255,176,32,1)] transition-colors hover:bg-[#FFC24D] disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
        >
          {busy ? <Spinner className="size-4 text-ink-950/70" /> : null}
          {busy
            ? mode === "create"
              ? "Publishing…"
              : "Saving…"
            : mode === "create"
              ? "Publish studio"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
