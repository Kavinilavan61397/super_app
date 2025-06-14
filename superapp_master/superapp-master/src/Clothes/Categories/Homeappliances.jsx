import React, { useState, useEffect } from 'react';
import Footer from '../../Utility/Footer';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import godrejmicroovenImage from '../Images/godrejmicrooven.png';
import acImage from '../Images/ac.png';
import godrejrefImage from '../Images/godrejref.jpg';
import godrejwashingImage from '../Images/godrejwashing.jpg';

const homeAppliances = [
  {
    id: 1,
    name: 'Microwave Oven',
    originalPrice: 12000,
    discountedPrice: 9000,
    description: 'Compact microwave for quick cooking.',
    rating: 4.5,
    isBestSeller: true,
    brand: 'Godrej',
    category: 'Microwave',
    inStock: true,
    image: godrejmicroovenImage, 
  },
 {
  id: 2,
  name: "Godrej CoolBreeze AC",
  originalPrice: 5000,
  discountedPrice: 3500,
  description: "Energy-efficient 1.5-ton split AC with fast cooling and low power consumption.",
  rating: 4.1,
  isBestSeller: true,
  brand: "Godrej",
  category: "AC",
  inStock: true,
  image: acImage ,
},
  {
    id: 4,
    name: 'Refrigerator',
    originalPrice: 25000,
    discountedPrice: 20000,
    description: 'Energy-efficient double-door fridge.',
    rating: 4.4,
    isBestSeller: false,
    brand: 'Godrej',
    category: 'Refrigerator',
    inStock: false,
    image: godrejrefImage,
  },
 {
  id: 5,
  name: 'Godrej 7kg Front Load Washing Machine',
  originalPrice: 35000,
  discountedPrice: 28000,
  description: '7kg Fully Automatic Front Load Washing Machine with Inverter Motor, Steam Wash, and Energy-Saving Technology.',
  rating: 4.6,
  isBestSeller: true,
  brand: 'Godrej',
  category: 'WashingMachine',
  inStock: true,
  image: 'godrejwashingImage',
},
  {
    id: 6,
    name: 'TV',
    originalPrice: 40000,
    discountedPrice: 32000,
    description: 'QLED 4K Smart TV.',
    rating: 4.7,
    isBestSeller: true,
    brand: 'Samsung',
    category: 'TV',
    inStock: true,
    image: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=TV',
  },
  {
    id: 7,
    name: 'Refrigerator',
    originalPrice: 30000,
    discountedPrice: 24000,
    description: 'Side-by-side refrigerator with inverter.',
    rating: 4.5,
    isBestSeller: false,
    brand: 'Samsung',
    category: 'Refrigerator',
    inStock: true,
    image: 'https://via.placeholder.com/150/00FFFF/FFFFFF?text=Refrigerator',
  },
  {
    id: 8,
    name: 'Washing Machine',
    originalPrice: 20000,
    discountedPrice: 16000,
    description: 'Front-load washing machine with eco bubble.',
    rating: 4.3,
    isBestSeller: true,
    brand: 'Samsung',
    category: 'Washing Machine',
    inStock: true,
    image: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=Washing+Machine',
  },
  {
    id: 9,
    name: 'TV',
    originalPrice: 38000,
    discountedPrice: 30000,
    description: 'OLED 4K Smart TV.',
    rating: 4.8,
    isBestSeller: true,
    brand: 'LG',
    category: 'TV',
    inStock: false,
    image: 'https://via.placeholder.com/150/800080/FFFFFF?text=TV',
  },
  {
    id: 10,
    name: 'Air Conditioner',
    originalPrice: 45000,
    discountedPrice: 36000,
    description: 'Inverter AC with dual cooling.',
    rating: 4.4,
    isBestSeller: false,
    brand: 'LG',
    category: 'Air Conditioner',
    inStock: true,
    image: 'https://via.placeholder.com/150/008000/FFFFFF?text=Air+Conditioner',
  },
  {
    id: 11,
    name: 'Refrigerator',
    originalPrice: 28000,
    discountedPrice: 22000,
    description: 'Frost-free refrigerator with smart cooling.',
    rating: 4.2,
    isBestSeller: false,
    brand: 'LG',
    category: 'Refrigerator',
    inStock: true,
    image: 'https://via.placeholder.com/150/FFC0CB/FFFFFF?text=Refrigerator',
  },
];

