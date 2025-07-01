import React, { useState, useEffect, useMemo } from 'react';
import Footer from '../../../Utility/Footer';
import ClothesHeader from '../../Header/ClothesHeader';
import { FaFilter, FaHeart, FaEye, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Sarees product data with saree-specific attributes
const sareeItems = [
  {
    id: 1,
    name: 'Banarasi Silk Saree',
    originalPrice: 12000,
    discountedPrice: 9600,
    image: 'https://via.placeholder.com/400/8B0000/FFFFFF?text=Banarasi+Saree',
    description: 'Traditional Banarasi silk saree with intricate zari work, perfect for weddings.',
    rating: 4.8,
    isBestSeller: true,
    quantity: 1,
    category: "Women's Wear - Sarees",
    subCategory: 'Silk Sarees',
    brand: 'Nalli Silks',
    fabric: 'Banarasi Silk',
    pattern: 'Woven',
    occasion: 'Wedding',
    border: 'Zari Border',
    blousePiece: true,
    length: '5.5 meters',
  },
  {
    id: 2,
    name: 'Chiffon Floral Print Saree',
    originalPrice: 3500,
    discountedPrice: 2800,
    image: 'https://via.placeholder.com/400/008B8B/FFFFFF?text=Chiffon+Saree',
    description: 'Lightweight chiffon saree with vibrant floral prints, ideal for casual wear.',
    rating: 4.5,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Sarees",
    subCategory: 'Casual Sarees',
    brand: 'Fabindia',
    fabric: 'Chiffon',
    pattern: 'Printed',
    occasion: 'Casual',
    border: 'Plain',
    blousePiece: true,
    length: '5.5 meters',
  },
  {
    id: 3,
    name: 'Kanjivaram Silk Saree',
    originalPrice: 18000,
    discountedPrice: 14400,
    image: 'https://via.placeholder.com/400/4B0082/FFFFFF?text=Kanjivaram+Saree',
    description: 'Authentic Kanjivaram silk saree with rich temple borders, a bridal favorite.',
    rating: 4.9,
    isBestSeller: true,
    quantity: 1,
    category: "Women's Wear - Sarees",
    subCategory: 'Silk Sarees',
    brand: 'Pothys',
    fabric: 'Kanjivaram Silk',
    pattern: 'Woven',
    occasion: 'Wedding',
    border: 'Temple Border',
    blousePiece: true,
    length: '6.2 meters',
  },
  {
    id: 4,
    name: 'Georgette Embroidered Saree',
    originalPrice: 6000,
    discountedPrice: 4800,
    image: 'https://via.placeholder.com/400/800080/FFFFFF?text=Georgette+Saree',
    description: 'Elegant georgette saree with intricate embroidery work, perfect for parties.',
    rating: 4.6,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Sarees",
    subCategory: 'Party Wear Sarees',
    brand: 'Manyavar',
    fabric: 'Georgette',
    pattern: 'Embroidered',
    occasion: 'Party',
    border: 'Embroidered Border',
    blousePiece: true,
    length: '5.5 meters',
  },
  {
    id: 5,
    name: 'Cotton Handloom Saree',
    originalPrice: 4000,
    discountedPrice: 3200,
    image: 'https://via.placeholder.com/400/228B22/FFFFFF?text=Cotton+Saree',
    description: 'Comfortable cotton handloom saree, ideal for daily wear or office.',
    rating: 4.7,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Sarees",
    subCategory: 'Daily Wear Sarees',
    brand: 'The Loom',
    fabric: 'Cotton',
    pattern: 'Striped',
    occasion: 'Daily Wear',
    border: 'Contrast Border',
    blousePiece: true,
    length: '5.2 meters',
  },
  {
    id: 6,
    name: 'Net Sequin Saree',
    originalPrice: 9500,
    discountedPrice: 7600,
    image: 'https://via.placeholder.com/400/FFD700/FFFFFF?text=Net+Saree',
    description: 'Glamorous net saree with all-over sequin embellishments, perfect for festive events.',
    rating: 4.7,
    isBestSeller: true,
    quantity: 1,
    category: "Women's Wear - Sarees",
    subCategory: 'Party Wear Sarees',
    brand: 'BharatSthali',
    fabric: 'Net',
    pattern: 'Embellished',
    occasion: 'Festive',
    border: 'Embellished Border',
    blousePiece: true,
    length: '5.5 meters',
  },
  {
    id: 7,
    name: 'Linen Printed Saree',
    originalPrice: 5000,
    discountedPrice: 4000,
    image: 'https://via.placeholder.com/400/DAA520/FFFFFF?text=Linen+Saree',
    description: 'Light and breathable linen saree with modern prints, suitable for summer.',
    rating: 4.4,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Sarees",
    subCategory: 'Casual Sarees',
    brand: 'Anavila',
    fabric: 'Linen',
    pattern: 'Printed',
    occasion: 'Casual',
    border: 'Plain',
    blousePiece: true,
    length: '5.5 meters',
  },
  {
    id: 8,
    name: 'Art Silk Jacquard Saree',
    originalPrice: 4500,
    discountedPrice: 3600,
    image: 'https://via.placeholder.com/400/D2691E/FFFFFF?text=Art+Silk+Saree',
    description: 'Affordable art silk saree with traditional jacquard weaving, great for festive wear.',
    rating: 4.3,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Sarees",
    subCategory: 'Festive Wear Sarees',
    brand: 'Satya Paul',
    fabric: 'Art Silk',
    pattern: 'Jacquard',
    occasion: 'Festive',
    border: 'Woven Border',
    blousePiece: true,
    length: '5.5 meters',
  },
];

const ProductCard = ({ item, onQuickView, addToCart, addToWishlist, cartItems, wishlistItems }) => {
  const { name, originalPrice, discountedPrice, image, description, brand, fabric, pattern, occasion, border, blousePiece, length } = item;

  const discountPercentage = discountedPrice === originalPrice
    ? 0
    : Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id && cartItem.category === item.category);
  const isInWishlist = wishlistItems.some((wishlistItem) => wishlistItem.id === item.id && wishlistItem.category === item.category);

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative flex-shrink-0 bg-white">
        <img
          src={image || 'https://via.placeholder.com/400'}
          alt={name}
          className="w-full h-[150px] object-cover sm:h-[200px]"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex space-x-2 group-hover:opacity-100 opacity-0 transition-opacity duration-200 sm:opacity-100">
          <button
            className={`p-2 rounded-full text-white transition-colors duration-200 ${isInWishlist ? 'bg-red-500' : 'bg-gray-700 hover:bg-red-600'}`}
            onClick={() => addToWishlist(item, 1)}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label={isInWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          >
            <FaHeart className="w-4 h-4" />
          </button>
          <button
            onClick={() => onQuickView(item)}
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Quick View"
            aria-label={`Quick view for ${name}`}
          >
            <FaEye className="w-4 h-4" />
          </button>
        </div>
        <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-semibold px-2 py-1">NEW</span>
        <span className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-semibold px-2 py-1">TRENDING</span>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">{name}</h3>
        <p className="text-xs text-gray-600 mb-1">Brand: {brand}</p>
        <p className="text-xs text-gray-600 mb-1">Fabric: {fabric}</p>
        <p className="text-xs text-gray-600 mb-1">Pattern: {pattern}</p>
        <p className="text-xs text-gray-600 mb-1">Occasion: {occasion}</p>
        <p className="text-xs text-gray-600 mb-1">Border: {border}</p>
        <p className="text-xs text-gray-600 mb-2">Blouse Piece: {blousePiece ? 'Yes' : 'No'}</p>
        <p className="text-xs text-gray-600 mb-2">Length: {length}</p>

        <div className="flex items-baseline space-x-2 mb-2 mt-auto">
          <p className="text-sm font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
          {discountPercentage > 0 && (
            <span className="text-xs text-green-600 font-semibold">{discountPercentage}% OFF</span>
          )}
        </div>

        <button
          className={`w-full text-white text-xs font-semibold py-2 rounded-md transition-colors duration-200 ${
            isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
          onClick={() => addToCart(item, 1)}
          disabled={isInCart}
          aria-label={isInCart ? `${name} already in cart` : `Add ${name} to cart`}
        >
          {isInCart ? 'ADDED TO CART' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
};

function Sarees() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);
  const [sortOption, setSortOption] = useState('default');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterState, setFilterState] = useState({
    discount: [],
    brands: [],
    priceRange: null,
    bestSeller: false,
    fabrics: [],
    categories: [],
    patterns: [],
    occasions: [],
    borders: [],
    blousePiece: null,
    allBrands: false,
  });
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('categories');

  const brands = [...new Set(sareeItems.map((item) => item.brand))];
  const allAvailableFabrics = [...new Set(sareeItems.map((item) => item.fabric))];
  const allAvailableCategories = [...new Set(sareeItems.map((item) => item.subCategory))];
  const allAvailablePatterns = [...new Set(sareeItems.map((item) => item.pattern))];
  const allAvailableOccasions = [...new Set(sareeItems.map((item) => item.occasion))];
  const allAvailableBorders = [...new Set(sareeItems.map((item) => item.border))];

  const priceRanges = [
    { label: 'All', min: null, max: null },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
    { label: '₹10000+', min: 10000, max: Infinity },
  ];
  const discountRanges = [
    { label: '10% and above', min: 10 },
    { label: '20% and above', min: 20 },
    { label: '30% and above', min: 30 },
  ];

  const filterCategories = [
    { id: 'categories', label: 'Categories' },
    { id: 'discount', label: 'Discount' },
    { id: 'brands', label: 'Brand' },
    { id: 'price', label: 'Price' },
    { id: 'fabrics', label: 'Fabric' },
    { id: 'patterns', label: 'Pattern' },
    { id: 'occasions', label: 'Occasion' },
    { id: 'borders', label: 'Border' },
    { id: 'blousePiece', label: 'Blouse Piece' },
    { id: 'offers', label: 'Offers' },
  ];

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      const storedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
      setCartItems(storedCart);
      setWishlistItems(storedWishlist);
    } catch (error) {
      console.error('Error parsing localStorage:', error);
      setCartItems([]);
      setWishlistItems([]);
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === product.id && item.category === product.category
    );

    if (existingItemIndex !== -1) {
      const updatedCart = currentCart.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      alert(`${quantity} of ${product.name} quantity updated in cart!`);
    } else {
      const updatedCart = [...currentCart, { ...product, quantity: parseInt(quantity) }];
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      alert(`${parseInt(quantity)} of ${product.name} added to cart!`);
    }
  };

  const addToWishlist = (product, quantity = 1) => {
    const currentWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    const isInWishlist = currentWishlist.some(
      (item) => item.id === product.id && item.category === product.category
    );

    if (isInWishlist) {
      const updatedWishlist = currentWishlist.filter(
        (item) => !(item.id === product.id && item.category === product.category)
      );
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      alert(`${product.name} removed from wishlist!`);
    } else {
      const updatedWishlist = [...currentWishlist, { ...product, quantity: parseInt(quantity) }];
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      alert(`${product.name} added to wishlist!`);
    }
  };

  const handleQuickView = (product) => {
    setQuickView(product);
    setQuickViewQuantity(1);
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
      if (['discount', 'brands', 'fabrics', 'categories', 'patterns', 'occasions', 'borders'].includes(key)) {
        const updatedArray = prev[key].includes(value)
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value];
        return {
          ...prev,
          [key]: updatedArray,
          ...(key === 'brands' && { allBrands: updatedArray.length === brands.length }),
        };
      }
      if (key === 'priceRange') {
        return { ...prev, priceRange: value };
      }
      if (key === 'blousePiece') {
        return { ...prev, blousePiece: value === prev.blousePiece ? null : value };
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const clearFilters = () => {
    setFilterState({
      discount: [],
      brands: [],
      priceRange: null,
      bestSeller: false,
      fabrics: [],
      categories: [],
      patterns: [],
      occasions: [],
      borders: [],
      blousePiece: null,
      allBrands: false,
    });
    setShowFilterPanel(false);
  };

  const applyFilters = () => {
    setShowFilterPanel(false);
  };

  const filteredAndSortedItems = useMemo(() => {
    return sareeItems
      .filter((item) => {
        const discountPercentage = item.discountedPrice === item.originalPrice
          ? 0
          : Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100);
        const matchesDiscount = filterState.discount.length
          ? filterState.discount.some((min) => discountPercentage >= min)
          : true;
        const matchesBrands = filterState.allBrands || !filterState.brands.length
          ? true
          : filterState.brands.includes(item.brand);
        const matchesPrice = filterState.priceRange && filterState.priceRange.min !== null
          ? item.discountedPrice >= filterState.priceRange.min && item.discountedPrice <= filterState.priceRange.max
          : true;
        const matchesBestSeller = filterState.bestSeller ? item.isBestSeller : true;
        const matchesFabric = filterState.fabrics.length
          ? filterState.fabrics.includes(item.fabric)
          : true;
        const matchesCategory = filterState.categories.length
          ? filterState.categories.includes(item.subCategory)
          : true;
        const matchesPattern = filterState.patterns.length
          ? filterState.patterns.includes(item.pattern)
          : true;
        const matchesOccasion = filterState.occasions.length
          ? filterState.occasions.includes(item.occasion)
          : true;
        const matchesBorder = filterState.borders.length
          ? filterState.borders.includes(item.border)
          : true;
        const matchesBlousePiece = filterState.blousePiece === null
          ? true
          : item.blousePiece === filterState.blousePiece;

        return matchesDiscount && matchesBrands && matchesPrice && matchesBestSeller && matchesFabric && matchesCategory && matchesPattern && matchesOccasion && matchesBorder && matchesBlousePiece;
      })
      .sort((a, b) => {
        if (sortOption === 'price-low') return a.discountedPrice - b.discountedPrice;
        if (sortOption === 'price-high') return b.discountedPrice - a.discountedPrice;
        if (sortOption === 'best-seller') return b.isBestSeller - a.isBestSeller;
        return 0;
      });
  }, [filterState, sortOption]);

  const renderFilterContent = () => {
    switch (selectedFilterCategory) {
      case 'categories':
        return (
          <div className="space-y-2">
            {allAvailableCategories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={filterState.categories.includes(category)}
                  onChange={() => handleFilterChange('categories', category)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${category}`}
                />
                <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-600">
                  {category}
                </label>
              </div>
            ))}
          </div>
        );
      case 'discount':
        return (
          <div className="space-y-2">
            {discountRanges.map(({ label, min }) => (
              <div key={min} className="flex items-center">
                <input
                  type="checkbox"
                  id={`discount-${min}`}
                  checked={filterState.discount.includes(min)}
                  onChange={() => handleFilterChange('discount', min)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${label}`}
                />
                <label htmlFor={`discount-${min}`} className="ml-2 text-sm text-gray-600">
                  {label}
                </label>
              </div>
            ))}
          </div>
        );
      case 'brands':
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="brand-all"
                checked={filterState.allBrands}
                onChange={() => handleFilterChange('allBrands')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                aria-label="Select all brands"
              />
              <label htmlFor="brand-all" className="ml-2 text-sm text-gray-600">
                All
              </label>
            </div>
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={filterState.brands.includes(brand)}
                  onChange={() => handleFilterChange('brands', brand)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${brand}`}
                />
                <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-600">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        );
      case 'price':
        return (
          <select
            id="price-range"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const selected = priceRanges.find((range) => range.label === e.target.value);
              handleFilterChange('priceRange', selected.min !== null ? selected : null);
            }}
            value={filterState.priceRange ? filterState.priceRange.label : 'All'}
            aria-label="Select price range"
          >
            {priceRanges.map((range) => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        );
      case 'fabrics':
        return (
          <div className="space-y-2">
            {allAvailableFabrics.map((fabric) => (
              <div key={fabric} className="flex items-center">
                <input
                  type="checkbox"
                  id={`fabric-${fabric}`}
                  checked={filterState.fabrics.includes(fabric)}
                  onChange={() => handleFilterChange('fabrics', fabric)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${fabric}`}
                />
                <label htmlFor={`fabric-${fabric}`} className="ml-2 text-sm text-gray-600">
                  {fabric}
                </label>
              </div>
            ))}
          </div>
        );
      case 'patterns':
        return (
          <div className="space-y-2">
            {allAvailablePatterns.map((pattern) => (
              <div key={pattern} className="flex items-center">
                <input
                  type="checkbox"
                  id={`pattern-${pattern}`}
                  checked={filterState.patterns.includes(pattern)}
                  onChange={() => handleFilterChange('patterns', pattern)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${pattern}`}
                />
                <label htmlFor={`pattern-${pattern}`} className="ml-2 text-sm text-gray-600">
                  {pattern}
                </label>
              </div>
            ))}
          </div>
        );
      case 'occasions':
        return (
          <div className="space-y-2">
            {allAvailableOccasions.map((occasion) => (
              <div key={occasion} className="flex items-center">
                <input
                  type="checkbox"
                  id={`occasion-${occasion}`}
                  checked={filterState.occasions.includes(occasion)}
                  onChange={() => handleFilterChange('occasions', occasion)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${occasion}`}
                />
                <label htmlFor={`occasion-${occasion}`} className="ml-2 text-sm text-gray-600">
                  {occasion}
                </label>
              </div>
            ))}
          </div>
        );
      case 'borders':
        return (
          <div className="space-y-2">
            {allAvailableBorders.map((border) => (
              <div key={border} className="flex items-center">
                <input
                  type="checkbox"
                  id={`border-${border}`}
                  checked={filterState.borders.includes(border)}
                  onChange={() => handleFilterChange('borders', border)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${border}`}
                />
                <label htmlFor={`border-${border}`} className="ml-2 text-sm text-gray-600">
                  {border}
                </label>
              </div>
            ))}
          </div>
        );
      case 'blousePiece':
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="blouse-yes"
                checked={filterState.blousePiece === true}
                onChange={() => handleFilterChange('blousePiece', true)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                aria-label="Filter by blouse piece available"
              />
              <label htmlFor="blouse-yes" className="ml-2 text-sm text-gray-600">
                Available
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="blouse-no"
                checked={filterState.blousePiece === false}
                onChange={() => handleFilterChange('blousePiece', false)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                aria-label="Filter by blouse piece not available"
              />
              <label htmlFor="blouse-no" className="ml-2 text-sm text-gray-600">
                Not Available
              </label>
            </div>
          </div>
        );
      case 'offers':
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="best-seller"
                checked={filterState.bestSeller}
                onChange={() => handleFilterChange('bestSeller', null)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                aria-label="Filter by best seller"
              />
              <label htmlFor="best-seller" className="ml-2 text-sm text-gray-600">
                Best Seller
              </label>
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-gray-600">Select a filter category</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <ClothesHeader />

      <div className="flex-grow pt-16">
        <div className="max-w-screen-xl mx-auto px-4 py-4 pb-12">
          {/* Breadcrumbs and Item Count */}
          <div className="text-xs text-gray-600 mb-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>{' '}
            /{' '}
            <Link to="/categories" className="hover:underline">
              Categories
            </Link>{' '}
            /{' '}
            <Link to="/categories/womens-wear" className="hover:underline">
              Women's Wear
            </Link>{' '}
            / <span className="font-semibold">Sarees</span> - {filteredAndSortedItems.length} Items
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:flex-nowrap sm:justify-between sm:items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800 sm:text-sm">Sarees ({filteredAndSortedItems.length})</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-sm text-sm font-medium w-full sm:w-auto hover:bg-gray-50"
                onClick={() => setShowFilterPanel(true)}
                aria-label="Open filter panel"
              >
                <FaFilter className="text-gray-600 w-4 h-4" />
                <span>Filter</span>
              </button>
              <div className="relative w-full sm:w-auto">
                <select
                  id="sort-options"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-sm pl-4 pr-10 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
                  aria-label="Sort products"
                >
                  <option value="default">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="best-seller">Best Seller</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilterPanel && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
                <motion.aside
                  className="bg-white w-full max-w-[600px] h-full flex flex-col"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors"
                        onClick={clearFilters}
                        aria-label="Clear all filters"
                      >
                        Clear All
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
                        onClick={applyFilters}
                        aria-label="Apply filters"
                      >
                        Apply Filters
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => setShowFilterPanel(false)}
                        aria-label="Close filter panel"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Filter Content */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar: Filter Categories */}
                    <div className="w-[200px] bg-gray-50 border-r border-gray-200 overflow-y-auto">
                      {filterCategories.map((category) => (
                        <button
                          key={category.id}
                          className={`w-full text-left px-4 py-3 text-sm font-semibold ${
                            selectedFilterCategory === category.id
                              ? 'bg-blue-100 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-100'
                          } transition-colors duration-200`}
                          onClick={() => setSelectedFilterCategory(category.id)}
                          aria-label={`Select ${category.label} filter`}
                          aria-selected={selectedFilterCategory === category.id}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>

                    {/* Right Content: Filter Details */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        {filterCategories.find((cat) => cat.id === selectedFilterCategory)?.label}
                      </h3>
                      <motion.div
                        key={selectedFilterCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {renderFilterContent()}
                      </motion.div>
                    </div>
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <main className="flex-grow">
            <div className="grid grid-cols-2 gap-2 md:gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filteredAndSortedItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onQuickView={handleQuickView}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                  cartItems={cartItems}
                  wishlistItems={wishlistItems}
                />
              ))}
            </div>

            {filteredAndSortedItems.length === 0 && (
              <p className="text-center text-gray-600 mt-8 text-sm">No products found.</p>
            )}
          </main>
        </div>
      </div>

      {quickView && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-3 w-full max-w-[300px] relative z-50"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 0, opacity: 0 }}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setQuickView(null)}
              aria-label="Close quick view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-base font-semibold text-gray-800 mb-2">{quickView.name}</h3>
            <img
              src={quickView.image || 'https://via.placeholder.com/400'}
              alt={quickView.name}
              className="w-full h-36 object-cover mb-2 rounded"
              loading="lazy"
            />
            <p className="text-xs text-gray-700 mb-1">{quickView.description}</p>
            <p className="text-xs text-gray-500 mb-1">Brand: {quickView.brand}</p>
            <p className="text-xs text-gray-500 mb-1">Fabric: {quickView.fabric}</p>
            <p className="text-xs text-gray-500 mb-1">Pattern: {quickView.pattern}</p>
            <p className="text-xs text-gray-500 mb-1">Occasion: {quickView.occasion}</p>
            <p className="text-xs text-gray-500 mb-1">Border: {quickView.border}</p>
            <p className="text-xs text-gray-500 mb-1">Blouse Piece: {quickView.blousePiece ? 'Yes' : 'No'}</p>
            <p className="text-xs text-gray-500 mb-2">Length: {quickView.length}</p>

            <div className="flex items-center space-x-2 mb-2">
              <p className="text-sm font-semibold text-gray-800">₹{quickView.discountedPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500 line-through">₹{quickView.originalPrice.toFixed(2)}</p>
              {quickView.discountedPrice !== quickView.originalPrice && (
                <p className="text-xs text-green-600 font-semibold">
                  {Math.round(((quickView.originalPrice - quickView.discountedPrice) / quickView.originalPrice) * 100)}% OFF
                </p>
              )}
            </div>
            <div className="flex items-center mb-3">
              <p className="text-xs font-semibold text-gray-700 mr-2">Qty:</p>
              <input
                type="number"
                id="quick-view-quantity"
                min="1"
                value={quickViewQuantity}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) setQuickViewQuantity(value);
                }}
                className="w-16 px-2 py-1 border border-gray-200 rounded text-xs"
                aria-label="Select quantity"
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white rounded-md py-1 text-xs hover:bg-blue-700 transition-colors"
              onClick={() => {
                addToCart(quickView, quickViewQuantity);
                setQuickView(null);
              }}
              aria-label={`Add ${quickView?.name || 'product'} to cart`}
            >
              Add to Cart
            </button>
          </motion.div>
        </motion.div>
      )}
      <Footer />
    </div>
  );
}

export default Sarees;