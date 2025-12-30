"use-client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export type CategoryType = {
    _id: string;
    category: string;
    image: any;
};

type CategoryProps = {
    title?: string; // optional title
    categories: CategoryType[];
};

export default function Category({ categories }: CategoryProps) {
    
    const router = useRouter();


    return (
        <div className="flex flex-col w-[calc(98%-1rem)] ml-4 mt-2 lg:mt-4">
            <div className="flex flex-row items-center gap-2 lg:gap-4 overflow-x-auto no-scrollbar py-2">
                {categories.map((item) => {
                    const cat = item?.category?.replace(/\s+/g, '-');
                    return (
                        <div key={item._id} className="flex flex-col items-center min-w-[100px]"
                            onClick={() => router.push(`/Product/${cat}`)}>
                            <div className="p-4 bg-white shadow-lg rounded-md flex items-center justify-center shadow-md">
                                <Image
                                    src={item.image}
                                    alt={item.category}
                                    width={60}
                                    height={60}
                                    className="hover:scale-[1.03] transition-all cursor-pointer"
                                />
                            </div>
                            <span className="text-black font-semibold text-center mt-2 line-clamp-2 h-12">
                                {item.category}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
