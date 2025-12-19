import React, { Suspense } from "react";
import AdminLoginPage from "./_components/AdminLoginPage";

function page() {
	return (
		<Suspense fallback={<div></div>}>
			<AdminLoginPage />
		</Suspense>
	);
}

export default page;
