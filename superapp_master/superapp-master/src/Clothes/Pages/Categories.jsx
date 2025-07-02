import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Utility/Footer';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import shirt from '../Images/shirt.svg';
import cosmeticImage from '../Images/cosmetic.jpg'; 
import homeAppliances from '../Images/homeAppliance.jpg';
import MenWear from '../Images/MenWear.jpg';
import MensBlackSuit from '../Images/MensBlackSuit.jpg';

const categories = [
  { name: 'Men', image: MensBlackSuit, bg: 'bg-gradient-to-t from-[#47FF9A00] to-[#47FF9A]', route: '/categories/mens-wear' },
  { name: 'Women', image: shirt, bg: 'bg-gradient-to-t from-[#47FFFF00] to-[#47FFFF]', route: '/categories/womens-wear' },
  { name: 'Cosmetics', image: cosmeticImage, bg: 'bg-gradient-to-t from-[#BC47FF00] to-[#BC47FF]', route: '/categories/cosmetics' },
  { name: "Home Appliances",image: homeAppliances, bg: 'bg-gradient-to-t from-[#E6F24200] to-[#E6F242]', route:'/categories/homeappliances'}
];

const CategoryCard = ({ name, image, bg, badge, onClick }) => {
  return (
    <div className="relative flex flex-col items-center cursor-pointer" onClick={onClick}>
      <div className={`relative rounded-2xl ${bg} flex flex-col justify-center items-center w-[100px] h-[110px] sm:w-36`}>
        {badge && (
          <span className="absolute top-0 left-0 right-0 mx-auto text-center bg-[#00BB1C] text-[black] text-[10px] font-medium px-3 h-[18px] py-0 rounded-b-full inline-block w-max">
            {badge}
          </span>
        )}
        <img src={image} alt={name} className="w-20 h-20 object-contain" />
      </div>
      <p className="text-center text-xs font-normal mt-2 text-[#000000]">{name}</p>
    </div>
  );
};

function Categories() {
  const navigate = useNavigate();

  return (
    <div>
      <EcommerceGroceryHeader />
      <div className="pt-24 px-4">
        <div className="font-medium text-base">List of Categories</div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              {...category}
              onClick={() => navigate(category.route)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Categories;