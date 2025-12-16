import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
	{
		name: "Atai Price",
		text:
			"The food, hookah and vibes were there. I recommend Friends for happy house for sure. Nice chill spot for you and your girls or boo to go to! Ambiance was nice as well.",
	},
	{
		name: "Bell Morales",
		text:
			"Friends was such a vibeeeee. Went there for a chill night out w/ my girls. Drinks 10/10. Food was amazing. Would recommend.",
	},
	{
		name: "Friends Kitchen Guest",
		text:
			"Friends Kitchen has the best vibe! The food is flavorful and perfectly plated, and the staff are not only welcoming but also super attentive. Definitely worth the visit.",
	},
];

function Testimonials() {
	return (
		<div className="relative min-h-screen md:px-8">
			<div className="absolute inset-0 md:backdrop-blur-[200px] backdrop-blur-[100px] h-[3000px] z-10"></div>
			{/* color balls */}
			<div className="hidden md:block">
				<div className="absolute bg-[#B700FF] size-100 rounded-full top-[50%] right-10"></div>
				<div className="absolute bg-[#FF0000] size-80 rounded-full top-[50%] left-10"></div>
			</div>
			<div className="md:hidden">
				<div className="absolute bg-[#FF6200]/70 size-70 rounded-full bottom-0 left-0"></div>
				<div className="absolute bg-[#B700FF]/70 size-50 rounded-full top-100 right-0"></div>
			</div>
			<div className="z-20 relative mt-20">
				<section className="relative z-10 md:py-14 py-4">
					<div className="mx-auto flex w-full flex-col gap-10 px-4 md:px-8">
						{/* Heading + rating */}
						<div className="flex flex-col gap-4 md:max-w-4xl">
							<div
								className={`font-rage text-5xl md:text-7xl leading-[40px] md:leading-[60px]`}
							>
								Bold &amp;
								<br />
								Confident
							</div>

							<p
								className="
  text-2xl md:text-6xl font-semibold
  bg-linear-to-r from-[#DD00FF] to-[#00BBFF]
  bg-clip-text text-transparent
"
							>
								4.8★ on Google — Loved by Our Guests
							</p>

							<p className="text-base leading-relaxed md:text-lg">
								Our establishment is trusted for its flavors, atmosphere, and service.
								Each review is a reflection of the experience we strive to deliver.
								Discover what our guests are saying.
							</p>
						</div>

						{/* Testimonials row */}
						<div className="flex flex-col gap-6">
							<div className="flex flex-wrap w-full gap-4 md:gap-4 overflow-scroll no-scrollbar">
								{testimonials.map((t) => (
									<article
										key={t.name}
										className="flex max-w-lg flex-col rounded-3xl bg-linear-to-br from-[#A533FF] to-[#4B6BFF] px-6 py-8 text-white shadow-lg"
									>
										<Quote className="mb-4 h-6 w-6 opacity-70" />
										<h3 className="text-sm font-semibold tracking-wide uppercase">
											{t.name}
										</h3>
										<p className="mt-4 text-sm leading-relaxed md:text-base">{t.text}</p>
									</article>
								))}
							</div>

							{/* Arrows */}
							{/* <div className="flex items-center justify-start gap-3">
								<Button
									size="icon"
									className="h-9 w-9 rounded-full bg-[#A533FF] text-white hover:bg-[#8c27d6]"
									variant="default"
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button
									size="icon"
									className="h-9 w-9 rounded-full bg-[#A533FF] text-white hover:bg-[#8c27d6]"
									variant="default"
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div> */}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default Testimonials;
