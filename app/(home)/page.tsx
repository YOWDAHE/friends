import Image from "next/image";
import { Header } from "../components/Header";
import Hero from "./_components/Hero";
import Menu from "./_components/Menu";
import GalleryPreview from "./_components/GalleryPreview";
import Testimonials from "./_components/Testimonials";
import Upcoming from "../components/Upcoming";
import Location from "./_components/Location";
import ReserveSection from "./_components/ReserveSection";
import ChefSpotlight from "./_components/ChefSpotlight";
import Footer from "../components/Footer";

export default function Home() {
	return (
		<div className="relative w-full min-h-screen">
			<Header />
      <Hero />
      <Menu />
      <GalleryPreview />
      <Testimonials />
      <Upcoming />
      <Location />
      <ReserveSection />
      <ChefSpotlight />
      <Footer />
		</div>
	);
}
