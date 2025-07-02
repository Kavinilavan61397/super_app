import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../Utility/Footer';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import shirt from '../Images/shirt.svg'; // Sample image for uniform items

// Sample data for men's uniforms with discount and rating
const menUniforms = [
  { id: 1, name: 'Blazer', originalPrice: 5000, discountedPrice: 4000, image: shirt, description: 'Navy blue blazer for formal occasions.', rating: 4.2, isBestSeller: true },
  { id: 2, name: 'Blazer', originalPrice: 5000, discountedPrice: 4000, image: shirt, description: 'Navy blue blazer for formal occasions.', rating: 4.2, isBestSeller: true },
  { id: 3, name: 'Blazer', originalPrice: 5000, discountedPrice: 4000, image: shirt, description: 'Navy blue blazer for formal occasions.', rating: 4.2, isBestSeller: true },
];

const UniformCard = ({ name, originalPrice, discountedPrice, image, description, rating, isBestSeller }) => {
  return (
    <div className="relative border rounded-lg p-4 flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow">
      {/* Wishlist Heart Icon */}
      <div className="absolute top-2 right-2">
        <button className="bg-purple-100 rounded-full p-1">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
      {/* Image */}
      <img src={image} alt={name} className="w-24 h-24 object-contain mb-2" />
      {/* Best Seller Label and Rating */}
      <div className="flex items-center justify-between w-full mb-2">
        {isBestSeller && (
          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">Best Seller</span>
        )}
        <div className="flex items-center">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span className="text-xs text-gray-600 ml-1">{rating}</span>
        </div>
      </div>
      {/* Name */}
      <h3 className="text-sm font-medium text-[#000000]">{name}</h3>
      {/* Description */}
      <p className="text-xs text-gray-600">{description}</p>
      {/* Pricing */}
      <div className="flex items-center space-x-2 mt-2">
        <p className="text-base font-bold text-[#00BB1C]">₹{discountedPrice.toFixed(2)}</p>
        <p className="text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
        <span className="text-xs text-green-600">30% off</span>
      </div>
      {/* Add to Cart Button */}
      <button className="mt-2 bg-[#00BB1C] text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-[#009B16]">
        Add to Cart
      </button>
    </div>
  );
};

function MenUniforms() {
  return (
    <div>
      <EcommerceGroceryHeader />
      <div className="pt-24 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#000000]">Men Uniforms</h1>
          <Link to="/" className="text-sm text-[#00BB1C] hover:underline">
            Back to Categories
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {menUniforms.map((uniform) => (
            <UniformCard key={uniform.id} {...uniform} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MenUniforms; 