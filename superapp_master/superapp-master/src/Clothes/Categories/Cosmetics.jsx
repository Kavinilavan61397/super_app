import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../Utility/Footer';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import cosmeticImage from '../Images/cosmetic.jpg'; 



const brandCosmetics = [
   { name: 'Nykaa ', image: cosmeticImage, route: '../Cosmetics/Nykaa.jsx' },
  // { name: 'Maybelline ', image: cosmeticImage, route: '/products/maybelline-lipstick' },
  // // { name: 'L\'Oréal Mascara', image: cosmeticImage, route: '/products/loreal-mascara' },
  // // { name: 'Nykaa Eyeshadow', image: cosmeticImage, route: '/products/nykaa-eyeshadow' },
];

const CosmeticCard = ({ name, image, route }) => {
  return (
    <Link to={route} className="relative border rounded-lg p-4 flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow">
      <img src={image} alt={name} title={name} className="w-24 h-24 object-contain mb-2" />
      {/* Name */}
      <h3 className="text-sm font-medium text-[#000000]">{name}</h3>
    </Link>
  );
};

function BrandCosmetics() {
  return (
    <div>
      <EcommerceGroceryHeader />
      <div className="pt-24 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#000000]">COSMETIC BRANDS</h1>
          {/* <Link to="/" className="text-sm text-[#00BB1C] hover:underline">
            Back to Categories
          </Link> */}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {brandCosmetics.map((product, index) => (
            <CosmeticCard key={index} name={product.name} image={product.image} route={product.route} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BrandCosmetics;