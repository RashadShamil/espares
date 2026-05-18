import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  inStock: boolean;
}

export default function ProductCard({ id, title, price, image, inStock }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Image Container */}
      <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
        <Image 
          src={image} 
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category/Brand Tag (Optional) */}
        <span className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Genuine Part</span>
        
        <Link href={`/product/${id}`} className="flex-grow">
          <h3 className="text-gray-800 font-semibold text-lg leading-snug hover:text-brand-green transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>
        
        <div className="mt-auto pt-2">
          <div className="flex justify-between items-end mb-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Price</span>
              <span className="text-xl font-bold text-brand-green">
                LKR {price.toLocaleString()}
              </span>
            </div>
            {inStock && (
               <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                 In Stock
               </div>
            )}
          </div>

          <button 
            disabled={!inStock}
            className={`w-full py-2.5 rounded-md font-semibold transition-colors flex items-center justify-center gap-2
              ${inStock 
                ? 'bg-brand-yellow text-brand-green hover:bg-yellow-500 hover:shadow' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}