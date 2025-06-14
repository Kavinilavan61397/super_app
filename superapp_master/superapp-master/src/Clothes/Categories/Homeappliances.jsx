import React, { useState, useEffect } from 'react';
import Footer from '../../Utility/Footer';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';

const homeAppliances = [
  { id: 1, name: 'Microwave Oven', originalPrice: 12000, discountedPrice: 9000, description: 'Compact microwave for quick cooking.', rating: 4.5, isBestSeller: true, brand: 'Preethi', category: 'Microwave' },
  { id: 2, name: 'Blender', originalPrice: 5000, discountedPrice: 3500, description: 'Powerful blender for smoothies and soups.', rating: 4.1, isBestSeller: true, brand: 'Preethi', category: 'Blender' },
  { id: 4, name: 'Refrigerator', originalPrice: 25000, discountedPrice: 20000, description: 'Energy-efficient double-door fridge.', rating: 4.4, isBestSeller: false, brand: 'Preethi', category: 'Refrigerator' },
  { id: 5, name: 'TV', originalPrice: 35000, discountedPrice: 28000, description: '4K Smart LED TV with HDR.', rating: 4.6, isBestSeller: true, brand: 'Preethi', category: 'TV' },
  { id: 6, name: 'TV', originalPrice: 40000, discountedPrice: 32000, description: 'QLED 4K Smart TV.', rating: 4.7, isBestSeller: true, brand: 'Samsung', category: 'TV' },
  { id: 7, name: 'Refrigerator', originalPrice: 30000, discountedPrice: 24000, description: 'Side-by-side refrigerator with inverter.', rating: 4.5, isBestSeller: false, brand: 'Samsung', category: 'Refrigerator' },
  { id: 8, name: 'Washing Machine', originalPrice: 20000, discountedPrice: 16000, description: 'Front-load washing machine with eco bubble.', rating: 4.3, isBestSeller: true, brand: 'Samsung', category: 'Washing Machine' },
  { id: 9, name: 'TV', originalPrice: 38000, discountedPrice: 30000, description: 'OLED 4K Smart TV.', rating: 4.8, isBestSeller: true, brand: 'LG', category: 'TV' },
  { id: 10, name: 'Air Conditioner', originalPrice: 45000, discountedPrice: 36000, description: 'Inverter AC with dual cooling.', rating: 4.4, isBestSeller: false, brand: 'LG', category: 'Air Conditioner' },
  { id: 11, name: 'Refrigerator', originalPrice: 28000, discountedPrice: 22000, description: 'Frost-free refrigerator with smart cooling.', rating: 4.2, isBestSeller: false, brand: 'LG', category: 'Refrigerator' },
];

const brandLogos = {
  Preethi: '../Images/preethi appliances.png',
  Samsung: '../Images/samsung.jpg',
  LG: '../Images/lg.jpg',
};

