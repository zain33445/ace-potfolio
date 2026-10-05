import { PortableText, type PortableTextBlock } from "@portabletext/react";

/**
 * Renders the portable-text prose blocks on a location page.
 *
 * The blog renders migrated WordPress HTML through dangerouslySetInnerHTML,
 * which is the wrong tool for content authored in the Studio — you cannot link
 * or bold anything without writing HTML by hand. These blocks are portable
 * text instead, so marks work normally.
 */

interface LocationProseProps {
  value?: PortableTextBlock[];
  className?: string;
}

export default function LocationProse({
  value,
  className = "",
}: LocationProseProps) {
  if (!value || value.length === 0) return null;

  return (
    <div
      className={`space-y-5 font-[family-name:var(--font-space)] text-base leading-relaxed text-on-surface-variant md:text-lg ${className}`}
    >
      <PortableText
        value={value}
        components={{
          block: {
            normal: ({ children }) => <p>{children}</p>,
            h2: ({ children }) => (
              <h2 className="mt-10 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-8 font-[family-name:var(--font-space)] text-xl font-bold text-on-background md:text-2xl">
                {children}
              </h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-5 italic">
                {children}
              </blockquote>
            ),
          },
          marks: {
            link: ({ children, value }) => {
              const href = typeof value?.href === "string" ? value.href : "#";
              const external = href.startsWith("http");
              return (
                <a
                  href={href}
                  className="link-underline text-primary hover:text-[#E55A00]"
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {children}
                </a>
              );
            },
          },
        }}
      />
    </div>
  );
}