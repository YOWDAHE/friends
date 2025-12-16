import Image from "next/image";
import { Header } from "../components/Header";
import Hero from "./_components/Hero";
import Menu from "./_components/Menu";
import GalleryPreview from "./_components/GalleryPreview";

export default function Home() {
	return (
		<div className="relative w-full min-h-screen">
			<Header />
      <Hero />
      <Menu />
      <GalleryPreview />
		</div>
	);
}
