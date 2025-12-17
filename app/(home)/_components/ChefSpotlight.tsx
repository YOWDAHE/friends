import React from "react";
import Image from "next/image";

function ChefSpotlight() {
	return (
		<div className="relative min-h-screen md:px-8 flex justify-center w-full">
			{/* <div className="absolute inset-0 md:backdrop-blur-[200px] backdrop-blur-[100px] h-[3000px] z-10"></div> */}
			{/* color balls */}
			<div className="hidden md:block">
				<div className="absolute bg-[#B700FF] size-100 rounded-full top-[50%] right-10"></div>
				<div className="absolute bg-[#FF0000] size-80 rounded-full top-[50%] left-10"></div>
			</div>
			<div className="md:hidden">
				<div className="absolute bg-[#FF6200]/70 size-70 rounded-full bottom-0 left-0"></div>
				<div className="absolute bg-[#B700FF]/70 size-50 rounded-full top-100 right-0"></div>
			</div>
			<div className="z-20 relative mt-20 max-w-[1400px] w-full">
				<section className="relative z-10 md:py-24 py-16">
					<h2 className="font-rage text-5xl md:text-7xl leading-[40px] md:leading-[56px] ml-4">
						Chef &amp; Mixologist
						<br />
						Spotlight
					</h2>
					<div className="mx-auto flex w-full flex-col-reverse gap-10 px-4 md:flex-row md:items-center md:px-8 md:mt-20 mt-10">
						{/* Left: Heading + copy */}
						<div className="flex-1 flex flex-col gap-4 max-w-2xl mt-10 md:mt-0">
							<p className="text-base md:text-xl leading-relaxed">
								Great flavor doesn&apos;t happen by accident. It&apos;s crafted by
								people who care deeply about every ingredient, every technique, and
								every guest experience.
							</p>

							<p className="text-base md:text-xl leading-relaxed">
								Our kitchen is led by a chef who believes in bold flavors, seasonal
								ingredients, and plates that are as satisfying as they are refined. At
								the bar, our mixologists balance creativity with precision— crafting
								cocktails that are both familiar and unexpected.
							</p>

							<p className="text-base md:text-xl leading-relaxed">
								Together, they shape a menu designed to be honest, expressive, and
								unforgettable.
							</p>
						</div>

						{/* Right: stacked images */}
						<div className="flex-1 flex justify-center items-center md:-mt-40">
							<div className="relative h-80 w-56 md:h-[420px] md:w-72">
								{/* Back (tilted) image */}
								<div className="absolute left-20 top-24 h-64 w-44 rotate-6 overflow-hidden rounded-3xl shadow-xl md:left-40 md:top-32 md:h-90 md:w-64">
									<Image
										src="/images/hero_section/chef/chef.png"
										alt="Chef plating dish"
										fill
										className="object-cover"
										sizes="(max-width: 768px) 50vw, 25vw"
									/>
								</div>

								{/* Front image */}
								<div className="absolute inset-x-0 top-0 -left-32 mx-auto h-64 w-44 overflow-hidden rounded-3xl shadow-xl md:h-90 md:w-64 md:-left-30 -rotate-6">
									<Image
										src="/images/hero_section/chef/mixologist.png"
										alt="Mixologist preparing a drink"
										fill
										className="object-cover"
										sizes="(max-width: 768px) 50vw, 25vw"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default ChefSpotlight;
