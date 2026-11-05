// import type { Metadata } from "next";
// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";

// import { ArrowRightIcon, MapPinIcon, StarIcon } from "@/components/icons";
// import { StudioCard } from "@/components/studios/StudioCard";
// import { RequestBookingButton } from "@/components/studios/RequestBookingButton";
// import { categoryLabel } from "@/lib/site";
// // import { getStudioBySlug, getStudios } from "@/lib/studios";

// export const dynamic = "force-dynamic";

// type StudioDetailPageProps = {
//   params: Promise<{ slug: string }>;
// };

// export async function generateMetadata({
//   params,
// }: StudioDetailPageProps): Promise<Metadata> {
//   const { slug } = await params;
//   const studio = await getStudioBySlug(slug);

//   if (!studio) return { title: "Studio not found" };

//   return {
//     title: studio.title,
//     description: studio.description.slice(0, 160),
//   };
// }

// export default async function StudioDetailPage({
//   params,
// }: StudioDetailPageProps) {
//   const { slug } = await params;
//   const studio = await getStudioBySlug(slug);

//   if (!studio) notFound();

//   const location = [studio.area, studio.city, studio.country]
//     .filter(Boolean)
//     .join(", ");

//   const specs = [
//     { label: "Category", value: categoryLabel(studio.category) },
//     { label: "Capacity", value: `${studio.capacity} people` },
//     { label: "Floor area", value: `${studio.sizeSqft.toLocaleString()} sq ft` },
//     { label: "Rating", value: `${studio.rating.toFixed(1)} / 5` },
//   ];

//   const similar = (
//     await getStudios({ category: studio.category, limit: 12 })
//   ).filter((item) => item.slug !== studio.slug).slice(0, 3);

//   return (
//     <>
//       {/* ---------------------------- banner ---------------------------- */}
//       <section className="relative isolate bg-ink-950">
//         <div className="relative h-[16rem] w-full overflow-hidden sm:h-[22rem] lg:h-[26rem]">
//           <Image
//             src={studio.image}
//             alt={studio.title}
//             fill
//             priority
//             sizes="100vw"
//             className="object-cover"
//           />
//           <span
//             aria-hidden
//             className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/10"
//           />

//           <div className="absolute inset-x-0 top-0 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-5 xl:px-8">
//             <Link
//               href="/studios"
//               className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/20 bg-ink-950/50 px-4 text-[14px] font-semibold text-white backdrop-blur transition-colors hover:bg-ink-950/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
//             >
//               <ArrowRightIcon className="size-4 rotate-180" />
//               All studios
//             </Link>

//             <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-bold text-ink-950">
//               <StarIcon className="size-3.5 text-spotlight-deep" />
//               {studio.rating.toFixed(1)}
//               <span className="font-medium text-ink-400">
//                 ({studio.reviews} reviews)
//               </span>
//             </span>
//           </div>

//           <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-6 sm:px-5 xl:px-8">
//             <span className="inline-block rounded-full bg-white/12 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-white/20 backdrop-blur">
//               {categoryLabel(studio.category)}
//             </span>
//             <h1 className="mt-3 text-[2rem] font-semibold leading-[1.06] tracking-[-0.03em] text-white sm:text-[2.6rem]">
//               {studio.title}
//             </h1>
//             <p className="mt-2 flex items-center gap-1.5 text-[15px] text-ink-300">
//               <MapPinIcon className="size-4 text-ink-400" />
//               {location}
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ----------------------------- body ----------------------------- */}
//       <section className="bg-paper py-12 sm:py-16">
//         <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-5 lg:grid-cols-[1.35fr_0.65fr] xl:px-8">
//           <div>
//             <p className="text-[17px] leading-relaxed text-ink-600">
//               {studio.description}
//             </p>

//             <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
//               {specs.map((spec) => (
//                 <div
//                   key={spec.label}
//                   className="rounded-2xl border border-ink-950/[0.08] bg-white p-4"
//                 >
//                   <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
//                     {spec.label}
//                   </dt>
//                   <dd className="mt-1.5 text-[15.5px] font-semibold text-ink-950">
//                     {spec.value}
//                   </dd>
//                 </div>
//               ))}
//             </dl>

