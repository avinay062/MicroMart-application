import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const id = product._id || product.id;
  const imageSrc = product.image
    ? `data:image/jpeg;base64,${product.image}`
    : 'https://via.placeholder.com/300x200?text=No+image';

  return (
    <Link
      to={`/products/${id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:shadow-slate-950/50"
    >
      <div className="aspect-[4/3] bg-slate-100 overflow-hidden dark:bg-slate-700">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 truncate dark:text-slate-100">{product.name}</h3>
        <p className="text-amber-600 font-medium mt-1 dark:text-amber-400">${Number(product.price).toFixed(2)}</p>
        {product.description && (
          <p className="text-slate-600 text-sm mt-2 line-clamp-2 dark:text-slate-300">{product.description}</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
