"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/menu", label: "Menu" },
	{ href: "/gallery", label: "Gallery" },
];

export function Header() {
	const pathname = usePathname();
	const [showHeader, setShowHeader] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [scrolledPastTop, setScrolledPastTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const current = window.scrollY;

			if (current < 0) return;

			// show/hide based on direction
			if (current < 100) {
				setShowHeader(true);
			} else if (current > lastScrollY) {
				setShowHeader(false);
			} else if (current < lastScrollY) {
				setShowHeader(true);
			}

			// header is considered "past the top" once the page has moved
			setScrolledPastTop(current > 100);

			setLastScrollY(current);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	return (
		<div className="absolute h-16">
			<header
				className={`fixed left-0 top-0 z-30 w-full transform transition-transform duration-300 ease-out ${
					showHeader ? "translate-y-0" : "-translate-y-full"
				}`}
			>
				{/* Blur / background layer – only when scrolled */}
				{scrolledPastTop && (
					<div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-[20px]" />
				)}

				<div className="relative z-20 mx-auto flex h-16 items-center justify-between px-4 md:h-24 md:px-15">
					{/* Logo */}
					<Link
						href="/"
						className="relative flex h-20 w-20 flex-col leading-tight md:h-24 md:w-24"
					>
						<Image
							fill
							src="/images/FriendsLogoDark.svg"
							alt="logo"
							className="text-black"
						/>
					</Link>

					{/* Desktop navigation */}
					<nav className="hidden items-center gap-10 font-medium text-black md:flex">
						{navItems.map((item) => {
							const active = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className="relative flex flex-col items-center"
								>
									<span>{item.label}</span>
									{active && <span className="mt-1 h-[2px] w-8 rounded-full bg-black" />}
								</Link>
							);
						})}
						<div className="hidden md:block">
							<Link href="/reserve" className="rounded-xs bg-black px-6 py-2 font-medium text-white hover:bg-black/80">
								Reserve
							</Link>
						</div>
					</nav>

					{/* Mobile drawer */}
					<div className="flex items-center gap-2 md:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<button aria-label="Open menu" className="p-1 text-black">
									<Menu size={24} />
								</button>
							</SheetTrigger>
							<SheetContent
								side="right"
                                className="flex flex-col bg-white/70 backdrop-blur-lg border-0"
							>
								<SheetHeader className="mb-6 border-b bg-white/20 pb-4 border-0">
									<SheetTitle className="relative h-20 w-20 text-left text-sm font-semibold tracking-[0.25em]">
										<Image
											fill
											src="/images/FriendsLogoDark.svg"
											alt="logo"
											className="text-black"
										/>
									</SheetTitle>
								</SheetHeader>

								<nav className="flex flex-1 flex-col gap-4 px-8 text-base font-medium">
									{navItems.map((item) => {
										const active = pathname === item.href;
										return (
											<Link
												key={item.href}
												href={item.href}
												className={`flex items-center justify-between py-1 ${
													active ? "text-black" : "text-gray-700"
												}`}
											>
												<span>{item.label}</span>
											</Link>
										);
									})}
									<Link
										href="/reserve"
										className="flex items-center justify-between py-1 text-gray-700"
									>
										<span>Reserve</span>
									</Link>
								</nav>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>
		</div>
	);
}
