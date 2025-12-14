"use client";

import Image from "next/image";
import banner from "./src/images/banner.jpg";
import Header from "./src/assets/utils/header";
import Category from "./src/assets/utils/Category";
import { Api_Url } from "./src/assets/Data";
import ProductCard from "./src/assets/utils/ProductCard";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

type Product = {
  name: string;
  price: number;
  image: string;
  detail: string;
  category: string;
};


export default function Home() {

  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<any>([]);
  const [products, setProduts] = useState<Product[]>([]);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "maroon",
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${Api_Url}/category`);
        const res1 = await fetch(`${Api_Url}/products`);
        const data = await res.json();
        const data1 = await res1.json();
        setCategory(data);
        setProduts(data1);
        // console.log("data:", data, data1);
      } catch (error) {
        console.log("Error fetching category/products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <Header />

      {/* Responsive Banner */}
      <div className="w-full overflow-hidden">
        <Image
          src={banner}
          alt="Banner"
          className="w-full h-[180px] sm:h-[220px] md:h-[350px] lg:h-[420px] object-cover"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full bg-[#F5F0E6] p-8">
          <ClipLoader
            color="maroon"
            loading={loading}
            cssOverride={override}
            size={50}
          />
        </div>
      ) : (
        <main className="flex w-full flex-col items-center sm:items-start bg-[#F5F0E6] min-h-screen px-4 sm:px-6 lg:px-10 pb-10">

          {/* Category Section */}
          <span className="text-[20px] sm:text-[24px] font-bold mb-3 text-[#800020] mt-4 w-full text-left">
            Our Categories
          </span>
          <Category categories={category} />

          {/* Products Title */}
          <span className="text-[20px] sm:text-[24px] font-bold mb-3 text-[#800020] mt-4 w-full text-left">
            Our Products
          </span>

          {/* Responsive Product Grid */}
          <div className="
            grid 
            grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-5 
            gap-4 
            w-full
          ">
            {products.map((item, idx) => (
              <ProductCard key={idx} {...item} />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
