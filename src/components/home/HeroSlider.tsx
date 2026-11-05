"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";

import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@/components/icons";

/**
 * Homepage banner slider (Swiper.js).
 *
 * Three slides — each with high-res artwork, a punchy headline, subtext and
 * the two required CTAs ("Explore Studios" / "Host Your Space", both → /studios).
 *
 * Behaviour: cross-fade, 6s autoplay with a matching progress bar, clickable
 * bullets, arrow + keyboard control, and autoplay disabled for visitors who
 * prefer reduced motion.
 */

type Slide = {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
  headline: [string, string];
  subtext: string;
};

const SLIDES: Slide[] = [
  {
    id: "photo",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Studio_Bts_%28140066927%29.jpeg/1920px-Studio_Bts_%28140066927%29.jpeg",
    alt: "Photographer working under studio lighting during a shoot",
    eyebrow: "Photography studios",
    headline: ["Shoot where the light", "hits exactly right."],
    subtext:
      "Daylight lofts, cyclorama bays and full blackout stages — priced by the hour and confirmed in seconds.",
  },
  {
    id: "stage",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Movie_production.jpg/1920px-Movie_production.jpg",
    alt: "Film crew working on a lit sound stage set",
    eyebrow: "Sound stages & film",
    headline: ["Build the set.", "Keep the schedule."],
    subtext:
      "Grid access, drive-in loading and cinema-ready blackout across 27 cities — hold your dates before the crew call.",
  },
  {
    id: "music",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Abbey_Road_Studios_2010-04-08_-_control_room_of_Studio_2.jpg/1920px-Abbey_Road_Studios_2010-04-08_-_control_room_of_Studio_2.jpg",
    alt: "Control room of a professional recording studio",
    eyebrow: "Music & podcast suites",
    headline: ["Hit record in a room", "that already sounds good."],
    subtext:
      "Neve control rooms, treated podcast booths and writing lofts — hourly rates, engineers on request.",
  },
];

const AUTOPLAY_DELAY = 6000;

/**
 * `prefers-reduced-motion`, read through the external-store API so the
 * server and the first client render agree (the effect-free pattern the
 * react-hooks lint rules ask for).
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function HeroSlider() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-roledescription="carousel"
      aria-label="StudioSpace highlights"
      className="relative isolate overflow-hidden bg-ink-950 text-white"
    >
      <div className="relative h-[clamp(32rem,74svh,44rem)] w-full">
        <Swiper
          modules={[Autoplay, EffectFade, Keyboard, A11y]}
          slidesPerView={1}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={prefersReducedMotion ? 0 : 850}
          loop={!prefersReducedMotion}
          keyboard={{ enabled: true }}
          grabCursor
          autoplay={
            prefersReducedMotion
              ? false
              : { delay: AUTOPLAY_DELAY, disableOnInteraction: false }
          }
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          a11y={{
            enabled: true,
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
            firstSlideMessage: "This is the first slide",
            lastSlideMessage: "This is the last slide",
          }}
          className="hero-swiper h-full w-full"
        >
          {SLIDES.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                {/* readability gradients */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/78 to-ink-950/35"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent"
                />

                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 pb-24 pt-14 sm:px-5 xl:px-8">
                  <div className="max-w-[44rem]">
                    <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[13px] font-medium text-ink-200 backdrop-blur">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-spotlight shadow-[0_0_10px_3px_rgba(255,176,32,0.6)]"
                      />
                      {slide.eyebrow}
                    </p>

                    <h1 className="mt-5 text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.038em] text-white sm:text-[3.4rem] lg:text-[4rem]">
                      {slide.headline[0]}
                      <br />
                      <span className="text-spotlight [text-shadow:0_0_40px_rgba(255,176,32,0.35)]">
                        {slide.headline[1]}
                      </span>
                    </h1>

                    <p className="mt-5 max-w-[36rem] text-[16.5px] leading-relaxed text-ink-300 sm:text-[17.5px]">
                      {slide.subtext}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/studios"
                        className="group inline-flex h-12 items-center gap-2 rounded-full bg-spotlight px-6 text-[15.5px] font-semibold text-ink-950 shadow-[0_18px_34px_-20px_rgba(255,176,32,1)] transition-colors hover:bg-[#FFC24D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
                      >
                        Explore Studios
                        <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                      <Link
                        href="/studios"
                        className="inline-flex h-12 items-center rounded-full border border-white/25 bg-white/[0.06] px-6 text-[15.5px] font-semibold text-white backdrop-blur transition-colors hover:border-white/45 hover:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
                      >
                        Host Your Space
                      </Link>
                    </div>

                    <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-ink-400">
                      <span className="inline-flex items-center gap-1.5">
                        <StarIcon className="size-3.5 text-spotlight" />
                        <strong className="font-semibold text-white">4.9</strong>
                        average across 1,240 studios
                      </span>
                      <span aria-hidden className="hidden sm:inline">
                        ·
                      </span>
                      <span>Free to browse, no booking fees</span>
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ------------------------ control bar ------------------------ */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-5 sm:px-5 xl:px-8">
            <div className="pointer-events-auto flex items-center gap-4">
              <span
                aria-hidden
                className="font-mono text-[13px] font-medium tabular-nums text-white/60"
              >
                {String(activeIndex + 1).padStart(2, "0")}
                <span className="text-white/30"> / </span>
                {String(SLIDES.length).padStart(2, "0")}
              </span>

              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label="Choose slide"
              >
                {SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={`Go to slide ${index + 1}: ${slide.eyebrow}`}
                    onClick={() => swiperRef.current?.slideToLoop(index)}
                    className="relative h-6 w-12 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-spotlight/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25" />
                    <span
                      className={`absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-spotlight ${
                        index === activeIndex ? "hero-bullet-fill" : "w-0"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="pointer-events-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous slide"
                className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/[0.07] text-white backdrop-blur transition-colors hover:border-white/45 hover:bg-white/[0.16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next slide"
                className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/[0.07] text-white backdrop-blur transition-colors hover:border-white/45 hover:bg-white/[0.16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
