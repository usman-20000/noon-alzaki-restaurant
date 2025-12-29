"use client";

import { useState, useEffect } from "react";
import { Api_Url } from "../src/assets/Data";

type CategoryType = {
  _id: string;
  category: string;
};

export default function ProductUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [image2, setImage2] = useState<string>('');
  const [publicId, setPublicId] = useState<string>('');

  // Fetch categories from server
  useEffect(() => {
    fetch(`${Api_Url}/category`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Preview selected image
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const getBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !detail || !selectedCategory || price === "" || !image2 || !publicId) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${Api_Url}/upload-product2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category: selectedCategory._id,
          detail,
          price: Number(price),
          image: image2,
          public_id: publicId
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Product uploaded successfully");

        setName("");
        setDetail("");
        setPrice("");
        setImage2("");
        setPublicId("");
        setSelectedCategory(null);
        setFile(null);
        setPreviewUrl(null);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!file || !selectedCategory || !name.trim() || !detail.trim() || price === "") {
  //     return alert("All fields are required");
  //   }

  //   const parsedPrice = Number(price);
  //   if (isNaN(parsedPrice) || parsedPrice < 0) {
  //     return alert("Invalid price");
  //   }

  //   setLoading(true);

  //   try {
  //     const base64File = await getBase64(file);

  //     const res = await fetch(`${Api_Url}/upload-product2`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: name.trim(),
  //         detail: detail.trim(),
  //         price: parsedPrice,
  //         category: selectedCategory._id,
  //         image: image2,
  //         public_id: publicId
  //       }),
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       alert("Product uploaded successfully!");
  //       setFile(null);
  //       setName("");
  //       setDetail("");
  //       setPrice("");
  //       setSelectedCategory(null);
  //       setImageUrl(data.image_url);
  //     } else {
  //       alert(data.error || "Upload failed");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Something went wrong during upload");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="border p-2 rounded"
        />

        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Product Details"
          className="border p-2 rounded"
        />

        <select
          value={selectedCategory?._id || ""}
          onChange={(e) =>
            setSelectedCategory(categories.find((c) => c._id === e.target.value) || null)
          }
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.category}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={image2}
          onChange={(e) => setImage2(e.target.value)}
          placeholder="Product Image"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={publicId}
          onChange={(e) => setPublicId(e.target.value)}
          placeholder="publid_id"
          className="border p-2 rounded"
        />

        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Product Price"
          className="border p-2 rounded"
        />

        {/* <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        /> */}

        {/* {previewUrl && (
          <div className="mt-2">
            <p className="text-sm font-semibold">Image Preview:</p>
            <img src={previewUrl} alt="Preview" className="w-48 h-48 object-cover mt-1 rounded" />
          </div>
        )} */}

        <button
          type="submit"
          disabled={loading || !selectedCategory || !name.trim() || !detail.trim() || price === ""}
          className={`p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500"}`}
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-4">
          <p className="font-semibold">Uploaded Image:</p>
          <img src={imageUrl} alt={name} className="w-64 mt-2 rounded" />
        </div>
      )}
    </div>
  );
}
