"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

export default function ContactPage() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSuccess(null);
		setError(null);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			if (!res.ok) {
				throw new Error("Failed to send message");
			}
			setSuccess("Thank you, your message has been sent.");
			setForm({ name: "", email: "", phone: "", subject: "", message: "" });
		} catch (err) {
			console.error(err);
			setError("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="relative overflow-x-clip flex flex-col justify-center w-full">
			<Header />
			<div className="absolute inset-0 md:backdrop-blur-[200px] backdrop-blur-[100px] h-full z-10"></div>

			{/* color balls */}
			<div className="hidden md:block">
				<div className="absolute bg-[#0065ea] size-180 rounded-full -top-[100px] -left-40 "></div>
				<div className="absolute bg-[#00E5FF] size-100 rounded-full top-[10px] right-100"></div>
				<div className="absolute bg-[#FF6200] size-100 rounded-full top-[40%] left-10"></div>
				<div className="absolute bg-[#FF00C8] size-80 rounded-full top-[50%] right-10"></div>
			</div>
			<div className="md:hidden">
				<div className="absolute bg-[#0065ea] size-50 rounded-full top-[100px] -left-10 "></div>
				<div className="absolute bg-[#00E5FF] size-50 rounded-full top-[60px] left-30"></div>
				<div className="absolute bg-[#FF6200] size-70 rounded-full top-[450px] left-0"></div>
				<div className="absolute bg-[#FF6200] size-70 rounded-full bottom-[450px] left-0"></div>
				<div className="absolute bg-[#FF00C8] size-50 rounded-full top-[400px] right-0"></div>
			</div>

			<div className="flex flex-col md:flex-row min-h-screen md:pt-32 pt-40 pb-20 relative z-20 max-w-[1400px] w-full">
				<div className="mx-auto flex max-w-3xl w-full flex-col gap-8 px-4 py-10 md:py-16">
					<div>
						<h1 className="text-3xl md:text-7xl font-rage">Contact us</h1>
						<p className="mt-2 text-black">
							Have a question or want to book a private event? Send us a message.
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className="space-y-4 rounded-lg border bg-white/50 p-6"
					>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-1">
								<Label htmlFor="name">Name</Label>
								<Input
									className="bg-white"
									id="name"
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									required
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="email">Email</Label>
								<Input
									className="bg-white"
									id="email"
									type="email"
									value={form.email}
									onChange={(e) => setForm({ ...form, email: e.target.value })}
									required
								/>
							</div>
						</div>

						<div className="space-y-1">
							<Label htmlFor="phone">Phone (optional)</Label>
							<Input
								className="bg-white"
								id="phone"
								value={form.phone}
								onChange={(e) => setForm({ ...form, phone: e.target.value })}
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="subject">Subject (optional)</Label>
							<Input
								className="bg-white"
								id="subject"
								value={form.subject}
								onChange={(e) => setForm({ ...form, subject: e.target.value })}
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="message">Message</Label>
							<Textarea
								className="bg-white"
								id="message"
								rows={6}
								value={form.message}
								onChange={(e) => setForm({ ...form, message: e.target.value })}
								required
							/>
						</div>

						{success && <p className="text-sm text-emerald-600">{success}</p>}
						{error && <p className="text-sm text-red-600">{error}</p>}

						<Button type="submit" disabled={submitting}>
							{submitting ? (
								<span className="flex items-center gap-2">
									<Spinner className="h-4 w-4" /> Sending...
								</span>
							) : (
								"Send message"
							)}
						</Button>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	);
}
