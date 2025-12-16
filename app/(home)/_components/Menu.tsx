import Image from "next/image";
import React from "react";

const items = [
	{
		title: "Drinks",
		description: "We have over 20 items under drinks. Click here to explore more",
		image: "/images/hero_section/menu/1.png",
	},
	{
		title: "Dinner",
		description:
			"We have over 30 meals you can enjoy. Click here to explore more",
		image: "/images/hero_section/menu/2.png",
	},
	{
		title: "Happy Hour",
		description:
			"Enjoy different bites and drinks with unique people. Click here to see more",
		image: "/images/hero_section/menu/3.png",
	},
];

function Menu() {
	return (
        <div className="relative overflow-y-hidden min-h-screen">
            
			{/* color balls */}
			<div className="hidden md:block">
				<div className="absolute bg-[#B700FF] size-100 rounded-full bottom-100 right-10"></div>
				<div className="absolute bg-[#FF0000] size-80 rounded-full top-[50%] right-100"></div>
			</div>
			<div className="md:hidden">
				<div className="absolute bg-[#FF6200]/70 size-70 rounded-full bottom-0 left-0"></div>
				<div className="absolute bg-[#B700FF]/70 size-50 rounded-full top-100 right-0"></div>
			</div>
			<div className="z-20 relative mt-20">
				<section className="relative z-10 md:px-8 px-4">
					<div className="flex w-full flex-col gap-10 md:px-8">
						{/* Heading */}
						<h2 className="font-rage md:text-7xl text-5xl">The Menu</h2>

						{/* Cards */}
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							{items.map((item) => (
								<article
									key={item.title}
									className="group relative overflow-hidden rounded-sm bg-black/5"
								>
									<div className="relative h-72 w-full md:h-[600px]">
										<Image
											src={item.image}
											alt={item.title}
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-105"
											sizes="(max-width: 768px) 100vw, 33vw"
										/>
										<div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/5 to-transparent" />
										<div className="absolute bottom-6 left-6 right-6 text-white">
											<h3 className="text-2xl font-extrabold md:text-3xl">{item.title}</h3>
											<p className="mt-3 text-sm leading-relaxed md:text-base">
												{item.description}
											</p>
										</div>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default Menu;
