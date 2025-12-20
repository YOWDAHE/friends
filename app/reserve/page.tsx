import React from "react";
import { Header } from "../components/Header";
import Upcoming from "../components/Upcoming";
import Footer from "../components/Footer";

function page() {
	return (
		<div className="relative min-h-screen flex flex-col justify-center w-full">
			<Header />
			<div className="absolute inset-0 md:backdrop-blur-[200px] backdrop-blur-[100px] h-full z-10"></div>
			{/* color balls */}
			<div className="hidden md:block">
				<div className="absolute bg-[#B700FF] size-100 rounded-full top-[50%] right-10"></div>
				<div className="absolute bg-[#FF0000] size-80 rounded-full top-[50%] left-10"></div>
			</div>
			<div className="md:hidden">
				<div className="absolute bg-[#FF6200]/70 size-70 rounded-full bottom-0 left-0"></div>
				<div className="absolute bg-[#B700FF]/70 size-50 rounded-full top-100 right-0"></div>
			</div>
			<div className="z-20 relative mt-20 md:mt-60 max-w-[1400px] w-full md:px-8">
				<h1 className="text-5xl md:text-7xl font-black tracking-tight text-center">
					Reservations
				</h1>
				<Upcoming />
			</div>
			<Footer />
		</div>
	);
}

export default page;