const ApplianceCard = ({ name, originalPrice, discountedPrice, description, rating, isBestSeller, brand, id, addToCart, cartItems, inStock, image }) => {
  const isInCart = cartItems.some((cartItem) => cartItem.id === id);
  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (
    <div className="relative border rounded-lg p-4 flex flex-col items-center bg-white shadow-md hover:shadow-lg transition mystery">
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
    
      <img src={image} alt={name} className="w-full h-32 object-contain mb-2 rounded-md" />
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
          isInCart || !inStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'
        }`}
        onClick={() => addToCart({ id, name, originalPrice, discountedPrice, description, rating, isBestSeller, brand, inStock, image })}
        disabled={isInCart || !inStock}
      >
        {isInCart ? 'Added to Cart' : !inStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

function HomeAppliances() {
  const [cartItems, setCartItems] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [filterState, setFilterState] = useState({
    discount: [],
    brands: [],
    priceRange: null,
    offers: false,
    inStock: false,
    allBrands: false,
  });

  const brands = ['Godrej', 'Samsung', 'LG'];
  const priceRanges = [
    { label: 'All', min: null, max: null },
    { label: '₹200 - ₹500', min: 200, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: '₹6000 - ₹9000', min: 6000, max: 9000 },
    { label: '₹10000 - ₹20000', min: 10000, max: 20000 },
    { label: '₹20000 - ₹50000', min: 20000, max: 50000 },
  ];
  const discountRanges = [
    { label: '10% and above', min: 10 },
    { label: '20% and above', min: 20 },
    { label: '30% and above', min: 30 },
    { label: '40% and above', min: 40 },
  ];
  const sortOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Price: Low to High', value: 'priceLow' },
    { label: 'Price: High to Low', value: 'priceHigh' },
    { label: 'Rating: High to Low', value: 'rating' },
    { label: 'Name: A to Z', value: 'name' },
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

  const handleFilterChange = (key, value) => {
    setFilterState((prev) => {
      if (key === 'allBrands') {
        const newAllBrands = !prev.allBrands;
        return {
          ...prev,
          allBrands: newAllBrands,
          brands: newAllBrands ? brands : [],
        };
      }
      if (key === 'discount') {
        const updatedArray = prev[key].includes(value)
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value];
        return { ...prev, [key]: updatedArray };
      }
      if (key === 'brands') {
        const updatedBrands = prev.brands.includes(value)
          ? prev.brands.filter((item) => item !== value)
          : [...prev.brands, value];
        return {
          ...prev,
          brands: updatedBrands,
          allBrands: updatedBrands.length === brands.length,
        };
      }
      if (key === 'priceRange') {
        return { ...prev, priceRange: value };
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const applyFilters = () => {
    setShowFilterPanel(false);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setShowSortPanel(false);
  };

  const goBack = () => {
    window.history.back();
  };

  const filteredAppliances = homeAppliances
    .filter(appliance => {
      const discountPercentage = Math.round(((appliance.originalPrice - appliance.discountedPrice) / appliance.originalPrice) * 100);
      const matchesDiscount = filterState.discount.length
        ? filterState.discount.some((min) => discountPercentage >= min)
        : true;
      const matchesBrands = filterState.allBrands || !filterState.brands.length
        ? true
        : filterState.brands.includes(appliance.brand);
      const matchesPrice = filterState.priceRange && filterState.priceRange.min !== null
        ? appliance.discountedPrice >= filterState.priceRange.min && appliance.discountedPrice <= filterState.priceRange.max
        : true;
      const matchesOffers = filterState.offers ? appliance.isBestSeller : true;
      const matchesAvailability = filterState.inStock ? appliance.inStock : true;
      return matchesDiscount && matchesBrands && matchesPrice && matchesOffers && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === 'priceLow') return a.discountedPrice - b.discountedPrice;
      if (sortBy === 'priceHigh') return b.discountedPrice - a.discountedPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="flex">
      <div className="flex-1">
        <EcommerceGroceryHeader />
        <div className="pt-24 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-600 hover:text-[#00BB1C] rounded-full focus:outline-none"
                onClick={goBack}
                title="Go Back"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-[#000000]">Home Appliances</h1>
            </div>
            <div className="flex items-center space-x-4 relative">
              <button
                className="px-4 py-2 bg-[#00BB1C] text-white rounded-md hover:bg-[#009B16] text-sm font-medium"
                onClick={() => setShowSortPanel(!showSortPanel)}
              >
                Sort By
              </button>
              {showSortPanel && (
                <div className="absolute top-12 right-28 bg-white border border-gray-300 rounded-md shadow-lg z-50 w-48">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-[#00BB1C] hover:text-white ${
                        sortBy === option.value ? 'bg-[#00BB1C] text-white' : ''
                      }`}
                      onClick={() => handleSortSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              <button
                className="px-4 py-2 bg-[#00BB1C] text-white rounded-md hover:bg-[#009B16] text-sm font-medium"
                onClick={() => setShowFilterPanel(true)}
              >
                Filter
              </button>
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

        {showFilterPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
            <div className="bg-white w-80 h-full p-6 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#000000]">Filters</h2>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setShowFilterPanel(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#000000] mb-3">Discount</h3>
                {discountRanges.map((range) => (
                  <div key={range.label} className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id={`discount-${range.min}`}
                      checked={filterState.discount.includes(range.min)}
                      onChange={() => handleFilterChange('discount', range.min)}
                      className="mr-2"
                    />
                    <label htmlFor={`discount-${range.min}`} className="text-sm text-gray-600">{range.label}</label>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#000000] mb-3">Brand</h3>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="brand-all"
                    checked={filterState.allBrands}
                    onChange={() => handleFilterChange('allBrands', null)}
                    className="mr-2"
                  />
                  <label htmlFor="brand-all" className="text-sm text-gray-600">All</label>
                </div>
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id={`brand-${brand}`}
                      checked={filterState.brands.includes(brand)}
                      onChange={() => handleFilterChange('brands', brand)}
                      className="mr-2"
                    />
                    <label htmlFor={`brand-${brand}`} className="text-sm text-gray-600">{brand}</label>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#000000] mb-3">Price</h3>
                <select
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00BB1C]"
                  onChange={(e) => {
                    const selected = priceRanges.find(range => range.label === e.target.value);
                    handleFilterChange('priceRange', selected.min !== null ? selected : null);
                  }}
                  value={filterState.priceRange ? filterState.priceRange.label : 'All'}
                >
                  {priceRanges.map(range => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#000000] mb-3">Offers</h3>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="best-seller"
                    checked={filterState.offers}
                    onChange={() => handleFilterChange('offers', null)}
                    className="mr-2"
                  />
                  <label htmlFor="best-seller" className="text-sm text-gray-600">Best Seller</label>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#000000] mb-3">Availability</h3>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="in-stock"
                    checked={filterState.inStock}
                    onChange={() => handleFilterChange('inStock', null)}
                    className="mr-2"
                  />
                  <label htmlFor="in-stock" className="text-sm text-gray-600">In Stock</label>
                </div>
              </div>

              <button
                className="w-full bg-[#00BB1C] text-white py-2 rounded-md hover:bg-[#009B16] text-sm font-medium"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

export default HomeAppliances;