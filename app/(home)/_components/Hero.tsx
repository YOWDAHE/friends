import { Button } from "@/components/ui/button";
import { ExternalLink, Link2 } from "lucide-react";
import localFont from "next/font/local";
import Link from "next/link";
import React from "react";
import HeroGallery from "./HeroGallery";

// export const rage = localFont({
// 	src: [
// 		{
// 			path: "../../../public/fonts/rage_italic.woff2",
// 			weight: "400",
// 			style: "italic",
// 		},
// 	],
// 	variable: "--font-rage",
// });

function Hero() {
	return (
		<div className="relative overflow-x-clip flex justify-center w-full">
			<div className="absolute inset-0 md:backdrop-blur-[200px] backdrop-blur-[100px] h-[3000px] z-10"></div>

			{/* color balls */}
			<div className="hidden md:block">
				<div className="absolute bg-[#0065ea] size-180 rounded-full -top-[100px] -left-40 "></div>
				<div className="absolute bg-[#00E5FF] size-100 rounded-full top-[10px] right-100"></div>
				<div className="absolute bg-[#FF6200] size-100 rounded-full top-[40%] left-10"></div>
				<div className="absolute bg-[#FF00C8] size-80 rounded-full top-[50%] right-10"></div>
			</div>
			<div className="md:hidden">
				<div className="absolute bg-[#0065ea] size-50 rounded-full top-[100px] -left-10 "></div>
				<div className="absolute bg-[#00E5FF] size-50 rounded-full top-[60px] left-30"></div>
				<div className="absolute bg-[#FF6200] size-70 rounded-full top-[450px] left-0"></div>
				<div className="absolute bg-[#FF6200] size-70 rounded-full bottom-[450px] left-0"></div>
				<div className="absolute bg-[#FF00C8] size-50 rounded-full top-[400px] right-0"></div>
			</div>

			<div className="flex flex-col md:flex-row min-h-screen md:pt-52 pt-40 pb-20 relative z-20 max-w-[1400px] w-full">
				<div className="flex-2/3 md:pl-16 pl-4">
					<div>
						<p className="lg:text-[100px] text-5xl font-black lg:leading-24">
							Where Collaboration Meets Culinary Delight.
						</p>
						<div className="space-x-4 mt-10">
							<Button asChild size="lg" className=" rounded-sm">
								<Link href="/reserve">Reserve a spot</Link>
							</Button>
							<Button
								asChild
								size="lg"
								className="bg-white text-black rounded-sm hover:bg-white/80"
							>
								<Link href="/menu">Menu</Link>
							</Button>
						</div>
					</div>
					<div className="flex-1/3 md:hidden">
						<HeroGallery />
					</div>
					<div className="md:mt-80 mt-20 flex flex-col gap-8">
						<p className={`font-rage md:text-7xl text-5xl`}>Get to know us.</p>
						<p className="md:text-2xl text-lg md:max-w-2xl max-w-sm">
							At Friends, we believe in the power of connection—whether it’s over a
							delicious meal, a crafted cocktail, or a shared workspace. Nestled in the
							heart of the city, our restaurant, kitchen, and cocktails lounge is
							designed to be a vibrant hub for like-minded individuals to gather,
							collaborate, and unwind.
						</p>
						<Link
							href="/about"
							className="flex gap-2 md:text-xl text-base items-center text-orange-600"
						>
							Read More
							<ExternalLink size={20} />
						</Link>
					</div>
				</div>
				<div className="flex-1/3 hidden md:block">
					<HeroGallery />
				</div>
			</div>
		</div>
	);
}

export default Hero;
