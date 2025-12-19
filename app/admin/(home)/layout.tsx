"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Menu,
	LayoutDashboard,
	Calendar,
	UtensilsCrossed,
	ClipboardList,
	Settings,
	LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { signOut } from "next-auth/react";

const navItems = [
	{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/events", label: "Events", icon: Calendar },
	{ href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
	{ href: "/admin/reservations", label: "Reservations", icon: ClipboardList },
	{ href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const NavLinks = () => (
		<>
			{navItems.map((item) => {
				const Icon = item.icon;
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.href}
						href={item.href}
						onClick={() => setMobileMenuOpen(false)}
						className={cn(
							"flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
							isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
						)}
					>
						<Icon className="h-5 w-5" />
						{item.label}
					</Link>
				);
			})}
		</>
	);

	return (
		<div className="min-h-screen bg-linear-to-br from-purple-100 via-blue-50 to-pink-100">
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
			<div className="z-20 relative w-full h-screen overflow-scroll no-scrollbar">
				{/* Top Header */}
				<header className="sticky top-0 z-50 border-b border-white/20 backdrop-blur-md py-2">
					<div className="flex h-16 items-center justify-between px-4 lg:px-10">
						{/* Logo */}
						<div className="flex items-center gap-4">
							<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" className="lg:hidden">
										<Menu className="h-6 w-6" />
									</Button>
								</SheetTrigger>
								<SheetContent side="left" className="w-64 p-0">
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
								</SheetContent>
							</Sheet>

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
						</div>

						{/* User Section */}
						<div className="flex items-center gap-3">
							<Avatar className="h-9 w-9">
								<AvatarFallback className="bg-black text-xs text-white">
									AD
								</AvatarFallback>
							</Avatar>
							<div className="hidden md:block">
								<p className="text-sm font-semibold">Admin</p>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="hidden gap-2 md:flex"
								onClick={() =>
									signOut({
										redirect: true,
										callbackUrl: "/admin/login"
									})
								}
							>
								<LogOut className="h-4 w-4" />
								Sign out
							</Button>
						</div>
					</div>
				</header>

				<div className="flex">
					{/* Desktop Sidebar */}
					<aside className="hidden w-64 lg:block">
						<nav className="sticky top-16 flex flex-col gap-1 p-6 md:mt-10">
							<NavLinks />
						</nav>
					</aside>

					{/* Main Content */}
					<main className="flex-1 p-4 lg:p-8 max-w-[1400px]">
						<div className="mx-auto max-w-6xl h-[calc(100vh-150px)] overflow-scroll no-scrollbar rounded-xl bg-white/60 p-6 shadow-lg backdrop-blur-sm lg:p-8">
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
