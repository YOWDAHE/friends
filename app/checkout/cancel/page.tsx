"use client";

import Link from "next/link";

export default function CheckoutCancelPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-white">
			<div className="max-w-md px-4 text-center space-y-4">
				<h1 className="text-2xl font-bold">Payment canceled</h1>
				<p className="text-sm text-neutral-700">
					Your payment was not completed. You can update your selection and try
					again.
				</p>
				<div className="flex flex-col gap-2">
					<Link href="/reserve" className="text-orange-500 underline text-sm">
						Back to events
					</Link>
				</div>
			</div>
		</div>
	);
}
