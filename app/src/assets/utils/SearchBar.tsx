"use client";

import Image from "next/image";
import { useState } from "react";
import search from "../../images/search.png";

export default function SearchBar({ onSearch = () => {} }: any) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: any) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-0 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] shadow-lg rounded-full bg-white">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-3 py-2 focus: outline-none w-full placeholder-gray-400 text-black"
      />

      <button
        type="submit"
        className="bg-[#800020] text-white px-4 py-2 rounded-r-full border"
      >
        <Image src={search} className="h-4 w-4" alt="Noon Al Zaki Restaurant"/>
      </button>
    </form>
  );
}
