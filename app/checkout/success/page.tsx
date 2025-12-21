"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");

	return (
		<div className="min-h-screen flex items-center justify-center bg-white">
			<div className="max-w-md px-4 text-center space-y-4">
				<h1 className="text-2xl font-bold">Thank you for your purchase!</h1>
				<p className="text-sm text-neutral-700">
					Your reservation has been received. A confirmation email will be sent to
					you shortly.
				</p>
				{sessionId && (
					<p className="text-xs text-neutral-500">
						Reference: <span className="font-mono">{sessionId}</span>
					</p>
				)}
				<Link href="/" className="text-orange-500 underline text-sm">
					Back to Friends
				</Link>
			</div>
		</div>
	);
}
