"use client";

import { use, useEffect, useState } from "react";
import Header from "@/app/src/assets/utils/header";
import ProductCard from "@/app/src/assets/utils/ProductCard";
import { Api_Url } from "@/app/src/assets/Data";
import { ClipLoader } from "react-spinners";
import Category from "@/app/src/assets/utils/Category";

export default function ProductPage({ params }) {
  
  const { slug } = use(params);    
  const title = slug.replace(/-/g, ' ');

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${Api_Url}/category`);
        const res1 = await fetch(`${Api_Url}/product/${title}`);
        const data = await res.json();
        const data1 = await res1.json();
        setCategory(data);
        setProducts(data1);
      } catch (error) {
        console.log("Error fetching category/products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return (
    <div className="flex flex-col items-center w-full">
      <Header />

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh] w-full bg-[#F5F0E6] p-8">
          <ClipLoader color="maroon" size={50} />
        </div>
      ) : error ? (
        <div className="text-red-600 mt-6 font-bold">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-gray-600 mt-6">No products found.</div>
      ) : (
        <main className="flex flex-col items-center sm:items-start bg-[#F5F0E6] min-h-screen w-full px-4 sm:px-6 lg:px-10 pb-10">
                  <span className="text-[20px] sm:text-[24px] font-bold mb-3 text-[#800020] mt-4 w-full text-left">
                    Our Categories
                  </span>
                  <Category categories={category} />
          <span className="text-[20px] sm:text-[24px] font-bold mb-3 text-[#800020] mt-4 w-full text-left">
            Our Products
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            {products.map((item, i) => (
              <ProductCard key={i} {...item} />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
