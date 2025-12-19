import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteCloudinaryImage(publicId: string) {
    if (!publicId) return;
    try {
        console.log("deleting Image")
        await cloudinary.uploader.destroy(publicId);
    } catch (e) {
        console.error("Failed to delete Cloudinary image", publicId, e);
    }
}
