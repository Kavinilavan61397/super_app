import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import Footer from '../../Utility/Footer';

const EcommerceCosmeticsHeader = () => {
  return (
    <header className="bg-[#00BB1C] text-white p-4 fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Cosmetics Store</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/cart" className="hover:underline">Cart</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const cosmeticsProducts = [
  {
    id: 1,
    name: 'Moisturizing Lipstick',
    originalPrice: 1200,
    discountedPrice: 900,
    description: 'Long-lasting hydrating lipstick with vibrant color.',
    rating: 4.5,
    isBestSeller: true,
    brand: 'Lakmé',
    category: 'Lipstick',
    inStock: true,
    image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Lipstick',
    deliveryInfo: {
      returns: 'No Returns',
      paymentOptions: 'Cash on Delivery, UPI, Credit/Debit Card',
      deliveryDate: 'By 20th June 2025',
    },
    offers: [
      { code: 'LIP5', description: '₹5 off on first order', discount: 5 },
      { code: 'BOGO50', description: 'Buy 1 Get 1 at 50% off', discount: '50% on second item' },
      { code: 'FREESHIP', description: 'Free delivery on orders above ₹500', discount: 'Free Shipping' },
    ],
  },
  {
    id: 2,
    name: 'Matte Foundation',
    originalPrice: 2500,
    discountedPrice: 2000,
    description: 'Full-coverage foundation with a matte finish.',
    rating: 4.3,
    isBestSeller: true,
    brand: 'Maybelline',
    category: 'Foundation',
    inStock: true,
    image: 'https://via.placeholder.com/150/FFA07A/FFFFFF?text=Foundation',
    deliveryInfo: {
      returns: '30-day Returns',
      paymentOptions: 'UPI, Credit/Debit Card',
      deliveryDate: 'By 22nd June 2025',
    },
    offers: [],
  },
  {
    id: 3,
    name: 'Waterproof Mascara',
    originalPrice: 800,
    discountedPrice: 600,
    description: 'Volumizing mascara resistant to water and smudging.',
    rating: 4.6,
    isBestSeller: false,
    brand: 'Lakmé',
    category: 'Mascara',
    inStock: true,
    image: 'https://via.placeholder.com/150/000000/FFFFFF?text=Mascara',
    deliveryInfo: {
      returns: '30-day Returns',
      paymentOptions: 'Cash on Delivery, UPI, Credit/Debit Card',
      deliveryDate: 'By 21st June 2025',
    },
    offers: [],
  },
  {
    id: 4,
    name: 'Hydrating Face Cream',
    originalPrice: 1800,
    discountedPrice: 1400,
    description: 'Daily moisturizer for soft and radiant skin.',
    rating: 4.4,
    isBestSeller: true,
    brand: 'L\'Oréal',
    category: 'Face Cream',
    inStock: false,
    image: 'https://via.placeholder.com/150/FFD700/FFFFFF?text=Face+Cream',
    deliveryInfo: {
      returns: '30-day Returns',
      paymentOptions: 'UPI, Credit/Debit Card',
      deliveryDate: 'By 23rd June 2025',
    },
    offers: [],
  },
  {
    id: 5,
    name: 'Liquid Eyeliner',
    originalPrice: 1000,
    discountedPrice: 750,
    description: 'Precision eyeliner with intense black pigment.',
    rating: 4.7,
    isBestSeller: true,
    brand: 'Maybelline',
    category: 'Eyeliner',
    inStock: true,
    image: 'https://via.placeholder.com/150/00CED1/FFFFFF?text=Eyeliner',
    deliveryInfo: {
      returns: '30-day Returns',
      paymentOptions: 'Cash on Delivery, UPI, Credit/Debit Card',
      deliveryDate: 'By 20th June 2025',
    },
    offers: [],
  },
  {
    id: 6,
    name: 'Blush Palette',
    originalPrice: 1500,
    discountedPrice: 1200,
    description: 'Multi-shade blush palette for a natural glow.',
    rating: 4.2,
    isBestSeller: false,
    brand: 'Lakmé',
    category: 'Blush',
    inStock: true,
    image: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=Blush',
    deliveryInfo: {
      returns: '30-day Returns',
      paymentOptions: 'UPI, Credit/Debit Card',
      deliveryDate: 'By 22nd June 2025',
    },
    offers: [],
  },
  {
    id: 7,
    name: 'Nail Polish Set',
    originalPrice: 900,
    discountedPrice: 700,
    description: 'Set of vibrant nail polishes with glossy finish.',
    rating: 4.5,
    isBestSeller: true,
    brand: 'L\'Oréal',
    category: 'Nail Polish',
    inStock: true,
    image: 'https://via.placeholder.com/150/800080/FFFFFF?text=Nail+Polish',
    deliveryInfo: {
      returns: '30-day Returns',
      paymentOptions: 'Cash on Delivery, UPI, Credit/Debit Card',
      deliveryDate: 'By 21st June 2025',
    },
    offers: [],
  },
  {
    id: 8,
    name: 'BB Cream',
    originalPrice: 1100,
    discountedPrice: 850,
    description: 'Lightweight BB cream with SPF protection.',
    rating: 4.3,
    isBestSeller: false,
    brand: 'Maybelline',
    category: 'BB Cream',
    inStock: true,
    image: 'https://via.placeholder.com/150/FA8072/FFFFFF?text=BB+Cream',
    deliveryInfo: {
      returns: '30-day Returns',
      paymentOptions: 'UPI, Credit/Debit Card',
      deliveryDate: 'By 22nd June 2025',
    },
    offers: [],
  },
  {
    id: 9,
    name: 'Eyeshadow Palette',
    originalPrice: 2000,
    discountedPrice: 1600,
    description: 'Versatile eyeshadow palette with 12 shades.',
    rating: 4.8,
    isBestSeller: true,
    brand: 'L\'Oréal',
    category: 'Eyeshadow',
    inStock: false,
    image: 'https://via.placeholder.com/150/4682B4/FFFFFF?text=Eyeshadow',
    deliveryInfo: {
      returns: '30-day Returns',
      paymentOptions: 'UPI, Credit/Debit Card',
      deliveryDate: 'By 23rd June 2025',
    },
    offers: [],
  },
  {
    id: 10,
    name: 'Face Primer',
    originalPrice: 1300,
    discountedPrice: 1000,
    description: 'Smoothening primer for flawless makeup application.',
    rating: 4.4,
    isBestSeller: false,
    brand: 'Lakmé',
    category: 'Primer',
    inStock: true,
    image: 'https://via.placeholder.com/150/32CD32/FFFFFF?text=Primer',
    deliveryInfo: {
      returns: '30-day Returns',
      paymentOptions: 'Cash on Delivery, UPI, Credit/Debit Card',
      deliveryDate: 'By 20th June 2025',
    },
    offers: [],
  },
];

const CosmeticCard = ({ name, originalPrice, discountedPrice, description, rating, isBestSeller, brand, id, addToCart, cartItems, inStock, image }) => {
  const navigate = useNavigate();
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
    
      <div 
        className="cursor-pointer" 
        onClick={() => navigate(`/cosmetics/product/${id}`)}
      >
        <img src={image} alt={name} className="w-full h-32 object-contain mb-2 rounded-md" />
        <h3 className="text-sm font-medium text-[#000000] hover:text-[#00BB1C]">{name}</h3>
      </div>
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = cosmeticsProducts.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div className="pt-24 px-4 text-center">Product not found</div>;
  }

  return (
    <div className="pt-24 px-4">
      <button
        className="p-2 text-gray-600 hover:text-[#00BB1C] rounded-full focus:outline-none mb-4"
        onClick={() => navigate(-1)}
        title="Go Back"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <img src={product.image} alt={product.name} className="w-full md:w-1/2 h-64 object-contain rounded-md" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#000000]">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Brand: {product.brand}</p>
            <div className="flex items-center mt-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            </div>
            <p className="text-base text-gray-600 mt-2">{product.description}</p>
            <div className="flex items-center space-x-2 mt-4">
              <p className="text-xl font-bold text-[#00BB1C]">₹{product.discountedPrice.toFixed(2)}</p>
              <p className="text-base text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</p>
              <span className="text-sm text-green-600">
                {Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% off
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-[#000000]">Delivery & Payment</h3>
              <p className="text-sm text-gray-600">Returns: {product.deliveryInfo.returns}</p>
              <p className="text-sm text-gray-600">Payment Options: {product.deliveryInfo.paymentOptions}</p>
              <p className="text-sm text-gray-600">Estimated Delivery: {product.deliveryInfo.deliveryDate}</p>
            </div>
            {product.offers.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-[#000000]">Offers & Coupons</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {product.offers.map((offer) => (
                    <li key={offer.code}>
                      {offer.description} (Use code: <strong>{offer.code}</strong>)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className={`mt-4 text-white text-sm font-medium px-6 py-2 rounded-full ${
                product.inStock ? 'bg-[#00BB1C] hover:bg-[#009B16]' : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={() => navigate('/pages/cart')}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Buy Now' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Cosmetics() {
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

  const brands = ['Lakmé', 'Maybelline', 'L\'Oréal'];
  const priceRanges = [
    { label: 'All', min: null, max: null },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹1500', min: 1000, max: 1500 },
    { label: '₹1500 - ₹2000', min: 1500, max: 2000 },
    { label: '₹2000 - ₹3000', min: 2000, max: 3000 },
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

  const filteredCosmetics = cosmeticsProducts
    .filter(product => {
      const discountPercentage = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);
      const matchesDiscount = filterState.discount.length
        ? filterState.discount.some((min) => discountPercentage >= min)
        : true;
      const matchesBrands = filterState.allBrands || !filterState.brands.length
        ? true
        : filterState.brands.includes(product.brand);
      const matchesPrice = filterState.priceRange && filterState.priceRange.min !== null
        ? product.discountedPrice >= filterState.priceRange.min && product.discountedPrice <= filterState.priceRange.max
        : true;
      const matchesOffers = filterState.offers ? product.isBestSeller : true;
      const matchesAvailability = filterState.inStock ? product.inStock : true;
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
        <EcommerceCosmeticsHeader />
        <Routes>
          <Route
            path="/"
            element={
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
                    <h1 className="text-xl font-bold text-[#000000]">Cosmetics</h1>
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
                  {filteredCosmetics.map((product) => (
                    <CosmeticCard 
                      key={product.id} 
                      {...product} 
                      addToCart={addToCart}
                      cartItems={cartItems}
                    />
                  ))}
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
              </div>
            }
          />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default Cosmetics;