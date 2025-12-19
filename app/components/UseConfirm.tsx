"use client";

import { useState, useCallback } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function useConfirm() {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
		null
	);

	const confirm = useCallback((opts: { title: string; message: string }) => {
		setTitle(opts.title);
		setMessage(opts.message);
		setOpen(true);
		return new Promise<boolean>((resolve) => {
			setResolver(() => resolve);
		});
	}, []);

	const handleClose = (value: boolean) => {
		setOpen(false);
		if (resolver) resolver(value);
	};

	const ConfirmDialog = (
		<AlertDialog open={open} onOpenChange={(o) => !o && handleClose(false)}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{message}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => handleClose(false)}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction onClick={() => handleClose(true)}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);

	return { confirm, ConfirmDialog };
}
