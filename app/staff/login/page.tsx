"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export default function StaffLoginPage() {
	const router = useRouter();
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/staff/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => null);
				setError(data?.error ?? "Invalid password");
				return;
			}
			const data = (await res.json()) as { token: string; role: string };

			// store JWT in localStorage for staff APIs
			localStorage.setItem("staff_jwt", data.token);

			router.replace("/staff");
		} catch (e) {
			console.error("Staff login error", e);
			setError("Server error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm space-y-4 rounded-lg border bg-white p-6"
			>
				<h1 className="text-xl font-semibold">Staff login</h1>
				<p className="text-sm text-gray-600">
					Enter the staff password provided by the manager.
				</p>

				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						autoComplete="off"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				{error && <p className="text-sm text-red-600">{error}</p>}

				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? (
						<span className="flex items-center justify-center gap-2">
							<Spinner className="h-4 w-4" />
							Signing in…
						</span>
					) : (
						"Sign in"
					)}
				</Button>
			</form>
		</div>
	);
}
