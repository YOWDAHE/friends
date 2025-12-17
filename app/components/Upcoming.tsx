import Image from "next/image";
import Link from "next/link";

const events = [
	{
		id: 1,
		title: "The Mat Gala: Nightmare Before Christmas",
		subtitle: "Annual Birthday Celebration for Michelle Turner & Khayla Floyd",
		image: "/images/upcoming/dec19.png",
		href: "/events/mat-gala-nightmare-before-christmas",
	},
	{
		id: 2,
		title: "MANIFEST & MIMOSAS",
		subtitle: "Holiday magic meets big goals.",
		image: "/images/upcoming/dec28.png",
		href: "/events/manifest-and-mimosas",
	},
];

function Upcoming() {
	return (
		<div className="relative overflow-y-hidden min-h-screen md:px-8 pb-10 flex justify-center w-full">
			{/* color balls */}
			{/* <div className="hidden md:block">
				<div className="absolute bg-[#B700FF] size-100 rounded-full bottom-100 right-10"></div>
				<div className="absolute bg-[#FF0000] size-80 rounded-full top-[50%] right-100"></div>
			</div>
			<div className="md:hidden">
				<div className="absolute bg-[#B700FF]/70 size-70 rounded-full bottom-20 left-0"></div>
				<div className="absolute bg-[#FF6200]/70 size-50 rounded-full top-100 right-0"></div>
			</div> */}
			<div className="z-20 relative mt-20 max-w-[1400px] w-full">
				<section className="relative z-10 md:py-24 py-16">
					<div className="mx-auto flex w-full flex-col gap-10 px-4 md:px-8">
						{/* Heading */}
						<div className="flex flex-col gap-2">
							<h2 className="font-rage text-5xl md:text-6xl leading-[40px] md:leading-[56px]">
								Upcoming
								<br />
								Events
							</h2>
						</div>

						{/* Events list */}
						<div className="flex flex-wrap gap-12 md:gap-8">
							{events.map((event) => (
								<article
									key={event.id}
									className="flex flex-col gap-4 max-w-lg min-w-sm md:min-w-lg bg-white/80 p-4 rounded-sm"
								>
									{/* Poster */}
									<div className="relative h-64 w-full overflow-hidden rounded-sm md:h-[360px]">
										<Image
											src={event.image}
											alt={event.title}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, 50vw"
										/>
									</div>

									{/* Text */}
									<div className="flex flex-col gap-2">
										<h3 className="text-xl font-extrabold md:text-2xl">{event.title}</h3>
										<p className="text-base text-neutral-800 md:text-lg">
											{event.subtitle}
										</p>
										<Link
											href={event.href}
											className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-orange-500 md:text-base"
										>
											View Detail
											<span aria-hidden>↗</span>
										</Link>
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

export default Upcoming;
