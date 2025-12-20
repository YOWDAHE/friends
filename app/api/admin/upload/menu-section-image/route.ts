import { NextResponse } from "next/server";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
const uploadPreset = process.env.CLOUDINARY_MENU_UPLOAD_PRESET!;

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("upload_preset", uploadPreset);

        const res = await fetch(cloudinaryUrl, {
            method: "POST",
            body: uploadForm,
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("Cloudinary error:", err);
            return NextResponse.json({ error: "Upload failed" }, { status: 500 });
        }

        const data = await res.json();

        return NextResponse.json({
            url: data.secure_url as string,
            publicId: data.public_id as string,
        });
    } catch (e) {
        console.error("Upload error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
