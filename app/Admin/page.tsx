"use client";
import { CSSProperties, useEffect, useState } from "react";
import Products from "../src/components/products";
import { useCategory } from "./layout";
import Categories from "../src/components/categories";
import { Api_Url } from "../src/assets/Data";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
    const { selectedCategory } = useCategory();
    const [cardData, setCardData] = useState<any>({});

    const fetchData = async () => {
        try {
            const response = await fetch(`${Api_Url}/products`);
            const response1 = await fetch(`${Api_Url}/category`);
            const json = await response.json();
            const json1 = await response1.json();
            setCardData({ prod: json.length, cat: json1.length });

            // console.log('length:', json.length, json1.length);

        } catch {
            console.log('error fetching...');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {/* Stats Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginBottom: 20,
                }}
            >
                <div style={card}>
                    <h3>Total Products</h3>
                    <p style={num}>{cardData?.prod}</p>
                </div>

                <div style={card}>
                    <h3>Total Categories</h3>
                    <p style={num}>{cardData?.cat}</p>
                </div>

                <div style={card}>
                    <h3>Total Users</h3>
                    <p style={num}>NA</p>
                </div>
            </div>

            {selectedCategory === 'category' && <Categories />}
            {selectedCategory === 'products' && <Products />}
        </>
    );
}

// Reusable Styles
const card: CSSProperties = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
};

const num: CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px",
};

const table: CSSProperties = {
    width: "100%",
    background: "white",
    borderRadius: "10px",
    padding: "10px",
    borderCollapse: "collapse",
};

const th: CSSProperties = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
};

const td: CSSProperties = {
    padding: "10px",
    borderBottom: "1px solid #eee",
};

const btn: CSSProperties = {
    padding: "6px 10px",
    marginRight: "6px",
    background: "#111827",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
};

const delBtn: CSSProperties = {
    padding: "6px 10px",
    background: "red",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
};
