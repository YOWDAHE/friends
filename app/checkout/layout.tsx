import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";

function layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<Suspense fallback={<Spinner />}>{children}</Suspense>
		</div>
	);
}

export default layout;
