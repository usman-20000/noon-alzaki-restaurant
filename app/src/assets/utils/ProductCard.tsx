import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  name: string;
  image: string;
  detail: string;
  category: string;
  price: number;
};

export default function ProductCard({
  name,
  image,
  detail,
  price,
}: ProductCardProps) {

  return (
    <div className="
      bg-white rounded-xl shadow-md p-4 
      w-full 
      hover:scale-[1.03] transition-all 
    ">
      {/* Image */}
      <div className="relative w-full h-28 sm:h-28 md:h-34 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="mt-3 text-base sm:text-lg font-bold text-gray-900 truncate">
        {name}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">
        {detail}
      </p>

      {/* Rating */}
      <div className="flex items-center mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < 4
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>

      {/* Price + Add button */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm sm:text-sm lg:text-lg font-bold text-green-700">
          SAR {price}
        </span>

        <button className="
          bg-[#800020] text-white px-2 py-2 
          text-xs rounded-md 
          hover:bg-[#5c0017] transition
        ">
          Add
        </button>
      </div>
    </div>
  );
}
