import { Spinner } from "@/components/ui/spinner";
import React from "react";

function loading() {
	return (
		<div className="bg-transparent flex items-center justify-center w-full h-full">
			<Spinner />
		</div>
	);
}

export default loading;
