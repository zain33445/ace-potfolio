"use client";

import Link from "next/link";
import { TextRepel } from "@/src/components/ui/text-repel";
import TextPressure from "@/src/components/ui/TextPressure";

// Note:
// Make sure the font you're using supports all the variable properties.
// React Bits does not take responsibility for the fonts used

export default function Footer() {
  const navItems = [
    { label: "ABOUT", href: "/about-us/" },
    { label: "BLOGS", href: "/blog/" },
    { label: "SERVICES", href: "/services/" },
    { label: "CONTACT", href: "/contact-us/" },
    { label: "PROJECTS", href: "/projects/" },
    { label: "CALCULATOR", href: "/calculator/" },
    // Solutions — internal links so these pages stop being sitemap orphans.
    { label: "HOUSTON ESTIMATING", href: "/houston-construction-estimating/" },
    { label: "ADU COST GUIDE", href: "/adu-construction-cost/" },
    { label: "WAREHOUSE DEVELOPMENT", href: "/warehouses-development/" },
    { label: "BLUEPRINT ESTIMATION", href: "/blueprint-estimation/" },
    { label: "QUANTITY SURVEYOR", href: "/quantity-surveyor-services/" },
    { label: "privacy policy", href: "/privacy-policy/" },
    { label: "terms & conditions", href: "/terms-and-conditions/" },
  ];

  const standards = [
    "ISO 9001 METRICS",
    "CSI MASTERFORMAT",
    "AACE CLASS 3 INDEX",
  ];

  const communication = [
    { text: "+1-346-458-0237", href: "tel:+13464580237" },
    { text: "16319 Hillside Garden LN", href: null },
    { text: "Houston, TX 77084", href: null },
    { text: "info@theaceservices.com", href: "mailto:info@theaceservices.com" },
    {
      text: "Find us on Google Maps",
      href: "https://www.google.com/maps/place/The+ACE+Services/@29.8730417,-95.6557672,17z/data=!3m1!4b1!4m6!3m5!1s0x8640d74886712a23:0xfe66afe536f5553a!8m2!3d29.8730417!4d-95.6557672!16s%2Fg%2F11ybg9t9m0",
    },
  ];

  return (
    <footer
      id="main-footer"
      className="
        bg-primary bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]
        border-t border-white/10
        cursor-pointer
        relative
      "
    >
      <div
        className="
          w-full
          mx-auto pt-20 pb-10
          md:px-5
        "
      >
        <div
          className="
            grid grid-cols-1
            mb-16
            align-center
            gap-16 justify-items-center
            lg:grid-cols-12
          "
        >
          {/* Left: Brand + tagline */}
          <div
            className="
              space-y-8
              text-center
              lg:text-left lg:col-span-5
            "
          >
            <br />
            <br />
            <TextRepel
              text="Accurate construction cost estimating for general builders, civil engineers, and trade specialists nationwide. Fewer errors, better bids."
              radius={80}
              strength={50}
              mode="repel"
              className="
                max-w-md md:max-w-lg
                font-sans text-xl md:text-2xl text-white/80 leading-relaxed font-semibold
              "
            />
            <br />
          </div>

          {/* Right: 3-column grid */}
          <div
            className="
              grid grid-cols-2
              gap-5 justify-items-center
              lg:col-span-7
                md:gap-50

            "
          >
            {/* Navigation */}
            <div
              className="
                flex flex-col
                gap-1 items-start
              "
            >
              <TextRepel
                text="Navigation"
                radius={60}
                strength={35}
                mode="repel"
                className="
                  mb-1
                  font-mono text-base md:text-lg text-center text-white tracking-wider font-bold
                "
              />
              {navItems.map((item) => (
                // Wrap in <Link> so the footer nav renders real <a href> tags
                // for crawlers (Google's internal-link graph, not just visual
                // clicks). Next.js Link intercepts clicks for client-side nav.
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit hover:text-white transition-colors"
                >
                  <TextRepel
                    text={item.label}
                    radius={60}
                    strength={35}
                    mode="repel"
                    className="
                      w-fit
                      text-left font-sans text-base md:text-lg font-semibold text-white/70
                      transition-colors cursor-pointer
                      hover:text-white link-underline uppercase
                    "
                  />
                </Link>
              ))}
            </div>

            <div
              className="
                flex flex-col
                mr-9
                font-bold
                justify-between
              "
            >
              {/* Standards */}
              <div
                className="
                  flex flex-col
                  gap-1 items-end
                "
              >
                <TextRepel
                  text="Standards"
                  radius={60}
                  strength={35}
                  mode="repel"
                  className="
                    mb-1
                    font-mono text-base md:text-lg text-white tracking-wider font-bold
                  "
                />
                {standards.map((item) => (
                  <TextRepel
                    key={item}
                    text={item}
                    radius={60}
                    strength={35}
                    mode="repel"
                    className="
                      font-sans text-base md:text-lg text-white/70 font-semibold
                    "
                  />
                ))}
              </div>

              {/* Communication */}
              <div
                className="
                  flex flex-col
                  text-left
                  gap-1 items-end
                "
              >
                <TextRepel
                  text="Communication"
                  radius={60}
                  strength={35}
                  mode="repel"
                  className="
                    mb-1
                    font-mono text-base md:text-lg text-white tracking-wider font-bold
                  "
                />
                {communication.map((item) => {
                  const repel = (
                    <TextRepel
                      text={item.text}
                      radius={60}
                      strength={35}
                      mode="repel"
                      className="
                        font-sans text-base md:text-lg text-white/70 font-semibold
                        cursor-pointer
                      "
                    />
                  );
                  return item.href ? (
                    <a
                      key={item.text}
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {repel}
                    </a>
                  ) : (
                    <div key={item.text}>{repel}</div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ position: "relative"}}
          className="
            height-[200px]
            md:height-[300px]
            my-[5rem]
          "
        >
          <TextPressure
            as="p"
            text="THE ACE SERVICES"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic={false}
            textColor="#FFFFFF"
            strokeColor="#5227FF"
            minFontSize={36}
            proximity={600}
          />
        </div>
        {/* Bottom bar */}
        <div
          className="
            pt-8
            text-center
            w-[75%]
            m-auto
            border-t border-white/50
          "
        >
          <TextRepel
            text="©2026 THE ACE SERVICES. ALL CODES SECURED."
            radius={80}
            strength={35}
            mode="repel"
            className="
              font-mono text-base md:text-lg text-white/70 font-bold
            "
          />
        </div>
      </div>
    </footer>
  );
}
