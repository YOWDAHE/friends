import Image from "next/image";
import { Header } from "../components/Header";
import Hero from "./_components/Hero";

export default function Home() {
	return (
		<div className="relative w-full min-h-screen">
			<Header />
			<Hero />
		</div>
	);
}
