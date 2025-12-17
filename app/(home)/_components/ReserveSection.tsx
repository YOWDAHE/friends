import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function ReserveSection() {
	return (
		<div className="relative min-h-screen md:px-8 overflow-x-clip flex justify-center w-full">
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
				<section className="relative z-10 md:py-20 py-12">
					<div className="mx-auto flex w-full flex-col gap-10 px-4 md:px-8">
						{/* Heading + description */}
						<div className="flex flex-col gap-4">
							<h2 className="font-rage text-5xl md:text-6xl leading-[40px] md:leading-[56px]">
								Reserve Your
								<br />
								Table
							</h2>

							<p className="text-base md:text-lg leading-relaxed max-w-2xl">
								The best nights start with a seat at the table. Whether you&apos;re
								joining us for an intimate dinner, after‑work cocktails, or a
								celebration with friends, we&apos;re ready when you are.
							</p>

							<p className="mt-2 text-sm font-semibold md:text-base">
								What to expect:
							</p>

							{/* Expectation strip */}
							<div className="mt-2 flex flex-col md:items-center items-start gap-10 rounded-sm bg-white/60 px-4 py-4 text-sm md:flex-row md:gap-8  md:py-5 md:text-base w-full md:w-screen md:-mx-16 md:px-16">
								<div className="flex-1 text-2xl">
									<div className=" flex items-center gap-4 ">
										<p className="">Handcrafted</p>
										<p className="font-rage text-5xl leading-tight">cocktails</p>
									</div>
									<p className="-mt-4">made to order.</p>
								</div>

								<div className="flex-1 text-2xl">
									<p className="-mb-4">Fresh, thoughtfully</p>
									<p className="font-rage text-5xl leading-tight">prepared dishes</p>
								</div>

								<div className="flex-1 text-2xl">
									<p className="">
										An <span className="font-rage text-5xl align-middle">atmosphere</span>
									</p>
									<p className="-mt-4">designed for memorable </p>
									<p className="font-rage text-5xl align-middle -mt-4">moments</p>
								</div>
							</div>
						</div>

						{/* Call to action */}
						<div>
							<Link href="/reserve">
								<Button className="rounded-sm bg-black px-8 py-2 text-sm font-medium text-white hover:bg-black/80 md:text-base">
									Book Now
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default ReserveSection;
