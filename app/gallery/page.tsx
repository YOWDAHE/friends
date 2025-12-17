import React from "react";
import Image from "next/image";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

const galleryImages = [
	// Top row – large hero image then two supporting images
	{ src: "/images/gallery/1.png", alt: "Dessert with sauce", cols: 2, rows: 2 },
	{ src: "/images/gallery/2.png", alt: "Friends logo in coffee", cols: 1, rows: 1 },
	{ src: "/images/gallery/3.png", alt: "Bar interior", cols: 1, rows: 1 },

	// Second row – smaller tiles and a wide bar shot
	{ src: "/images/gallery/4.png", alt: "Cocktails on bar", cols: 1, rows: 1 },
	{ src: "/images/gallery/5.png", alt: "Plated dessert", cols: 1, rows: 1 },
	{ src: "/images/gallery/6.png", alt: "Restaurant bar counter", cols: 2, rows: 2 },

	// Third row – food & coffee focus
	{ src: "/images/gallery/7.png", alt: "Salad and drinks", cols: 2, rows: 1 },
	{ src: "/images/gallery/8.png", alt: "Coffee and pastries", cols: 2, rows: 2 },
	{ src: "/images/gallery/9.png", alt: "Coffee and cake", cols: 1, rows: 1 },

	// Bottom rows – dining room, cocktails, and people
	{ src: "/images/gallery/10.png", alt: "Salmon dish", cols: 1, rows: 1 },
	{ src: "/images/gallery/11.png", alt: "Veggie plate", cols: 1, rows: 1 },
	{ src: "/images/gallery/12.png", alt: "Cocktail with flower", cols: 1, rows: 1 },
	{ src: "/images/gallery/13.png", alt: "Dining room", cols: 2, rows: 2 },
	{ src: "/images/gallery/14.png", alt: "Friends at a table", cols: 2, rows: 1 }
];

function GalleryPage() {
	return (
		<div className="relative min-h-screen overflow-clip">
			<Header />

			{/* soft background gradient */}
			{/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,184,133,0.45),transparent_55%),radial-gradient(circle_at_bottom,rgba(255,192,203,0.45),transparent_55%)]" /> */}

			<main className="relative z-10 pt-24 md:pt-32 pb-20">
				<section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 md:px-8">
					{/* Heading */}
					<header className="text-center space-y-4">
						<h1 className="text-5xl md:text-7xl font-black tracking-tight">Gallery</h1>
						<p className="mx-auto max-w-2xl text-sm md:text-base leading-relaxed text-gray-700">
							If you&apos;re like us, you eat with your eyes first. So please indulge in a sampling of
							some of our favorite dishes.
						</p>
					</header>

					{/* Grid */}
					<div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 md:auto-rows-[180px] lg:auto-rows-[220px]">
						{galleryImages.map((image, index) => (
							<div
								key={image.src}
								className={`relative w-full overflow-hidden rounded-sm shadow-sm h-32 md:h-auto
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
							</div>
						))}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default GalleryPage;