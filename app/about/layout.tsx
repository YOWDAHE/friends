import React from "react";
import Footer from "../components/Footer";

function layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			{children}
			<Footer />
		</div>
	);
}

export default layout;
