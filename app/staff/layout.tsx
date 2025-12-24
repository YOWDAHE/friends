import { ReactNode } from "react";
import { isStaffEnabled } from "@/lib/staff-settings";
import Link from "next/link";

export const metadata = {
	title: "Staff portal",
};

export default async function StaffLayout({
	children,
}: {
	children: ReactNode;
}) {
	const enabled = await isStaffEnabled();

	if (!enabled) {
		return (
			<div className="flex min-h-screen items-center justify-center px-4">
				<div className="max-w-md rounded-lg border bg-white p-6 text-center">
					<p className="mt-2 text-sm text-gray-600 mb-4">
						Page is not available
                    </p>
                    <Link href="/" className="underline">Go back home</Link>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
