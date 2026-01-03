"use client";
import { CSSProperties, useEffect, useState } from "react";
import { Api_Url } from "../assets/Data";
import Modal from "../assets/utils/Modal";
import Image from "next/image";

interface Category {
  _id: string;
  category: string;
  image?: string;
  public_id?: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryFile, setCategoryFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Fetch categories
  const getCategories = async () => {
    try {
      const res = await fetch(`${Api_Url}/category`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Update preview when a new file is selected
  useEffect(() => {
    if (categoryFile) {
      const url = URL.createObjectURL(categoryFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    } else {
      setPreviewUrl("");
    }
  }, [categoryFile]);

  if (loading) return <p>Loading...</p>;

  // Open modal for add/edit
  const openModal = (cat?: Category) => {
    if (cat) {
      setSelectedCat(cat);
      setCategoryName(cat.category);
    } else {
      setSelectedCat(null);
      setCategoryName("");
      setCategoryFile(null);
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

  // Save category
  const handleSave = async () => {
    try {
      const base64File = categoryFile ? await getBase64(categoryFile) : null;
      console.log('selected id:', selectedCat?._id);

      const url = selectedCat
        ? `${Api_Url}/update-category/${selectedCat._id}`
        : `${Api_Url}/upload-category`;

      // Build payload dynamically
      const payload: { category: string; image?: string | ArrayBuffer | null } = {
        category: categoryName,
      };

      if (base64File) {
        payload.image = base64File; 
      }


      const res = await fetch(url, {
        method: selectedCat ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.text();
      console.log("Saved category:", data);

      closeModal();
      getCategories();
    } catch (error) {
      console.error("Error saving category", error);
    }
  };

  // Delete category
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${Api_Url}/delete-category/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const text = await res.text();
        alert("Failed to delete category!");
        console.error(text);
        return;
      }

      alert("Category deleted successfully!");
      getCategories();
    } catch (error) {
      alert("Something went wrong while deleting!");
      console.error("Error deleting category", error);
    }
  };


  const closeModal = () => {
    setIsOpen(false);
    setSelectedCat(null);
    setCategoryName("");
    setCategoryFile(null);
    setPreviewUrl("");
  };

  return (
    <>
      {/* Header */}
      <div style={headerStyle}>
        <h2>Categories</h2>
        <button onClick={() => openModal()} style={btnStyle}>
          + Add New
        </button>
      </div>

      {/* Table */}
      <div style={{ marginTop: 25 }}>
        <h3 style={{ marginBottom: 10 }}>Recent Categories</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => (
              <tr key={item._id}>
                <td style={tdStyle}>
                  {item.image ? (
                    <div style={{ width: 48, height: 48, position: "relative" }}>
                      <Image
                        src={item.image}
                        alt={item.category}
                        fill
                        style={{ objectFit: "cover", borderRadius: 5 }}
                      />
                    </div>
                  ) : (
                    <div style={{ width: 48, height: 48, background: "#ccc" }} />
                  )}
                </td>
                <td style={tdStyle}>{item.category}</td>
                <td style={tdStyle}>
                  <button onClick={() => openModal(item)} style={btnStyle}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} style={delBtnStyle}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} title={selectedCat ? "Edit Category" : "Create Category"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          {/* Image preview */}
          <div style={{ width: 96, height: 96, position: "relative" }}>
            {previewUrl || selectedCat?.image ? (
              <Image
                src={previewUrl || selectedCat!.image!}
                alt="category"
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
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setCategoryFile(e.target.files[0])}
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

// Styles
const headerStyle: CSSProperties = {
  background: "white",
  padding: "15px 20px",
  borderRadius: 10,
  marginBottom: 20,
  display: "flex",
  justifyContent: "space-between",
  marginTop: 15,
};

const tableStyle: CSSProperties = {
  width: "100%",
  background: "white",
  borderRadius: 10,
  padding: 10,
  borderCollapse: "collapse" as const,
};

const thStyle: CSSProperties = {
  padding: 12,
  textAlign: "left",
  borderBottom: "1px solid #ddd",
};

const tdStyle: CSSProperties = {
  padding: 10,
  borderBottom: "1px solid #eee",
};

const btnStyle: CSSProperties = {
  padding: "6px 10px",
  marginRight: 6,
  background: "#111827",
  color: "white",
  borderRadius: 5,
  cursor: "pointer",
};

const delBtnStyle: CSSProperties = {
  padding: "6px 10px",
  background: "red",
  color: "white",
  borderRadius: 5,
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  padding: 8,
  borderRadius: 5,
  border: "1px solid #ccc",
  width: "90%",
};

const submitStyle: CSSProperties = {
  padding: 10,
  background: "#111827",
  color: "white",
  borderRadius: 5,
  cursor: "pointer",
};