const ApplianceCard = ({ name, originalPrice, discountedPrice, description, rating, isBestSeller, brand, id, addToCart, cartItems }) => {
  const isInCart = cartItems.some((cartItem) => cartItem.id === id);
  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (
    <div className="relative border rounded-lg p-4 flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="absolute top-2 right-2">
        <button className="bg-purple-100 rounded-full p-1">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
    
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
    
      <h3 className="text-sm font-medium text-[#000000]">{name}</h3>
      <p className="text-xs text-gray-600">{description}</p>
      <p className="text-xs text-gray-500 mt-1">Brand: {brand}</p>
      <div className="flex items-center space-x-2 mt-2">
        <p className="text-base font-bold text-[#00BB1C]">₹{discountedPrice.toFixed(2)}</p>
        <p className="text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
        <span className="text-xs text-green-600">{discountPercentage}% off</span>
      </div>
      <button 
        className={`mt-2 text-white text-xs font-medium px-4 py-2 rounded-full ${
          isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'
        }`}
        onClick={() => addToCart({ id, name, originalPrice, discountedPrice, description, rating, isBestSeller, brand })}
        disabled={isInCart}
      >
        {isInCart ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
};

function HomeAppliances() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const brands = Object.keys(brandLogos);
  const brandCategories = {
    Preethi: ['Microwave', 'Refrigerator', 'TV'],
    Samsung: ['TV', 'Refrigerator', 'Washing Machine'],
    LG: ['TV', 'Air Conditioner', 'Refrigerator'],
  };
  const priceRanges = [
    { label: 'All', min: null, max: null },
    { label: '₹200 - ₹500', min: 200, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: '₹6000 - ₹9000', min: 6000, max: 9000 },
    { label: '₹10000 - ₹20000', min: 10000, max: 20000 },
  ];

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);
  }, []);

  const addToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (!currentCart.some((item) => item.id === product.id)) {
      const updatedCart = [...currentCart, { ...product, quantity: 1 }];
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      alert(`${product.name} added to cart!`);
    } else {
      alert(`${product.name} is already in your cart!`);
    }
  };

  const handleCategorySelect = (brand, category) => {
    setSelectedBrand(brand);
    setSelectedCategory(category);
    setOpenDropdown(null);
  };

  const handleBrandSelect = (brand) => {
    if (brandCategories[brand]) {
      setOpenDropdown(openDropdown === brand ? null : brand);
      if (openDropdown !== brand) {
        setSelectedBrand('');
        setSelectedCategory('');
      }
    } else {
      setSelectedBrand(brand);
      setSelectedCategory('');
      setOpenDropdown(null);
    }
  };

  const handlePriceRangeSelect = (e) => {
    const selected = priceRanges.find(range => range.label === e.target.value);
    setPriceRange(selected.min !== null ? selected : null);
  };

  const filteredAppliances = homeAppliances.filter(appliance => {
    let matchesBrandAndCategory = true;
    if (selectedBrand) {
      matchesBrandAndCategory = appliance.brand === selectedBrand;
      if (selectedCategory) {
        matchesBrandAndCategory = matchesBrandAndCategory && appliance.category === selectedCategory;
      }
    }
    const matchesPrice = priceRange
      ? appliance.discountedPrice >= priceRange.min && appliance.discountedPrice <= priceRange.max
      : true;
    return matchesBrandAndCategory && matchesPrice;
  });

  return (
    <div className="flex">
      <div className="w-64 bg-gray-100 h-screen fixed top-0 pt-24 px-4">
        <h2 className="text-lg font-bold text-[#000000] mb-4">Brands</h2>
        <ul>
          {brands.map(brand => (
            <li key={brand}>
              <button
                className={`w-full text-left px-4 py-2 rounded-md mb-2 flex items-center justify-between ${
                  selectedBrand === brand && !openDropdown ? 'bg-[#00BB1C] text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => handleBrandSelect(brand)}
                title={brand}
              >
                <div className="flex items-center">
                  <img src={brandLogos[brand]} alt={`${brand} logo`} className="w-8 h-8 mr-2" />
                  {brand}
                </div>
                {brandCategories[brand] && (
                  <svg
                    className={`w-4 h-4 transform ${openDropdown === brand ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {brandCategories[brand] && openDropdown === brand && (
                <ul className="ml-4">
                  {brandCategories[brand].map(category => (
                    <li key={category}>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm rounded-md mb-1 ${
                          selectedBrand === brand && selectedCategory === category ? 'bg-[#00BB1C] text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => handleCategorySelect(brand, category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex-1 ml-64">
        <EcommerceGroceryHeader />
        <div className="pt-24 px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#000000]">Home Appliances</h1>
            <div className="flex items-center">
              <label htmlFor="priceFilter" className="text-sm text-gray-600 mr-2">Filter by Price:</label>
              <select
                id="priceFilter"
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00BB1C]"
                onChange={handlePriceRangeSelect}
                value={priceRange ? priceRange.label : 'All'}
              >
                {priceRanges.map(range => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {filteredAppliances.map((appliance) => (
              <ApplianceCard 
                key={appliance.id} 
                {...appliance} 
                addToCart={addToCart}
                cartItems={cartItems}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default HomeAppliances;