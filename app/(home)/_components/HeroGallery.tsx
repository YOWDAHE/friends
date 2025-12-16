// app/components/hero-gallery.tsx
"use client";

import Image from "next/image";
import React from "react";

const imagePaths = Array.from(
	{ length: 14 },
	(_, i) => `/images/hero_section/${i + 1}.png`
);

const TOTAL_DESKTOP_CELLS = 18; // 3 x 6
const TOTAL_MOBILE_CELLS = 12; // 6 x 3 (same amount, different layout)

// helper to get N items, repeating if necessary
function getRepeatedImages(count: number) {
	const result: string[] = [];
	for (let i = 0; i < count; i++) {
		result.push(imagePaths[i % imagePaths.length]);
	}
	return result;
}

const desktopImages = getRepeatedImages(TOTAL_DESKTOP_CELLS);
const mobileImages = getRepeatedImages(TOTAL_MOBILE_CELLS);

export function HeroGallery() {
	return (
		<div className="w-full">
			{/* Mobile: 6 rows x 3 cols */}
			<div className="grid grid-cols-4 grid-rows-3 gap-1 gap-x-1.5 md:hidden mt-10">
				{mobileImages.map((src, index) => (
					<div
						key={`m-${index}`}
						className="relative h-32 w-24 overflow-hidden rounded-sm sm:h-40"
					>
						<Image
							src={src}
							alt={`Hero image ${index + 1}`}
							fill
							className="object-cover"
							// sizes="(max-width: 768px) 20vw"
						/>
					</div>
				))}
			</div>

			{/* Desktop: 3 cols x 6 rows */}
			<div className="hidden grid-cols-3 grid-rows-6 gap-2 gap-x-20 md:grid">
				{desktopImages.map((src, index) => (
					<div
						key={`d-${index}`}
						className="relative h-52 w-44 overflow-hidden rounded-sm lg:h-56"
					>
						<Image
							src={src}
							alt={`Hero image ${index + 1}`}
							fill
							className="object-cover"
							// sizes="(min-width: 768px) 20vw"
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default HeroGallery;
