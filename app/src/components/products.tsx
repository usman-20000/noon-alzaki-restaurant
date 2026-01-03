"use client";
import { CSSProperties, useEffect, useState } from "react";
import { Api_Url } from "../assets/Data";
import Modal from "../assets/utils/Modal";
import Image from "next/image";

interface Product {
    _id: string;
    id: string;
    name: string;
    category: string;
    detail: string;
    price: number;
    image?: string;
    public_id?: string;
}

type CategoryType = {
    _id: string;
    category: string;
};

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [detail, setDetail] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [productFile, setProductFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    useEffect(() => {
        fetch(`${Api_Url}/category`)
            .then((res) => res.json())
            .then(setCategories)
            .catch(console.error);
    }, []);

    // Fetch products
    const getProducts = async () => {
        try {
            const res = await fetch(`${Api_Url}/products`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    // Update preview when a new file is selected
    useEffect(() => {
        if (productFile) {
            const url = URL.createObjectURL(productFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl("");
        }
    }, [productFile]);

    if (loading) return <p>Loading...</p>;

    // Open modal for add/edit
    const openModal = (prod?: Product) => {
        if (prod) {
            setSelectedProduct(prod);
            setName(prod.name);
            setDetail(prod.detail);
            setPrice(prod.price);

            // Pre-select category when editing
            const cat = categories.find((c) => c.category === prod.category);
            setSelectedCategory(cat || null);
        } else {
            setSelectedProduct(null);
            setName("");
            setDetail("");
            setPrice("");
            setSelectedCategory(null);
            setProductFile(null);
            setPreviewUrl("");
        }
        setIsOpen(true);
    };


    // Convert file to Base64
    const getBase64 = (file: File) =>
        new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    // Save product
    // Save product
    const handleSave = async () => {
        if (!name || !selectedCategory || !detail || price === "") {
            alert("All fields are required!");
            return;
        }

        try {
            const base64File = productFile ? await getBase64(productFile) : null;
            // console.log('product id:', selectedProduct?.id);

            const url = selectedProduct
                ? `${Api_Url}/update-product/${selectedProduct?.id}`
                : `${Api_Url}/upload-product`;

            // Build payload
            const payload: any = {
                name,
                category: selectedCategory._id, // use selectedCategory._id
                detail,
                price,
            };
            if (base64File) payload.image = base64File;

            const res = await fetch(url, {
                method: selectedProduct ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                alert("Failed to save product!");
                console.error(text);
                return;
            }

            const data = await res.json();
            console.log("Saved product:", data);

            alert(selectedProduct ? "Product updated!" : "Product created!");
            closeModal();
            getProducts();
        } catch (error) {
            alert("Error saving product!");
            console.error("Error saving product", error);
        }
    };


    // Delete product
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`${Api_Url}/delete-product/${id}`, { method: "DELETE" });

            if (!res.ok) {
                const text = await res.text();
                alert("Failed to delete product!");
                console.error(text);
                return;
            }

            alert("Product deleted successfully!");
            getProducts();
        } catch (error) {
            alert("Something went wrong while deleting!");
            console.error("Error deleting product", error);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedProduct(null);
        setName("");
        setCategory("");
        setDetail("");
        setPrice("");
        setProductFile(null);
        setPreviewUrl("");
    };

    return (
        <>
            {/* Header */}
            <div style={headerStyle}>
                <h2>Products</h2>
                <button onClick={() => openModal()} style={btnStyle}>
                    + Add New
                </button>
            </div>

            {/* Table */}
            <div style={{ marginTop: 25 }}>
                <h3 style={{ marginBottom: 10 }}>Recent Products</h3>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Image</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Detail</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <tr key={item._id}>
                                <td style={tdStyle}>
                                    {item.image ? (
                                        <div style={{ width: 48, height: 48, position: "relative" }}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                style={{ objectFit: "cover", borderRadius: 5 }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ width: 48, height: 48, background: "#ccc" }} />
                                    )}
                                </td>
                                <td style={tdStyle}>{item.name}</td>
                                <td style={tdStyle}>{item.category}</td>
                                <td style={tdStyle}>{item.price}</td>
                                <td style={tdStyle}>{item.detail}</td>
                                <td style={tdStyle}>
                                    <button onClick={() => openModal(item)} style={btnStyle}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} style={delBtnStyle}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                title={selectedProduct ? "Edit Product" : "Create Product"}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                    {/* Image preview */}
                    <div style={{ width: 96, height: 96, position: "relative" }}>
                        {previewUrl || selectedProduct?.image ? (
                            <Image
                                src={previewUrl || selectedProduct!.image!}
                                alt="product"
                                fill
                                style={{ objectFit: "cover", borderRadius: 8 }}
                            />
                        ) : (
                            <div style={{ width: 96, height: 96, background: "#ccc", borderRadius: 8 }} />
                        )}
                    </div>

                    {/* Inputs */}
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                    />
                    <select
                        style={inputStyle}
                        value={selectedCategory?._id || ""}
                        onChange={(e) =>
                            setSelectedCategory(categories.find((c) => c._id === e.target.value) || null)
                        }
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
                        placeholder="Detail"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        style={inputStyle}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && setProductFile(e.target.files[0])}
                        style={inputStyle}
                    />
                    <button onClick={handleSave} style={submitStyle}>
                        Save
                    </button>
                </div>
            </Modal>
        </>
    );
}

// Styles — same as your previous code
const headerStyle: CSSProperties = { background: "white", padding: "15px 20px", borderRadius: 10, marginBottom: 20, display: "flex", justifyContent: "space-between", marginTop: 15 };
const tableStyle: CSSProperties = { width: "100%", background: "white", borderRadius: 10, padding: 10, borderCollapse: "collapse" as const };
const thStyle: CSSProperties = { padding: 12, textAlign: "left", borderBottom: "1px solid #ddd" };
const tdStyle: CSSProperties = { padding: 10, borderBottom: "1px solid #eee" };
const btnStyle: CSSProperties = { padding: "6px 10px", marginRight: 6, background: "#111827", color: "white", borderRadius: 5, cursor: "pointer" };
const delBtnStyle: CSSProperties = { padding: "6px 10px", background: "red", color: "white", borderRadius: 5, cursor: "pointer" };
const inputStyle: CSSProperties = { padding: 8, borderRadius: 5, border: "1px solid #ccc", width: "90%" };
const submitStyle: CSSProperties = { padding: 10, background: "#111827", color: "white", borderRadius: 5, cursor: "pointer" };