//             {studio.tags.length > 0 ? (
//               <div className="mt-8">
//                 <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
//                   What is included
//                 </h2>
//                 <ul className="mt-3 flex flex-wrap gap-2">
//                   {studio.tags.map((tag) => (
//                     <li
//                       key={tag}
//                       className="rounded-full border border-ink-950/[0.1] bg-white px-3.5 py-1.5 text-[14px] font-medium text-ink-700"
//                     >
//                       {tag}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : null}

//             <div className="mt-8 flex items-center gap-4 rounded-2xl border border-ink-950/[0.08] bg-white p-5">
//               <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-spotlight to-[#E08900] text-[15px] font-bold text-ink-950">
//                 {studio.host.name
//                   .split(" ")
//                   .map((part) => part[0])
//                   .slice(0, 2)
//                   .join("")
//                   .toUpperCase()}
//               </span>
//               <div className="min-w-0">
//                 <p className="truncate text-[16px] font-semibold text-ink-950">
//                   Hosted by {studio.host.name}
//                 </p>
//                 <p className="text-[14px] text-ink-500">
//                   {studio.host.verified
//                     ? "Identity and studio verified by StudioSpace"
//                     : "Verified StudioSpace host"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ------------------------- booking card ------------------------ */}
//           <aside className="lg:sticky lg:top-28 lg:self-start">
//             <div className="rounded-3xl border border-ink-950/[0.09] bg-white p-6 shadow-[0_40px_80px_-60px_rgba(11,11,15,0.9)]">
//               <p className="flex items-end gap-1.5">
//                 <span className="text-[34px] font-bold leading-none tracking-[-0.03em] text-ink-950">
//                   ${studio.pricePerHour}
//                 </span>
//                 <span className="pb-0.5 text-[15px] font-medium text-ink-400">
//                   / hour
//                 </span>
//               </p>
//               <p className="mt-2 text-[14px] text-ink-500">
//                 Minimum 2-hour block · free cancellation up to 48h before
//                 call time.
//               </p>

//               <div className="mt-5">
//                 <RequestBookingButton title={studio.title} />
//               </div>

//               <ul className="mt-5 grid gap-2.5 border-t border-ink-950/[0.08] pt-5">
//                 {[
//                   "No booking fees until checkout",
//                   `$${(studio.pricePerHour * 2).toFixed(0)} two-hour minimum`,
//                   "Host replies in under 4 minutes",
//                 ].map((line) => (
//                   <li
//                     key={line}
//                     className="flex items-start gap-2 text-[14px] text-ink-600"
//                   >
//                     <StarIcon className="mt-0.5 size-3.5 shrink-0 text-spotlight-deep" />
//                     {line}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </aside>
//         </div>
//       </section>

//       {/* -------------------------- similar --------------------------- */}
//       {similar.length > 0 ? (
//         <section className="border-t border-ink-950/[0.07] bg-white py-14 sm:py-16">
//           <div className="mx-auto max-w-7xl px-4 sm:px-5 xl:px-8">
//             <div className="flex flex-wrap items-end justify-between gap-4">
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-spotlight-deep">
//                   More like this
//                 </p>
//                 <h2 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.03em] text-ink-950">
//                   Other {categoryLabel(studio.category).toLowerCase()}
//                 </h2>
//               </div>
//               <Link
//                 href={`/studios?category=${studio.category}`}
//                 className="group inline-flex h-11 items-center gap-2 rounded-full border border-ink-950/15 bg-white px-5 text-[14.5px] font-semibold text-ink-800 transition-colors hover:border-ink-950/30 hover:bg-ink-950 hover:text-white"
//               >
//                 See all
//                 <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
//               </Link>
//             </div>

//             <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {similar.map((item) => (
//                 <StudioCard key={item.slug} studio={item} />
//               ))}
//             </div>
//           </div>
//         </section>
//       ) : null}
//     </>
//   );
// }
