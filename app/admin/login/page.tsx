"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSubmitting(true);

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
			callbackUrl,
		});

		setSubmitting(false);

		if (!result) {
			setError("Unknown error");
			return;
		}

		if (result.error) {
			setError("Invalid email or password");
			return;
		}

		if (result) {
			console.log("results: ", await getSession())
		}

		// Successful login – go to callbackUrl (should be /admin or a specific admin page)
		router.push(result.url ?? "/admin");
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-700 via-pink-500 to-orange-400 px-4">
			<div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur">
				<div className="mb-6 text-center">
					<p className="text-xs uppercase tracking-[0.3em] text-gray-500">
						Friends Kitchen &amp; Cocktails
					</p>
					<h1 className="mt-2 text-3xl font-black tracking-tight">Admin Login</h1>
					<p className="mt-2 text-sm text-gray-600">
						Sign in with your admin credentials to manage events, menu, and
						reservations.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							autoComplete="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="bg-white/80"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="bg-white/80"
						/>
					</div>

					{error && (
						<div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
							<AlertCircle className="h-4 w-4" />
							<span>{error}</span>
						</div>
					)}

					<Button
						type="submit"
						className="mt-2 w-full rounded-sm bg-black text-white hover:bg-black/80"
						disabled={submitting}
					>
						{submitting ? (
							<span className="flex items-center justify-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Signing in...
							</span>
						) : (
							"Sign in"
						)}
					</Button>
				</form>

				<p className="mt-4 text-center text-xs text-gray-500">
					Admin access only. If you need access, contact the site owner.
				</p>
			</div>
		</div>
	);
}
