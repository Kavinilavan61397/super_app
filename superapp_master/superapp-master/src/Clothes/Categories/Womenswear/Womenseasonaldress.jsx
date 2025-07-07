import React, { useState, useEffect, useMemo } from 'react';
import Footer from '../../../Utility/Footer';
import ClothesHeader from '../../Header/ClothesHeader';
import { FaFilter, FaHeart, FaEye, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Women's Seasonal Dresses product data with dress-specific attributes
const womensSeasonalDressItems = [
  {
    id: 1,
    name: 'Floral Summer Maxi Dress',
    originalPrice: 3500,
    discountedPrice: 2800,
    image: 'https://via.placeholder.com/400/FF6347/FFFFFF?text=Floral+Maxi+Dress',
    description: 'Lightweight floral maxi dress perfect for summer days and beach outings.',
    rating: 4.8,
    isBestSeller: true,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Summer Wear',
    sizes: ['S', 'M', 'L', 'XL'],
    brand: 'Summer Breeze',
    season: 'Summer',
    dressStyle: 'Maxi',
    sleeveType: 'Sleeveless',
    neckline: 'V-neck',
    material: 'Rayon',
    occasion: 'Casual, Beach',
  },
  {
    id: 2,
    name: 'Elegant Winter Wool Midi Dress',
    originalPrice: 5500,
    discountedPrice: 4400,
    image: 'https://via.placeholder.com/400/4682B4/FFFFFF?text=Winter+Midi+Dress',
    description: 'Warm and elegant wool blend midi dress, ideal for cold weather and office wear.',
    rating: 4.7,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Winter Wear',
    sizes: ['S', 'M', 'L'],
    brand: 'Cozy Chic',
    season: 'Winter',
    dressStyle: 'Midi',
    sleeveType: 'Long Sleeve',
    neckline: 'Round Neck',
    material: 'Wool Blend',
    occasion: 'Formal, Office',
  },
  {
    id: 3,
    name: 'Spring A-line Mini Dress',
    originalPrice: 2800,
    discountedPrice: 2240,
    image: 'https://via.placeholder.com/400/8B0000/FFFFFF?text=Spring+Mini+Dress',
    description: 'Fresh and playful A-line mini dress for spring gatherings.',
    rating: 4.5,
    isBestSeller: true,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Spring Wear',
    sizes: ['XS', 'S', 'M'],
    brand: 'Blooming Styles',
    season: 'Spring',
    dressStyle: 'Mini',
    sleeveType: 'Short Sleeve',
    neckline: 'Boat Neck',
    material: 'Cotton',
    occasion: 'Casual, Party',
  },
  {
    id: 4,
    name: 'Autumn Bodycon Knit Dress',
    originalPrice: 4200,
    discountedPrice: 3360,
    image: 'https://via.placeholder.com/400/32CD32/FFFFFF?text=Autumn+Knit+Dress',
    description: 'Form-fitting knit dress perfect for autumnal evenings.',
    rating: 4.6,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Autumn Wear',
    sizes: ['S', 'M', 'L'],
    brand: 'Fall Fashion',
    season: 'Autumn',
    dressStyle: 'Bodycon',
    sleeveType: '3/4 Sleeve',
    neckline: 'Scoop Neck',
    material: 'Knitted Polyester',
    occasion: 'Party, Casual',
  },
  {
    id: 5,
    name: 'Bohemian Summer Maxi Dress',
    originalPrice: 3800,
    discountedPrice: 3040,
    image: 'https://via.placeholder.com/400/808080/FFFFFF?text=Boho+Maxi+Dress',
    description: 'Flowy bohemian maxi dress for a relaxed summer vibe.',
    rating: 4.7,
    isBestSeller: true,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Summer Wear',
    sizes: ['M', 'L', 'XL'],
    brand: 'Free Spirit',
    season: 'Summer',
    dressStyle: 'Maxi',
    sleeveType: 'Short Sleeve',
    neckline: 'Sweetheart',
    material: 'Viscose',
    occasion: 'Casual, Beach',
  },
  {
    id: 6,
    name: 'Formal Winter Evening Gown',
    originalPrice: 8000,
    discountedPrice: 6400,
    image: 'https://via.placeholder.com/400/FFA500/000000?text=Evening+Gown',
    description: 'Elegant long gown for formal winter events and parties.',
    rating: 4.9,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Winter Wear',
    sizes: ['S', 'M'],
    brand: 'Glamour Nights',
    season: 'Winter',
    dressStyle: 'Gown',
    sleeveType: 'Long Sleeve',
    neckline: 'V-neck',
    material: 'Velvet',
    occasion: 'Formal, Party',
  },
  {
    id: 7,
    name: 'Casual Spring Shirtdress',
    originalPrice: 3000,
    discountedPrice: 2400,
    image: 'https://via.placeholder.com/400/EE82EE/FFFFFF?text=Shirtdress',
    description: 'Versatile cotton shirtdress for a comfortable spring look.',
    rating: 4.4,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Spring Wear',
    sizes: ['S', 'M', 'L'],
    brand: 'Everyday Comfort',
    season: 'Spring',
    dressStyle: 'Shirt Dress',
    sleeveType: '3/4 Sleeve',
    neckline: 'Collar',
    material: 'Linen Blend',
    occasion: 'Casual, Office',
  },
  {
    id: 8,
    name: 'Autumn Plaid Midi Dress',
    originalPrice: 4000,
    discountedPrice: 3200,
    image: 'https://via.placeholder.com/400/DDA0DD/FFFFFF?text=Plaid+Midi+Dress',
    description: 'Stylish plaid midi dress, perfect for fall fashion.',
    rating: 4.6,
    isBestSeller: true,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Autumn Wear',
    sizes: ['S', 'M', 'L'],
    brand: 'Rustic Charm',
    season: 'Autumn',
    dressStyle: 'Midi',
    sleeveType: 'Long Sleeve',
    neckline: 'Crew Neck',
    material: 'Flannel',
    occasion: 'Casual, Office',
  },
  {
    id: 9,
    name: 'Summer Mini Sundress',
    originalPrice: 2000,
    discountedPrice: 1600,
    image: 'https://via.placeholder.com/400/8FBC8F/FFFFFF?text=Sundress',
    description: 'Cute and light mini sundress for hot summer days.',
    rating: 4.3,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Summer Wear',
    sizes: ['XS', 'S', 'M'],
    brand: 'Sunny Days',
    season: 'Summer',
    dressStyle: 'Mini',
    sleeveType: 'Spaghetti Strap',
    neckline: 'Square Neck',
    material: 'Cotton',
    occasion: 'Casual, Beach',
  },
  {
    id: 10,
    name: 'Winter Sweater Dress',
    originalPrice: 4800,
    discountedPrice: 3840,
    image: 'https://via.placeholder.com/400/ADD8E6/FFFFFF?text=Sweater+Dress',
    description: 'Cozy sweater dress for comfortable and stylish winter wear.',
    rating: 4.7,
    isBestSeller: true,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Winter Wear',
    sizes: ['S', 'M', 'L', 'XL'],
    brand: 'Warmth & Style',
    season: 'Winter',
    dressStyle: 'Sweater Dress',
    sleeveType: 'Long Sleeve',
    neckline: 'Turtle Neck',
    material: 'Knit',
    occasion: 'Casual, Office',
  },
  {
    id: 11,
    name: 'Spring Floral Wrap Dress',
    originalPrice: 3200,
    discountedPrice: 2560,
    image: 'https://via.placeholder.com/400/90EE90/FFFFFF?text=Wrap+Dress',
    description: 'Charming floral wrap dress perfect for spring events.',
    rating: 4.5,
    isBestSeller: false,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Spring Wear',
    sizes: ['XS', 'S', 'M'],
    brand: 'Garden Party',
    season: 'Spring',
    dressStyle: 'Wrap Dress',
    sleeveType: 'Short Sleeve',
    neckline: 'V-neck',
    material: 'Chiffon',
    occasion: 'Casual, Party',
  },
  {
    id: 12,
    name: 'Autumn Velvet Bodycon Dress',
    originalPrice: 5000,
    discountedPrice: 4000,
    image: 'https://via.placeholder.com/400/BDB76B/FFFFFF?text=Velvet+Dress',
    description: 'Luxurious velvet bodycon dress for evening parties in autumn.',
    rating: 4.8,
    isBestSeller: true,
    quantity: 1,
    category: "Women's Wear - Dresses",
    subCategory: 'Autumn Wear',
    sizes: ['S', 'M'],
    brand: 'Evening Elegance',
    season: 'Autumn',
    dressStyle: 'Bodycon',
    sleeveType: 'Long Sleeve',
    neckline: 'Cowl Neck',
    material: 'Velvet',
    occasion: 'Party, Formal',
  },
];

// ProductCard component
const ProductCard = ({ item, onQuickView, addToCart, addToWishlist, cartItems, wishlistItems }) => {
  const { name, originalPrice, discountedPrice, image, brand, sizes, season, dressStyle, sleeveType, neckline, material, occasion } = item;
  const [selectedSize, setSelectedSize] = useState(sizes && sizes.length > 0 ? sizes[0] : null);

  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id && cartItem.category === item.category && cartItem.size === selectedSize);
  const isInWishlist = wishlistItems.some((wishlistItem) => wishlistItem.id === item.id && wishlistItem.category === item.category && wishlistItem.size === selectedSize);

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative flex-shrink-0 bg-white">
        <img
          src={image || 'https://via.placeholder.com/400'}
          alt={name}
          className="w-full h-[150px] object-cover sm:h-[200px]"
          loading="lazy"
        />
<div className="absolute top-2 right-2 flex space-x-2 sm:opacity-100">
          <button
            className={`p-2 rounded-full text-white transition-colors duration-200 ${isInWishlist ? 'bg-red-500' : 'bg-gray-700 hover:bg-red-600'}`}
            onClick={() => addToWishlist(item, 1, selectedSize)}
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
        <p className="text-xs text-gray-600 mb-1">Season: {season}</p>
        <p className="text-xs text-gray-600 mb-1">Style: {dressStyle}</p>
        <p className="text-xs text-gray-600 mb-1">Sleeve: {sleeveType}</p>
        <p className="text-xs text-gray-600 mb-1">Neckline: {neckline}</p>
        <p className="text-xs text-gray-600 mb-2">Material: {material}</p>
        <p className="text-xs text-gray-600 mb-2">Occasion: {occasion}</p>

        <div className="flex items-baseline space-x-2 mb-2 mt-auto">
          <p className="text-sm font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
          <span className="text-xs text-green-600 font-semibold">{discountPercentage}% OFF</span>
        </div>

        {sizes && sizes.length > 0 && (
          <div className="flex items-center space-x-1 mb-3">
            <span className="text-xs text-gray-700 font-medium">Size:</span>
            <select
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              aria-label={`Select size for ${name}`}
            >
              {sizes.map((sizeOpt) => (
                <option key={sizeOpt} value={sizeOpt}>
                  {sizeOpt}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className={`w-full text-white text-xs font-semibold py-2 rounded-md transition-colors duration-200 ${
            isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
          onClick={() => addToCart(item, 1, selectedSize)}
          disabled={isInCart}
          aria-label={isInCart ? `${name} already in cart` : `Add ${name} to cart`}
        >
          {isInCart ? 'ADDED TO CART' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
};

function WomenSeasonalDress() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);
  const [quickViewSize, setQuickViewSize] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterState, setFilterState] = useState({
    discount: [],
    brands: [],
    priceRange: null,
    bestSeller: false,
    sizes: [],
    seasons: [],
    dressStyles: [],
    sleeveTypes: [],
    necklines: [],
    materials: [],
    occasions: [],
    allBrands: false,
  });
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('seasons');

  const allAvailableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const brands = [...new Set(womensSeasonalDressItems.map((item) => item.brand))];
  const allAvailableSeasons = [...new Set(womensSeasonalDressItems.map((item) => item.season))];
  const allAvailableDressStyles = [...new Set(womensSeasonalDressItems.map((item) => item.dressStyle))];
  const allAvailableSleeveTypes = [...new Set(womensSeasonalDressItems.map((item) => item.sleeveType))];
  const allAvailableNecklines = [...new Set(womensSeasonalDressItems.map((item) => item.neckline))];
  const allAvailableMaterials = [...new Set(womensSeasonalDressItems.map((item) => item.material))];
  const allAvailableOccasions = [...new Set(womensSeasonalDressItems.map((item) => item.occasion))];

  const priceRanges = [
    { label: 'All', min: null, max: null },
    { label: '₹1000 - ₹3000', min: 1000, max: 3000 },
    { label: '₹3000 - ₹5000', min: 3000, max: 5000 },
    { label: '₹5000+', min: 5000, max: Infinity },
  ];
  const discountRanges = [
    { label: '10% and above', min: 10 },
    { label: '20% and above', min: 20 },
    { label: '30% and above', min: 30 },
  ];

  const filterCategories = [
    { id: 'seasons', label: 'Seasons' },
    { id: 'discount', label: 'Discount' },
    { id: 'brands', label: 'Brand' },
    { id: 'price', label: 'Price' },
    { id: 'sizes', label: 'Size' },
    { id: 'dressStyles', label: 'Dress Style' },
    { id: 'sleeveTypes', label: 'Sleeve Type' },
    { id: 'necklines', label: 'Neckline' },
    { id: 'materials', label: 'Material' },
    { id: 'occasions', label: 'Occasion' },
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

  const addToCart = (product, quantity = 1, size) => {
    if (!size && product.sizes && product.sizes.length > 0) {
      alert('Please select a size.');
      return;
    }
    const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === product.id && item.category === product.category && item.size === size
    );

    if (existingItemIndex !== -1) {
      const updatedCart = currentCart.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      alert(`${quantity} of ${product.name} (Size: ${size}) quantity updated in cart!`);
    } else {
      const updatedCart = [...currentCart, { ...product, quantity: parseInt(quantity), size }];
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      alert(`${parseInt(quantity)} of ${product.name} (Size: ${size}) added to cart!`);
    }
  };

  const addToWishlist = (product, quantity = 1, size) => {
    if (!size && product.sizes && product.sizes.length > 0) {
      alert('Please select a size.');
      return;
    }
    const currentWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    const isInWishlist = currentWishlist.some(
      (item) => item.id === product.id && item.category === product.category && item.size === size
    );

    if (isInWishlist) {
      const updatedWishlist = currentWishlist.filter(
        (item) => !(item.id === product.id && item.category === product.category && item.size === size)
      );
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      alert(`${product.name} removed from wishlist!`);
    } else {
      const updatedWishlist = [...currentWishlist, { ...product, quantity: parseInt(quantity), size }];
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      alert(`${product.name} added to wishlist!`);
    }
  };

  const handleQuickView = (product) => {
    setQuickView(product);
    setQuickViewQuantity(1);
    setQuickViewSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
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
      if (['discount', 'brands', 'sizes', 'seasons', 'dressStyles', 'sleeveTypes', 'necklines', 'materials', 'occasions'].includes(key)) {
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
      return { ...prev, [key]: !prev[key] };
    });
  };

  const clearFilters = () => {
    setFilterState({
      discount: [],
      brands: [],
      priceRange: null,
      bestSeller: false,
      sizes: [],
      seasons: [],
      dressStyles: [],
      sleeveTypes: [],
      necklines: [],
      materials: [],
      occasions: [],
      allBrands: false,
    });
    setShowFilterPanel(false);
  };

  const applyFilters = () => {
    setShowFilterPanel(false);
  };

  const filteredAndSortedItems = useMemo(() => {
    return womensSeasonalDressItems
      .filter((item) => {
        const discountPercentage = Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100);
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
        const matchesSize = filterState.sizes.length
          ? item.sizes && filterState.sizes.some((size) => item.sizes.includes(size))
          : true;
        const matchesSeason = filterState.seasons.length
          ? filterState.seasons.includes(item.season)
          : true;
        const matchesDressStyle = filterState.dressStyles.length
          ? filterState.dressStyles.includes(item.dressStyle)
          : true;
        const matchesSleeveType = filterState.sleeveTypes.length
          ? filterState.sleeveTypes.includes(item.sleeveType)
          : true;
        const matchesNeckline = filterState.necklines.length
          ? filterState.necklines.includes(item.neckline)
          : true;
        const matchesMaterial = filterState.materials.length
          ? filterState.materials.includes(item.material)
          : true;
        const matchesOccasion = filterState.occasions.length
          ? filterState.occasions.includes(item.occasion)
          : true;

        return matchesDiscount && matchesBrands && matchesPrice && matchesBestSeller && matchesSize &&
               matchesSeason && matchesDressStyle && matchesSleeveType && matchesNeckline && matchesMaterial && matchesOccasion;
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
      case 'seasons':
        return (
          <div className="space-y-2">
            {allAvailableSeasons.map((season) => (
              <div key={season} className="flex items-center">
                <input
                  type="checkbox"
                  id={`season-${season}`}
                  checked={filterState.seasons.includes(season)}
                  onChange={() => handleFilterChange('seasons', season)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${season}`}
                />
                <label htmlFor={`season-${season}`} className="ml-2 text-sm text-gray-600">
                  {season}
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
      case 'sizes':
        return (
          <div className="space-y-2">
            {allAvailableSizes.map((size) => (
              <div key={size} className="flex items-center">
                <input
                  type="checkbox"
                  id={`size-${size}`}
                  checked={filterState.sizes.includes(size)}
                  onChange={() => handleFilterChange('sizes', size)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by size ${size}`}
                />
                <label htmlFor={`size-${size}`} className="ml-2 text-sm text-gray-600">
                  {size}
                </label>
              </div>
            ))}
          </div>
        );
      case 'dressStyles':
        return (
          <div className="space-y-2">
            {allAvailableDressStyles.map((style) => (
              <div key={style} className="flex items-center">
                <input
                  type="checkbox"
                  id={`dressStyle-${style}`}
                  checked={filterState.dressStyles.includes(style)}
                  onChange={() => handleFilterChange('dressStyles', style)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${style} dress style`}
                />
                <label htmlFor={`dressStyle-${style}`} className="ml-2 text-sm text-gray-600">
                  {style}
                </label>
              </div>
            ))}
          </div>
        );
      case 'sleeveTypes':
        return (
          <div className="space-y-2">
            {allAvailableSleeveTypes.map((sleeve) => (
              <div key={sleeve} className="flex items-center">
                <input
                  type="checkbox"
                  id={`sleeveType-${sleeve}`}
                  checked={filterState.sleeveTypes.includes(sleeve)}
                  onChange={() => handleFilterChange('sleeveTypes', sleeve)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${sleeve} sleeve type`}
                />
                <label htmlFor={`sleeveType-${sleeve}`} className="ml-2 text-sm text-gray-600">
                  {sleeve}
                </label>
              </div>
            ))}
          </div>
        );
      case 'necklines':
        return (
          <div className="space-y-2">
            {allAvailableNecklines.map((neckline) => (
              <div key={neckline} className="flex items-center">
                <input
                  type="checkbox"
                  id={`neckline-${neckline}`}
                  checked={filterState.necklines.includes(neckline)}
                  onChange={() => handleFilterChange('necklines', neckline)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${neckline} neckline`}
                />
                <label htmlFor={`neckline-${neckline}`} className="ml-2 text-sm text-gray-600">
                  {neckline}
                </label>
              </div>
            ))}
          </div>
        );
      case 'materials':
        return (
          <div className="space-y-2">
            {allAvailableMaterials.map((material) => (
              <div key={material} className="flex items-center">
                <input
                  type="checkbox"
                  id={`material-${material}`}
                  checked={filterState.materials.includes(material)}
                  onChange={() => handleFilterChange('materials', material)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  aria-label={`Filter by ${material} material`}
                />
                <label htmlFor={`material-${material}`} className="ml-2 text-sm text-gray-600">
                  {material}
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
                  aria-label={`Filter by ${occasion} occasion`}
                />
                <label htmlFor={`occasion-${occasion}`} className="ml-2 text-sm text-gray-600">
                  {occasion}
                </label>
              </div>
            ))}
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
            / <span className="font-semibold">Seasonal Dresses</span> - {filteredAndSortedItems.length} Items
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:flex-nowrap sm:justify-between sm:items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800 sm:text-sm">Seasonal Dresses ({filteredAndSortedItems.length})</h2>
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

      {/* Quick View Modal */}
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
            <p className="text-xs text-gray-500 mb-1">Season: {quickView.season}</p>
            <p className="text-xs text-gray-500 mb-1">Style: {quickView.dressStyle}</p>
            <p className="text-xs text-gray-500 mb-1">Sleeve: {quickView.sleeveType}</p>
            <p className="text-xs text-gray-500 mb-1">Neckline: {quickView.neckline}</p>
            <p className="text-xs text-gray-500 mb-2">Material: {quickView.material}</p>
            <p className="text-xs text-gray-500 mb-2">Occasion: {quickView.occasion}</p>

            <div className="flex items-center space-x-2 mb-2">
              <p className="text-sm font-semibold text-gray-800">₹{quickView.discountedPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500 line-through">₹{quickView.originalPrice.toFixed(2)}</p>
              <p className="text-xs text-green-600 font-semibold">
                {Math.round(((quickView.originalPrice - quickView.discountedPrice) / quickView.originalPrice) * 100)}% OFF
              </p>
            </div>
            {quickView.sizes && quickView.sizes.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">Size:</p>
                <select
                  id="quick-view-size"
                  className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  value={quickViewSize || ''}
                  onChange={(e) => setQuickViewSize(e.target.value)}
                  aria-label={`Select size for ${quickView.name || 'product'}`}
                >
                  {quickView.sizes.map((sizeOpt) => (
                    <option key={sizeOpt} value={sizeOpt}>
                      {sizeOpt}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
              type="button"
              className="w-full bg-blue-600 text-white rounded-md py-1 text-xs hover:bg-blue-700 transition-colors"
              onClick={() => {
                addToCart(quickView, quickViewQuantity, quickViewSize);
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

export default WomenSeasonalDress;