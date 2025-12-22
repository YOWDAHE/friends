"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";

type AdminAccount = {
	id: number;
	email: string;
	name: string | null;
};

type StaffSettingsSummary = {
	exists: boolean;
	isEnabled: boolean;
	updatedAt?: string;
};

export default function AdminSettingsPage() {
	const [account, setAccount] = useState<AdminAccount | null>(null);
	const [accountLoading, setAccountLoading] = useState(true);

	const [email, setEmail] = useState("");
	const [emailSaving, setEmailSaving] = useState(false);
	const [emailMessage, setEmailMessage] = useState<string | null>(null);

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [passwordSaving, setPasswordSaving] = useState(false);
	const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

	const [staffSettings, setStaffSettings] =
		useState<StaffSettingsSummary | null>(null);
	const [staffPassword, setStaffPassword] = useState("");
	const [staffEnabled, setStaffEnabled] = useState(true);
	const [staffSaving, setStaffSaving] = useState(false);
	const [staffMessage, setStaffMessage] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				const [accountRes, staffRes] = await Promise.all([
					fetch("/api/admin/account"),
					fetch("/api/admin/staff-settings"),
				]);

				if (accountRes.ok) {
					const acc = (await accountRes.json()) as AdminAccount;
					setAccount(acc);
					setEmail(acc.email);
				}

				if (staffRes.ok) {
					const data = (await staffRes.json()) as StaffSettingsSummary;
					setStaffSettings(data);
					setStaffEnabled(data.isEnabled);
				}
			} catch (e) {
				console.error("Error loading settings", e);
			} finally {
				setAccountLoading(false);
			}
		};

		load();
	}, []);

	const handleEmailSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setEmailSaving(true);
		setEmailMessage(null);
		try {
			const res = await fetch("/api/admin/account", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => null);
				setEmailMessage(data?.error ?? "Failed to update email");
				return;
			}
			const data = (await res.json()) as { account: AdminAccount };
			setAccount(data.account);
			setEmail(data.account.email);
			setEmailMessage("Email updated successfully.");
		} catch (e) {
			console.error("Email update error", e);
			setEmailMessage("Server error.");
		} finally {
			setEmailSaving(false);
		}
	};

	const handlePasswordSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordSaving(true);
		setPasswordMessage(null);
		try {
			const res = await fetch("/api/admin/account", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword,
					newPassword,
				}),
			});
			const data = await res.json().catch(() => null);
			if (!res.ok) {
				setPasswordMessage(data?.error ?? "Failed to update password");
				return;
			}
			setCurrentPassword("");
			setNewPassword("");
			setPasswordMessage("Password updated successfully.");
		} catch (e) {
			console.error("Password update error", e);
			setPasswordMessage("Server error.");
		} finally {
			setPasswordSaving(false);
		}
	};

	const handleStaffSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setStaffSaving(true);
		setStaffMessage(null);
		try {
			const res = await fetch("/api/admin/staff-settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					password: staffPassword,
					isEnabled: staffEnabled,
				}),
			});
			const data = await res.json().catch(() => null);
			if (!res.ok) {
				setStaffMessage(data?.error ?? "Failed to update staff settings");
				return;
			}
			setStaffPassword("");
			setStaffMessage("Staff password updated successfully.");
		} catch (e) {
			console.error("Staff settings update error", e);
			setStaffMessage("Server error.");
		} finally {
			setStaffSaving(false);
		}
	};

	if (accountLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center p-8">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="font-rage text-4xl md:text-5xl">Settings</h1>
				<p className="mt-2 text-gray-600">
					Manage your admin account and staff access.
				</p>
			</div>

			{/* Admin email */}
			<section className="space-y-4 rounded-lg border bg-white p-4 md:p-6">
				<h2 className="text-lg font-semibold">Admin account</h2>
				<form onSubmit={handleEmailSave} className="space-y-3 max-w-md">
					<div className="space-y-1">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					{emailMessage && <p className="text-sm text-gray-600">{emailMessage}</p>}

					<Button type="submit" disabled={emailSaving}>
						{emailSaving ? "Saving…" : "Save email"}
					</Button>
				</form>
			</section>

			{/* Admin password */}
			<section className="space-y-4 rounded-lg border bg-white p-4 md:p-6">
				<h2 className="text-lg font-semibold">Change admin password</h2>
				<form onSubmit={handlePasswordSave} className="space-y-3 max-w-md">
					<div className="space-y-1">
						<Label htmlFor="currentPassword">Current password</Label>
						<Input
							id="currentPassword"
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-1">
						<Label htmlFor="newPassword">New password</Label>
						<Input
							id="newPassword"
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
						/>
					</div>

					{passwordMessage && (
						<p className="text-sm text-gray-600">{passwordMessage}</p>
					)}

					<Button type="submit" disabled={passwordSaving}>
						{passwordSaving ? "Saving…" : "Save password"}
					</Button>
				</form>
			</section>

			{/* Staff password */}
			<section className="space-y-4 rounded-lg border bg-white p-4 md:p-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold">Staff portal</h2>
						<p className="text-sm text-gray-600">
							Set the shared password used on the /staff login page.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Label htmlFor="staffEnabled" className="text-sm">
							Enabled
						</Label>
						<Switch
							id="staffEnabled"
							checked={staffEnabled}
							onCheckedChange={setStaffEnabled}
						/>
					</div>
				</div>

				<form onSubmit={handleStaffSave} className="space-y-3 max-w-md">
					<div className="space-y-1">
						<Label htmlFor="staffPassword">New staff password</Label>
						<Input
							id="staffPassword"
							type="password"
							value={staffPassword}
							onChange={(e) => setStaffPassword(e.target.value)}
							placeholder="Enter a new password"
							required
						/>
					</div>

					{staffSettings?.updatedAt && (
						<p className="text-xs text-gray-500">
							Last updated: {new Date(staffSettings.updatedAt).toLocaleString()}
						</p>
					)}

					{staffMessage && <p className="text-sm text-gray-600">{staffMessage}</p>}

					<Button type="submit" disabled={staffSaving}>
						{staffSaving ? "Saving…" : "Save staff settings"}
					</Button>
				</form>
			</section>
		</div>
	);
}
