"use client"; // Required in Next.js 13+ for client components

import { useState } from "react";
import { Api_Url } from "../src/assets/Data";

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Convert file to Base64
    const getBase64 = (file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        if (!file) return alert("Please select an image");

        const base64File = await getBase64(file);

        const res = await fetch(`${Api_Url}/upload-category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ category: category, image: base64File }),
        });

        const data = await res.json();
        if (data.success) {
            setImageUrl(data.url); // Cloudinary URL
            alert('upload successfull');
        } else {
            alert("Upload failed: " + data.error);
        }
        setLoading(false);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Upload Image</h2>
            <span className="text-xl font-bold mb-2">Category</span>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                    type="text"
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                />
                {loading ? <span>uploading...</span> : <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Upload
                </button>}
            </form>

            {imageUrl && (
                <div className="mt-4">
                    <p>Uploaded Image:</p>
                    <img src={imageUrl} alt="Uploaded" className="w-64 mt-2" />
                </div>
            )}
        </div>
    );
}
