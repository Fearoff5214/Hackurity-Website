"use client";
import { Reveal, SectionHeading } from "./Reveal";

const GALLERY_ROW_SIZES = [5, 4, 5, 4] as const;

const GALLERY_IMAGES = Array.from({ length: 18 }, (_, i) => ({
  src: `/images/gallery/club-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: "REVA Cybersecurity Club event moment",
}));

export default function GallerySection() {
  let cursor = 0;
  const rows = GALLERY_ROW_SIZES.map((size) => {
    const row = GALLERY_IMAGES.slice(cursor, cursor + size);
    cursor += size;
    return row;
  });

  return (
    <section id="gallery" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
      <div className="w-fit max-w-full">
        <SectionHeading
          tag="Moments"
          title="Gallery"
          description="Hackathons, panels and workshops — a look back at the club in motion."
        />
      </div>

      <Reveal delay={0.1}>
        <div className="hc-grid mx-auto">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={`hc-row ${rowIndex % 2 === 1 ? "hc-row--offset" : ""}`}>
              {row.map((image, imgIndex) => (
                <div key={image.src} className="hc-cell">
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
