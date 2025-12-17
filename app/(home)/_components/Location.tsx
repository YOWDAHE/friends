import React from "react";

function Location() {
	return (
		<div className="relative min-h-screen md:px-8 flex items-center justify-center w-full">
			<div className="absolute inset-0 md:backdrop-blur-[200px] backdrop-blur-[100px] h-[3200px] z-10"></div>
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
				<section className="relative z-10 md:py-24 py-16">
					<div className="mx-auto flex w-full flex-col gap-10 px-4 md:flex-row md:px-8 md:items-start">
						{/* Left: heading + address + hours */}
						<div className="flex-1 flex flex-col gap-6 md:max-w-xl">
							<h2 className="font-rage text-5xl md:text-6xl leading-[40px] md:leading-[56px]">
								Location &
								<br />
								Hours
							</h2>

							<p className="text-base md:text-lg leading-relaxed">
								3815 S George Mason Dr Unit A &amp; F, Falls Church, VA 22041, United
								States. Located in Build America Plaza
							</p>

							<div className="mt-2 grid grid-cols-[auto,1fr] gap-y-3 gap-x-6 text-sm md:text-base font-semibold">
								<div className="flex justify-between">
									<span>Sunday</span>
									<span className="font-bold">4:00 pm – 1:00 am</span>
								</div>

								<div className="flex justify-between">
									<span>Mon–Fri</span>
									<span className="font-bold">10:00 am – 2:00 am</span>
								</div>

								<div className="flex justify-between">
									<span>Saturday</span>
									<span className="font-bold">4:00 pm – 2:00 am</span>
								</div>
							</div>
						</div>

						{/* Right: map */}
						<div className="flex-1 w-full">
							<div className="relative h-64 w-full overflow-hidden rounded-md bg-white/50 shadow md:h-80">
								<iframe
									title="Friends Location Map"
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.573168032339!2d-77.129!3d38.845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0000000000000000%3AFriends!2s3815%20S%20George%20Mason%20Dr%2C%20Falls%20Church%2C%20VA%2022041!5e0!3m2!1sen!2sus!4v0000000000000"
									className="h-full w-full border-0"
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default Location;
