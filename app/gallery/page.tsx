"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import { X } from "lucide-react";

const galleryImages = [
	{ src: "/images/gallery/1.png", alt: "Dessert with sauce", cols: 2, rows: 2 },
	{
		src: "/images/gallery/2.png",
		alt: "Friends logo in coffee",
		cols: 1,
		rows: 1,
	},
	{ src: "/images/gallery/3.png", alt: "Bar interior", cols: 1, rows: 1 },
	{ src: "/images/gallery/4.png", alt: "Cocktails on bar", cols: 1, rows: 1 },
	{ src: "/images/gallery/5.png", alt: "Plated dessert", cols: 1, rows: 1 },
	{
		src: "/images/gallery/6.png",
		alt: "Restaurant bar counter",
		cols: 2,
		rows: 2,
	},
	{ src: "/images/gallery/7.png", alt: "Salad and drinks", cols: 2, rows: 1 },
	{ src: "/images/gallery/8.png", alt: "Coffee and pastries", cols: 2, rows: 2 },
	{ src: "/images/gallery/9.png", alt: "Coffee and cake", cols: 1, rows: 1 },
	{ src: "/images/gallery/10.png", alt: "Salmon dish", cols: 1, rows: 1 },
	{ src: "/images/gallery/11.png", alt: "Veggie plate", cols: 1, rows: 1 },
	{
		src: "/images/gallery/12.png",
		alt: "Cocktail with flower",
		cols: 1,
		rows: 1,
	},
	{ src: "/images/gallery/13.png", alt: "Dining room", cols: 2, rows: 2 },
	{ src: "/images/gallery/14.png", alt: "Friends at a table", cols: 2, rows: 1 },
];

function GalleryPage() {
	const [selected, setSelected] = useState<null | { src: string; alt: string }>(
		null
	);

	return (
		<div className="relative min-h-screen overflow-clip">
			<Header />

			<main className="relative z-10 pb-20 pt-24 md:pt-32">
				<section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 md:px-8">
					{/* Heading */}
					<header className="space-y-4 text-center">
						<h1 className="text-5xl font-black tracking-tight md:text-7xl">
							Gallery
						</h1>
						<p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-700 md:text-base">
							If you&apos;re like us, you eat with your eyes first. So please indulge
							in a sampling of some of our favorite dishes.
						</p>
					</header>

					{/* Grid */}
					<div className="grid grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4 md:gap-4 lg:auto-rows-[220px]">
						{galleryImages.map((image, index) => (
							<button
								key={image.src}
								type="button"
								onClick={() => setSelected({ src: image.src, alt: image.alt })}
								className={`relative h-32 w-full overflow-hidden rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-white/80 md:h-auto
                  ${image.cols === 2 ? "md:col-span-2" : ""}
                  ${image.rows === 2 ? "md:row-span-2" : ""}
                  ${index === 0 ? "col-span-2" : ""}
                `}
							>
								<Image
									src={image.src}
									alt={image.alt}
									fill
									className="object-cover transition-transform duration-500 hover:scale-105"
									sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
								/>
							</button>
						))}
					</div>
				</section>
			</main>

			<Footer />

			{/* Fullscreen viewer */}
			{selected && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
					onClick={() => setSelected(null)}
				>
					<button
						type="button"
						aria-label="Close"
						className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white hover:bg-black"
						onClick={(e) => {
							e.stopPropagation();
							setSelected(null);
						}}
					>
						<X className="h-5 w-5" />
					</button>

					<div
						className="relative h-[70vh] w-[90vw] max-w-5xl"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							src={selected.src}
							alt={selected.alt}
							fill
							className="object-contain"
							sizes="100vw"
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default GalleryPage;
