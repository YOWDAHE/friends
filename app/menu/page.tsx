"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Header } from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import menuData from "@/data/menu.json";

function formatPrice(price: number): string {
	return `$${price.toFixed(2)}`;
}

function MenuPage() {
	const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const navRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (navRef.current) {
				const navTop = navRef.current.getBoundingClientRect().top;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToCategory = (categoryId: string) => {
		const element = categoryRefs.current[categoryId];
		if (element) {
			const headerOffset = 120; // Account for header height
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="min-h-screen bg-white">
			<Header />
			<main className="pt-24 md:pt-32 pb-20">
				<div className="container mx-auto px-4 md:px-8 max-w-7xl">
					{/* Main Title */}
					<h1 className="text-5xl md:text-7xl font-bold text-black mb-8 md:mb-12 text-center">
						Menu
					</h1>

					{/* Category Navigation */}
					<div
						ref={navRef}
						className={` mb-8 md:mb-16 sticky top-0 md:top-24 z-20  py-4 md:-mx-8 md:px-8 flex w-full items-center justify-center`}
					>
						<div className={`flex flex-wrap gap-1 md:gap-4 justify-center items-center overflow-x-auto p-4 md:rounded-full no-scrollbar md:w-[90%] w-full md:bg-white/70 bg-white/90 shadow-sm backdrop-blur-sm`}>
							{menuData.categories.map((category) => (
								<button
									key={category.id}
									onClick={() => scrollToCategory(category.id)}
									className="px-4 py-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap text-gray-600 hover:text-black"
								>
									{category.name}
								</button>
							))}
						</div>
					</div>

					{/* All Categories Content */}
					<div className="space-y-16 md:space-y-24">
						{menuData.categories.map((category) => (
							<div
								key={category.id}
								ref={(el) => {
									categoryRefs.current[category.id] = el;
								}}
								className="scroll-mt-24 md:scroll-mt-32"
							>
								{/* Category Title and Tagline */}
								<div className="text-center md:text-left mb-12 md:mb-16 md:pt-20">
									<h2 className="font-rage text-4xl md:text-6xl text-black mb-4 text-center">
										{category.name}
									</h2>
									{category.tagline && (
										<p className="text-sm md:text-base text-gray-600 mt-2 text-center">
											{category.tagline}
										</p>
									)}
								</div>

								{/* Sections */}
								{category.sections.map((section, index) => {
									const items = section.items || [];
									const splitIndex = items.length > 6 ? 4 : items.length;
									const sideItems = items.slice(0, splitIndex);
									const bottomItems = items.slice(splitIndex);

									return (
										<div
											key={section.id}
											className="flex flex-col gap-8 md:gap-12 mt-20 md:mt-0"
										>
											{/* First row: image + a column of items */}
											<div
												className={`flex flex-col ${
													section.imagePosition === "right"
														? "md:flex-row-reverse"
														: "md:flex-row"
												} gap-8 md:gap-12 items-center md:mt-20`}
											>
												{/* Image */}
												<div
													className={`w-full flex justify-center ${
														index % 2 == 0 ? "md:justify-start" : "md:justify-end"
													}`}
												>
													<div className="relative h-64 w-64 md:h-120 md:w-120 rounded-lg overflow-hidden ">
														<Image
															src={section.image}
															alt={section.title}
															fill
															className="object-contain"
															sizes="(max-width: 768px) 100vw, 50vw"
														/>
													</div>
												</div>

												{/* Menu Items beside the image */}
												<div className="flex justify-center w-full ">
													<div className="w-full space-y-4 md:space-y-6">
														{/* Section Title */}
														<h3 className="font-rage text-3xl md:text-4xl text-black/50 text-center md:mb-16">
															{section.title}
														</h3>
														{sideItems.map((item, itemIndex) => (
															<div
																key={itemIndex}
																className="flex flex-row md:items-start md:justify-between gap-2 md:pb-4 pb-8 border-b border-gray-100 last:border-0"
															>
																<div className="flex-1">
																	<div className="flex items-start gap-2">
																		<h4 className="text-base md:text-lg font-semibold text-black">
																			{item.name}
																		</h4>
																	</div>
																	{"description" in item && item.description && (
																		<p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
																			{item.description}
																		</p>
																	)}
																</div>
																<div className="shrink-0">
																	<span className="text-base md:text-lg font-semibold text-black">
																		{formatPrice(item.price)}
																	</span>
																</div>
															</div>
														))}
													</div>
												</div>
											</div>

											{/* Second row: remaining items in a two-column grid on desktop */}
											{bottomItems.length > 0 && (
												<div className="-mt-6 md:mt-0 grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-12">
													{bottomItems.map((item, itemIndex) => (
														<div
															key={itemIndex}
															className="flex flex-row md:items-start md:justify-between gap-2 pb-4 border-b border-gray-100 last:border-0"
														>
															<div className="flex-1">
																<div className="flex items-start gap-2">
																	<h4 className="text-base md:text-lg font-semibold text-black">
																		{item.name}
																	</h4>
																</div>
																{"description" in item && item.description && (
																	<p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
																		{item.description}
																	</p>
																)}
															</div>
															<div className="shrink-0">
																<span className="text-base md:text-lg font-semibold text-black">
																	{formatPrice(item.price)}
																</span>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default MenuPage;
