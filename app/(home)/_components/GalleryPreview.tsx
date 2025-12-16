import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const images = [
	"/images/gallery/1.png",
	"/images/gallery/2.png",
	"/images/gallery/3.png",
	"/images/gallery/4.png",
	"/images/gallery/5.png",
	"/images/gallery/6.png",
	"/images/gallery/7.png",
	"/images/gallery/8.png",
	"/images/gallery/9.png",
	"/images/gallery/10.png",
];

function GalleryPreview() {
	return (
		<section className="relative z-10 md:py-24 py-4 md:px-8 mt-40 md:mt-20">
			<div className="flex w-full flex-col gap-10 px-4 md:px-8">
				{/* Heading + copy */}
				<div className="flex flex-col gap-4 md:max-w-4xl">
					<div className="font-rage md:text-7xl text-5xl leading-[40px] md:leading-[60px]">
						What you see is
						<br />
						what you get.
					</div>
					<p className="text-base leading-relaxed md:text-xl">
						No filters. No pretenses. Just real ingredients, handcrafted cocktails,
						and a kitchen that takes pride in every plate. What’s on the screen is
						exactly what arrives at your table. Visit our gallery to see what we
						offer.
					</p>
				</div>

				{/* Image grid */}
				<div className="relative">
					{/* Desktop: wide 5 x 2 grid */}
					<div className="hidden gap-3 rounded-3xl md:grid md:grid-cols-5 relative">
						{images.map((src, i) => (
							<div
								key={src}
								className={`relative aspect-square overflow-hidden rounded-2xl
								}`}
							>
								<Image
									src={src}
									alt={`Gallery image ${i + 1}`}
									fill
									className="object-cover"
									sizes="(min-width: 768px) 18vw"
								/>
							</div>
						))}
						<div className="absolute inset-0 bg-linear-to-b from-transparent to-white"></div>
					</div>

					{/* Mobile: 3 x 3 grid, cropped and stacked */}
					<div className="grid grid-cols-3 gap-2 rounded-2xl md:hidden relative">
						{images.slice(0, 9).map((src, i) => (
							<div
								key={src}
								className={`relative aspect-square overflow-hidden rounded-xl
								}`}
							>
								<Image
									src={src}
									alt={`Gallery image ${i + 1}`}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 33vw"
								/>
							</div>
						))}

						<div className="absolute inset-0 bg-linear-to-b from-transparent to-white"></div>
					</div>

					{/* Visit gallery button */}
					<div className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center md:inset-x-0 md:left-0 md:top-1/2">
						<Link
							href="/gallery"
							className="pointer-events-auto inline-flex items-center gap-2 rounded-sm bg-white/90 px-6 py-2 text-sm font-medium shadow md:text-lg"
						>
							Visit Gallery.
							<ExternalLink size={16} />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

export default GalleryPreview;
