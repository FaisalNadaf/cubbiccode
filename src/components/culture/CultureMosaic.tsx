"use client";

import Image from "next/image";
import PixelTransition from "@/components/PixelTransition";

/* Static "Company Culture & Ethics" plates (public/images/companyCulture). */
const cultureImages = [
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0002.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0003.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0004.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0005.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0006.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0007.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0008.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0009.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0010.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0011.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0012.jpg",
  "/images/companyCulture/Cubiccode Company Culture and ethics_page-0013.jpg",
];

/* Candid team moments (public/images/Moments) — revealed via the pixel effect. */
const moments = [
  "/images/Moments/1.jpg",
  "/images/Moments/2016.jpeg",
  "/images/Moments/2020.jpg",
  "/images/Moments/award-bg.jpg",
  "/images/Moments/devfest2022_2.jpg",
  "/images/Moments/DSC_5539.JPG",
  "/images/Moments/DSC_5557.JPG",
  "/images/Moments/DSC_7895.JPG",
  "/images/Moments/EPCSCL06-GroupPicture.JPG",
  "/images/Moments/_MG_9991.JPG",
  "/images/Moments/IMG_7820.JPG",
  "/images/Moments/IMG_8671.JPG",
  "/images/Moments/20250914_091218.jpg",
  "/images/Moments/20250914_112031.jpg",
  "/images/Moments/20250914_123706.jpg",
  "/images/Moments/WhatsAppImage2024-06-08at11.50.15AM.jpeg",
  "/images/Moments/WhatsAppImage2024-06-08at11.50.16AM.jpeg",
  "/images/Moments/WhatsAppImage2025-11-01at6.28.58PM.jpeg",
];

const TILE_COUNT = 30; // matches the reference layout (5 cols × 6 rows)
const SIZES = "(min-width: 768px) 20vw, 33vw";

export function CultureMosaic() {
  return (
    // gap-free + odd column counts (3 / 5) → a seamless true chessboard.
    <div className="grid grid-cols-3 md:grid-cols-5">
      {Array.from({ length: TILE_COUNT }, (_, i) => {
        const isPixel = i % 2 === 1;

        // Even tiles — the company-culture plates, shown as-is.
        if (!isPixel) {
          const src = cultureImages[Math.floor(i / 2) % cultureImages.length];
          return (
            <div key={i} className="relative aspect-square overflow-hidden">
              <Image
                src={src}
                alt="Cubiccode company culture & ethics"
                fill
                sizes={SIZES}
                className="object-cover"
              />
            </div>
          );
        }

        // Odd tiles — start as an empty white block; hover pixel-reveals the photo.
        const src = moments[((i - 1) / 2) % moments.length];
        return (
          <PixelTransition
            key={i}
            aspectRatio="100%"
            gridSize={8}
            pixelColor="#1B6EC2"
            animationStepDuration={0.3}
            className="w-full rounded-none border-0 bg-white"
            firstContent={<div className="h-full w-full bg-white" />}
            secondContent={
              <Image
                src={src}
                alt="A moment from life at Cubiccode"
                fill
                sizes={SIZES}
                className="object-cover"
              />
            }
          />
        );
      })}
    </div>
  );
}
