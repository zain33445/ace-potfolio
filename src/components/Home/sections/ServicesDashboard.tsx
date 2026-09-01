"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Services mosaic — 3×2 grid that fits one screen.
 * Order: 3D Renderings, Shop Drawings, Cost Estimation, Permit Sets.
 * Drop-in replacement for ServicesDashboard on the homepage.
 *
 * rowHeight/gap match the tweak defaults from the design template
 * (230px rows, 10-14px gap). Descriptions are hidden at rest so the
 * tiles stay compact; they reveal on hover.
 */

type Tile = {
  href: string;
  src: string;
  /** Carousel: if provided, cycles through these instead of `src`. */
  images?: string[];
  alt: string;
  position: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Desktop grid placement inside the 3-col / 2-row mosaic. */
  area: string;
  titleSize: string;
};
const hoverBase =
  "hover:scale-[1.15] hover:shadow-2xl hover:z-10 transition-[transform,box-shadow,backdrop-filter] duration-700 ease-in-out hover:backdrop-blur-lg";
const hoverBase1 = ` transition-transform
  duration-700
  ease-in-out
  hover:z-10
  bg
  hover:scale-110`;

const TILES: Tile[] = [
  {
    href: "/3d-rendering-services/",
    src: "/3drendering.webp",
    images: ["/hero-renderings.webp", "/HTeao-3D-Renders.webp", "/3drendering.webp"],
    alt: "3D rendering",
    position: "center 60%",
    eyebrow: "Architectural",
    title: "3D Renderings",
    description:
      "Photorealistic renderings built to support permitting, coordination, and presentation.",
    area: "lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    titleSize: "text-2xl lg:text-[2.2rem]",
  },
  {
    href: "/shop-drawing-services/",
    src: "/designs.webp",
    alt: "Shop drawings",
    position: "center 35%",
    eyebrow: "MEP · BIM",
    title: "Shop Drawings",
    description:
      "Fabrication-ready coordination that resolves spatial conflicts before breaking ground.",
    area: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    titleSize: "text-xl lg:text-[1.7rem]",
  },
  {
    href: "/cost-estimating/",
    src: "/cost.webp",
    alt: "Cost estimation",
    position: "center 30%",
    eyebrow: "Estimating · Budgeting & Bidding",
    title: "Cost Estimation",
    description:
      "The ACE Services delivers construction cost estimating for general " +
      "contractors, developers, and subcontractors across the United States. " +
      "Every estimate is prepared to AACE Class 3 accuracy using PlanSwift and " +
      "Bluebeam, with quantity takeoffs, material lists, and CSI-organized cost " +
      "breakdowns — turned around in 24-48 hours.",
    area: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3",
    titleSize: "text-xl lg:text-[1.7rem]",
  },
  {
    href: "/permit-set-services/",
    src: "/permit.webp",
    images: ["/permit.webp", "/permit-slide-2.webp", "/permit-slide-3.webp"],
    alt: "Permit sets",
    position: "center 25%",
    eyebrow: "Documentation",
    title: "Permit Sets",
    description:
      "Renderings, shop drawings, and stamped permit sets from delivered projects.",
    area: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3",
    titleSize: "text-xl lg:text-[1.9rem]",
  },
];

function ServiceTile({ tile }: { tile: Tile }) {
  const slides = tile.images ?? [tile.src];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <Link
      href={tile.href}
      className={`${hoverBase} group relative flex h-60 flex-col justify-end overflow-hidden rounded-[20px] lg:h-auto ${tile.area}`}
    >
      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={tile.alt}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover transition-[opacity,transform] duration-700 ease-in-out group-hover:scale-[1.04] ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: tile.position }}
        />
      ))}

      {/* Hover black overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />

      {/* Existing gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="relative p-5 text-white lg:p-6">
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden font-mono text-[10px] font-bold tracking-[0.1em] text-[#ff8c3a] uppercase">
            {tile.eyebrow}
          </div>
        </div>

        <h3
          className={`mt-1.5 font-semibold tracking-[-0.03em] ${tile.titleSize}`}
        >
          {tile.title}
        </h3>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-white/85">
              {tile.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ServicesDashboard() {
  return (
    <section id="services" className="px-6 md:px-8">
      <div className="mx-auto max-w-[1060px] mt-5">
        <div className="flex flex-col gap-2.5 lg:grid lg:grid-cols-3 lg:grid-rows-[repeat(2,350px)] lg:gap-[10px]">
          {TILES.map((tile) => (
            <ServiceTile key={tile.title} tile={tile} />
          ))}
        </div>
        <div className="mb-[18px] mt-5 flex flex-wrap items-end justify-end">
          <Link
            href="/services/"
            className="text-[25px] whitespace-nowrap text-[#c25400] hover:underline"
          >
            All services&nbsp;›
          </Link>
        </div>
      </div>
    </section>
  );
}
