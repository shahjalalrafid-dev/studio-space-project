"use client";

import Image from "next/image";
import { useState } from "react";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

/**
 * Detail-page gallery carousel (Swiper.js).
 *
 * Falls back to the single card artwork when the document has no extra
 * gallery shots, so listings created through /add-studio (one image URL)
 * still render the same component as the seeded demo data.
 */
export function StudioGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = images.length > 0 ? images : [];

  if (slides.length === 0) return null;

  return (
    <div
      aria-roledescription="carousel"
      aria-label={`${title} photo gallery`}
      className="group/gallery relative overflow-hidden rounded-3xl border border-ink-950/[0.08] bg-ink-950"
    >
      <Swiper
        modules={[Pagination, Keyboard, A11y]}
        slidesPerView={1}
        loop={slides.length > 1}
        keyboard={{ enabled: true }}
        grabCursor={slides.length > 1}
        pagination={
          slides.length > 1
            ? { clickable: true, dynamicBullets: true }
            : false
        }
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        a11y={{
          enabled: true,
          prevSlideMessage: "Previous photo",
          nextSlideMessage: "Next photo",
        }}
        className="aspect-[16/10] w-full"
      >
        {slides.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`}>
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={`${title} — photo ${index + 1} of ${slides.length}`}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 ? (
        <>
          <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-ink-950/70 px-3 py-1 text-[12px] font-semibold tabular-nums text-white backdrop-blur">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/35 via-transparent to-transparent"
          />
        </>
      ) : null}
    </div>
  );
}
