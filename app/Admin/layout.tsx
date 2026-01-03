"use client";

import { createContext, ReactNode, useState, useContext } from "react";

// 1️⃣ Create the context type
interface CategoryContextType {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
}

// 2️⃣ Create the context
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// 3️⃣ Export a hook for easier usage
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within DashboardLayout");
  }
  return context;
};

// 4️⃣ DashboardLayout
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('category');

  // Example categories for the sidebar dropdown
  const categories = ["Electronics", "Clothing", "Books", "Toys"];

  return (
    // 5️⃣ Provide context to all children
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "260px",
            background: "#111827",
            color: "white",
            padding: "25px",
          }}
        >
          <h2 style={{ fontSize: "22px", marginBottom: "25px" }}>Admin Panel</h2>

          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2rem" }}>
            <li style={{ cursor: "pointer" }}>Dashboard</li>
            <li onClick={()=>{setSelectedCategory('category');}} style={{ cursor: "pointer" }}>Categories</li>
            <li onClick={()=>{setSelectedCategory('products');}} style={{ cursor: "pointer" }}>Products</li>
            <li style={{ cursor: "pointer" }}>Users</li>
            <li style={{ cursor: "pointer" }}>Settings</li>
          </ul>

          {/* Category selector inside sidebar */}
          {/* <div style={{ marginTop: 40 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Select Category:</label>
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 5,
                border: "none",
                background: "#1f2937",
                color: "white",
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div> */}
        </aside>

        {/* Content Area */}
        <main
          style={{
            flex: 1,
            background: "#f3f4f6",
            padding: "25px",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </CategoryContext.Provider>
  );
}
