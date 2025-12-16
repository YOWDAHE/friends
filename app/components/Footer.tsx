import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";

const navLinks = [
	{ href: "/about", label: "ABOUT US" },
	{ href: "/menu", label: "MENU" },
	{ href: "/gallery", label: "GALLERY" },
	{ href: "/reserve", label: "RESERVATION" },
];

function Footer() {
	return (
		<footer className="relative z-10 pt-10 pb-8 text-white bg-black">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 md:px-8">
				{/* Top divider */}
				<div className="h-px w-full bg-white/40" />

				{/* Logo + contact + socials */}
				<div className="flex flex-col items-center gap-6 py-6 text-center md:flex-row md:items-start md:justify-between md:text-left">
					{/* Logo */}
					<Link
						href="/"
						className="relative flex h-20 w-20 flex-col leading-tight md:h-40 md:w-40"
					>
						<Image
							fill
							src="/images/FriendsLogo.svg"
							alt="logo"
							className="text-black"
						/>
					</Link>

					{/* Address + phone + socials */}
					<div className="flex flex-col items-center gap-4 md:items-start">
						<div className="flex flex-col gap-4 text-sm md:text-base">
							<div className="flex items-start gap-2">
								<MapPin className="mt-0.5 h-4 w-4" />
								<p>
									3815 S George Mason Dr Unit A &amp; F, Falls Church, VA 22041, United
									States
								</p>
							</div>
							<div className="flex items-center justify-center md:justify-start gap-2">
								<Phone className="h-4 w-4" />
								<p>(123) 456-7890</p>
							</div>
						</div>

						<div className="flex flex-col items-center gap-2 md:items-start">
							<span className="text-xs uppercase tracking-[0.2em]">Social Media</span>
							<div className="flex items-center gap-4">
								<Link href="#" aria-label="Facebook">
									<Facebook className="h-5 w-5" />
								</Link>
								<Link href="#" aria-label="Twitter">
									<Twitter className="h-5 w-5" />
								</Link>
								<Link href="#" aria-label="LinkedIn">
									<Linkedin className="h-5 w-5" />
								</Link>
								<Link href="#" aria-label="YouTube">
									<Youtube className="h-5 w-5" />
								</Link>
								<Link href="#" aria-label="Instagram">
									<Instagram className="h-5 w-5" />
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom divider */}
				<div className="h-px w-full bg-white/40" />

				{/* Bottom nav + copyright */}
				<div className="flex flex-col items-center justify-between gap-4 pt-4 text-xs md:flex-row md:text-sm">
					<nav className="flex flex-wrap items-center justify-center gap-6">
						{navLinks.map((link) => (
							<Link key={link.href} href={link.href} className="tracking-wide">
								{link.label}
							</Link>
						))}
					</nav>

					<p className="text-center">
						Copyright © {new Date().getFullYear()} • Friends Kitchen &amp; Cocktails
					</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
