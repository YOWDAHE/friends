import React from "react";
import Image from "next/image";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

function page() {
	return (
		<div className="relative min-h-screen overflow-clip">
			<Header />
			<div className="absolute inset-0 md:backdrop-blur-[200px] backdrop-blur-[100px] h-full z-10"></div>
			{/* color balls */}
			<div className="hidden md:block">
				<div className="absolute bg-[#FF8800] size-80 rounded-full top-10 left-10"></div>
				<div className="absolute bg-[#FF6200] size-100 rounded-full top-100 right-10"></div>
				<div className="absolute bg-[#6100E9] size-200 rounded-full top-[60%] right-10"></div>
				<div className="absolute bg-[#00178C] size-200 rounded-full -bottom-60 -left-20"></div>
			</div>
			<div className="md:hidden">
				<div className="absolute bg-[#FF8800]/70 size-70 rounded-full top-0 left-0"></div>
				<div className="absolute bg-[#FF8800]/70 size-70 rounded-full top-[40%] right-0"></div>
				<div className="absolute bg-[#00178C] size-80 rounded-full bottom-0 -right-10"></div>
				<div className="absolute bg-[#6100E9] size-50 rounded-full bottom-30 -left-10"></div>
			</div>
			<div className="z-20 relative pt-20 md:px-8">
				<section className="relative z-10 md:py-24 py-16">
					<h2 className="font-black text-5xl md:text-7xl leading-[40px] md:leading-[56px] ml-4">
						Our Concept
					</h2>
					<div className="mx-auto flex w-full flex-col gap-10 px-4 md:flex-row md:items-center md:px-8 md:mt-20 mt-10">
						{/* Left: Heading + copy */}
						<div className="flex-1 flex flex-col gap-4 max-w-2xl mt-10 md:mt-0">
							<p className="text-base md:text-xl leading-relaxed ">
								Friends isn’t just a place to eat and drink; it’s a community. By day,
								our space transforms into an inspiring co-working environment, equipped
								with high-speed Wi-Fi and cozy nooks that invite creativity and
								productivity. Share ideas over artisanal coffee, host meetings in our
								versatile spaces, or simply enjoy the buzz of fellow innovators around
								you.
							</p>
						</div>

						{/* Right: stacked images */}
						<div className="flex-1 flex md:justify-center justify-end items-center pr-10 md:p-0">
							<div className="right-80 top-24 h-64 w-44 rotate-10 overflow-hidden rounded-sm shadow-xl md:left-40 md:top-32 md:h-100 md:w-80">
								<Image
									src="/images/about/day.png"
									alt="Chef plating dish"
									fill
									className="object-cover"
									sizes="(max-width: 768px) 50vw, 25vw"
								/>
							</div>
						</div>
					</div>
					<div className="mx-auto flex w-full flex-col-reverse gap-10 px-4 md:flex-row-reverse md:items-center md:px-8 md:mt-20 -mt-40">
						{/* Left: Heading + copy */}
						<div className="flex-1 flex flex-col gap-4 max-w-2xl mt-10 md:mt-0">
							<p className="text-base md:text-xl leading-relaxed text-end text-white">
								Friends isn’t just a place to eat and drink; it’s a community. By day,
								our space transforms into an inspiring co-working environment, equipped
								with high-speed Wi-Fi and cozy nooks that invite creativity and
								productivity. Share ideas over artisanal coffee, host meetings in our
								versatile spaces, or simply enjoy the buzz of fellow innovators around
								you.
							</p>
						</div>

						{/* Right: stacked images */}
						<div className="flex-1 flex md:justify-center items-center pl-10 md:p-0">
							<div className="left-40 top-24 h-64 w-44 -rotate-10 overflow-hidden rounded-sm shadow-xl md:left-40 md:top-32 md:h-100 md:w-80">
								<Image
									src="/images/about/night.png"
									alt="Chef plating dish"
									fill
									className="object-cover"
									sizes="(max-width: 768px) 50vw, 25vw"
								/>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default page;
