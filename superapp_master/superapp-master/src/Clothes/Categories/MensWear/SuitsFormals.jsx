import React, { useState, useEffect } from 'react';
import Footer from '../../../Utility/Footer';
import ClothesHeader from '../../Header/ClothesHeader';
import { FaFilter, FaHeart, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Import images
import Suit from '../../Images/NavyBlueBlazer.png';
import Blazer from '../../Images/NavyBlueBlazer.png';
import FormalShirt from '../../Images/WhiteFormalShirt.jpg';
import DressPants from '../../Images/NavyBlueBlazer.png';
import Waistcoat from '../../Images/NavyBlueBlazer.png';
import Tie from '../../Images/NavyBlueBlazer.png';
import Cufflinks from '../../Images/NavyBlueBlazer.png';
import PocketSquare from '../../Images/NavyBlueBlazer.png';
import FormalShoes from '../../Images/RunningShoes.png';
import Belt from '../../Images/NavyBlueBlazer.png';
import Watch from '../../Images/NavyBlueBlazer.png';
import Briefcase from '../../Images/NavyBlueBlazer.png';
import Perfume from '../../Images/NavyBlueBlazer.png';
import Sunglasses from '../../Images/NavyBlueBlazer.png';

// Fallback images mapping
const fallbackImages = {
  'Suit': Suit,
  'Blazer': Blazer,
  'Formal Shirt': FormalShirt,
  'Dress Pants': DressPants,
  'Waistcoat': Waistcoat,
  'Tie': Tie,
  'Cufflinks': Cufflinks,
  'Pocket Square': PocketSquare,
  'Formal Shoes': FormalShoes,
  'Belt': Belt,
  'Watch': Watch,
  'Briefcase': Briefcase,
  'Perfume': Perfume,
  'Sunglasses': Sunglasses,
  'default': Suit
};

const ProductCard = ({ name, originalPrice, discountedPrice, image, description, rating, isBestSeller, onQuickView, item, addToCart, addToWishlist, cartItems, wishlistItems }) => {
  const [selectedSize, setSelectedSize] = useState(item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'S');

  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id && cartItem.category === item.category && cartItem.size === selectedSize);
  const isInWishlist = wishlistItems.some((wishlistItem) => wishlistItem.id === item.id && wishlistItem.category === item.category && wishlistItem.size === selectedSize);

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-44 object-contain sm:h-56 md:h-64" />
        <div className="absolute top-4 right-4 flex space-x-2 opacity-100">
          <button
            className={`p-2 rounded-full text-white transition-colors duration-200 ${isInWishlist ? 'bg-red-500' : 'bg-gray-700 hover:bg-red-500'}`}
            onClick={() => addToWishlist(item, 1, selectedSize)}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FaHeart className="w-5 h-5" />
          </button>
          <button
            onClick={() => onQuickView(item)}
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-blue-500 transition-colors duration-200"
            title="Quick View"
          >
            <FaEye className="w-5 h-5" />
          </button>
        </div>
        {isBestSeller && (
          <span className="absolute top-4 left-4 bg-black text-white text-xs font-semibold px-2 py-1">
            BESTSELLER
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-1">{item.brand}</p>
        <p className="text-sm text-gray-600 mb-2">Suits & Formals</p>
        
        <div className="flex items-baseline space-x-2 mb-3 mt-auto">
          <p className="text-base font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</p>
          <p className="text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
        </div>
        
        {item.sizes && item.sizes.length > 0 && (
          <div className="flex items-center space-x-1 mb-3">
            <span className="text-xs text-gray-700 font-medium">Size:</span>
            <select
              className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {item.sizes.map((sizeOpt) => (
                <option key={sizeOpt} value={sizeOpt}>{sizeOpt}</option>
              ))}
            </select>
          </div>
        )}

        <button
          className={`w-full text-white text-sm font-semibold py-2 rounded-md transition-colors duration-200 ${
            isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
          onClick={() => addToCart(item, 1, selectedSize)}
          disabled={isInCart}
        >
          {isInCart ? 'ADDED TO CART' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
};

function SuitsFormals() {
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);
  const [quickViewSize, setQuickViewSize] = useState('S');
  const [filterCategorySearch, setFilterCategorySearch] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filterButtonRef = React.useRef(null);
  const filterPanelRef = React.useRef(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products/category/name/mens-suits-formals');
        
        // Transform the data to match the expected format
        const transformedProducts = response.data.data.map(product => ({
          id: product.id,
          name: product.name,
          originalPrice: parseFloat(product.price),
          discountedPrice: parseFloat(product.discounted_price || product.price),
          image: product.photo ? `http://localhost:5000/uploads/${product.photo}` : (fallbackImages[product.name] || fallbackImages.default),
          description: product.description || 'Product description',
          rating: product.rating || 4.0,
          isBestSeller: product.is_bestseller || false,
          quantity: 1,
          category: 'Men\'s Wear - Suits & Formals',
          sizes: product.sizes ? JSON.parse(product.sizes) : ['S', 'M', 'L', 'XL'],
          brand: product.brand?.name || 'Brand',
          material: product.material || 'Wool',
          topic: product.topic || 'Suits'
        }));
        
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        // Fallback to empty array
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const allAvailableSizes = Array.from(new Set(products.flatMap(item => item.sizes || [])));

  // Extract unique brands from items
  const allBrands = Array.from(new Set(products.flatMap(item => (item.brand || '').split(',').map(b => b.trim()))));
  // Extract unique materials from items
  const allMaterials = Array.from(new Set(products.map(item => item.material || 'Wool')));
  const allTopics = Array.from(new Set(products.map(item => item.topic || 'Suits')));

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const cartRes = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (cartRes.data && cartRes.data.data && cartRes.data.data.items) {
        setCartItems(cartRes.data.data.items.map(item => ({
          ...item.product,
          quantity: item.quantity,
          id: item.product_id,
          cartItemId: item.id
        })));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      setCartItems([]);
    }
  };

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data && res.data.data) {
        setWishlistItems(res.data.data.map(item => ({
          ...item.product,
          id: item.product_id,
          wishlistItemId: item.id
        })));
      } else {
        setWishlistItems([]);
      }
    } catch (e) {
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (!showFilters) return;
    function handleClickOutside(event) {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilters(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  const filteredAndSortedItems = products
    .filter(item => {
      // Always show items by default
      let showItem = true;

      // Apply search filter if search term exists
      if (filterCategorySearch !== '') {
        showItem = showItem && (
          item.name.toLowerCase().includes(filterCategorySearch.toLowerCase()) ||
          item.description.toLowerCase().includes(filterCategorySearch.toLowerCase())
        );
      }

      // Apply price range filter only if prices are set
      if (minPrice > 0 || maxPrice < 999999) {
        showItem = showItem && (
          (minPrice > 0 ? item.discountedPrice >= minPrice : true) &&
          (maxPrice < 999999 ? item.discountedPrice <= maxPrice : true)
        );
      }

      // Apply size filter only if sizes are selected
      if (selectedSizes.length > 0) {
        showItem = showItem && selectedSizes.some(size => item.sizes && item.sizes.includes(size));
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const itemBrands = (item.brand || '').split(',').map(b => b.trim());
        showItem = showItem && selectedBrands.some(brand => itemBrands.includes(brand));
      }

      // Material filter
      if (selectedMaterials.length > 0) {
        showItem = showItem && selectedMaterials.includes(item.material || 'Wool');
      }

      // Topic filter
      if (selectedTopics.length > 0) {
        showItem = showItem && selectedTopics.includes(item.topic || 'Suits');
      }

      return showItem;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-low-high':
          return a.discountedPrice - b.discountedPrice;
        case 'price-high-low':
          return b.discountedPrice - a.discountedPrice;
        case 'name-a-z':
          return a.name.localeCompare(b.name);
        case 'name-z-a':
          return b.name.localeCompare(a.name);
        case 'rating-high-low':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const addToCart = async (product, quantity = 1, size = 'S') => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first to add items to cart');
        return;
      }

      console.log('Adding to cart:', {
        product_id: product.id,
        quantity,
        variation_id: null,
        token: token ? 'Token exists' : 'No token'
      });

      const response = await axios.post(
        'http://localhost:5000/api/cart/items',
        {
          product_id: product.id,
          quantity,
          variation_id: null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Item added to cart:', response.data);
      
      // Update localStorage for frontend state management
      const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItemIndex = currentCart.findIndex((item) => item.id === product.id && item.category === product.category && item.size === size);

      if (existingItemIndex !== -1) {
        const updatedCart = currentCart.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
      } else {
        const updatedCart = [...currentCart, { ...product, quantity: parseInt(quantity), size: size }];
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
      }
      
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        alert('Please login first to add items to cart');
      } else if (error.response?.status === 404) {
        alert('Product not found');
      } else {
        alert('Failed to add to cart: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const addToWishlist = async (product, quantity = 1, size = 'S') => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    try {
      if (isInWishlist) {
        const item = wishlistItems.find(item => item.id === product.id);
        await axios.delete(`http://localhost:5000/api/wishlist/${item.wishlistItemId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/wishlist', {
          product_id: product.id
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await fetchWishlist();
    } catch (error) {
      alert('Failed to update wishlist');
      console.error('addToWishlist error', error);
    }
  };

  const handleQuickView = (product) => {
    setQuickView(product);
    setQuickViewQuantity(1);
    setQuickViewSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'S');
  };

  const handleSizeFilterChange = (size) => {
    setSelectedSizes(prevSizes =>
      prevSizes.includes(size)
        ? prevSizes.filter(s => s !== size)
        : [...prevSizes, size]
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <ClothesHeader />
      
      <div className="flex-grow pt-20">
        <div className="max-w-screen-xl mx-auto px-4 py-4 pb-32">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-600 mb-4">
            <Link to="/home-clothes" className="hover:underline">Home</Link> / <Link to="/home-clothes/categories" className="hover:underline">Categories</Link> / <Link to="/categories/mens-wear" className="hover:underline">Men's Wear</Link> / <span className="font-semibold">Suits & Formals</span> - {filteredAndSortedItems.length} Items
          </div>

          {/* Title Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Men's Suits & Formals Collection</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Elevate your formal wardrobe with our premium collection of suits and formal wear. 
              From classic business suits to elegant tuxedos, find the perfect ensemble for every occasion.
            </p>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex justify-end items-center mb-4 relative">
            <div className="flex items-center space-x-2">
                <button
                ref={filterButtonRef}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <FaFilter className="text-gray-600" />
                  <span className="text-sm text-gray-700">Filters</span>
                </button>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <option value="default">Sort By</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-a-z">Name: A-Z</option>
                    <option value="name-z-a">Name: Z-A</option>
                    <option value="rating-high-low">Rating: High to Low</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            {/* Dropdown Filter Panel */}
            {showFilters && (
              <div
                ref={filterPanelRef}
                className="absolute z-30 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 sm:p-6 max-h-[80vh] overflow-y-auto w-full max-w-xs left-1/2 -translate-x-1/2 sm:w-96 sm:max-w-none sm:left-auto sm:right-0 sm:translate-x-0"
                style={{ top: '100%' }}
              >
                <div className="flex justify-between items-center mb-2 sm:mb-4 pb-2 border-b border-gray-200">
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">FILTERS</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <FaChevronUp className="w-5 h-5" />
                    </button>
                  </div>
                <div className="mb-2 sm:mb-6">
                    <input
                      type="text"
                      placeholder="Search Suits & Formals"
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                      value={filterCategorySearch}
                      onChange={(e) => setFilterCategorySearch(e.target.value)}
                    />
                  </div>
                  {/* Price Range Filter */}
                <div className="mb-2 sm:mb-6">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-1 sm:mb-3">Price Range</h3>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                      className="w-1/2 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                        value={minPrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          setMinPrice(value);
                        if (value === '') {
                          setMaxPrice(10000);
                        }
                        }}
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                      className="w-1/2 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                        value={maxPrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          setMaxPrice(value);
                        if (value === '') {
                          setMinPrice(0);
                        }
                        }}
                        min="0"
                      />
                    </div>
                  </div>
                  {/* Size Filter */}
                <div className="mb-2 sm:mb-6">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-1 sm:mb-3">Size</h3>
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                      {allAvailableSizes.map((size) => (
                        <button
                          key={size}
                        className={`px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm ${
                            selectedSizes.includes(size)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                          }`}
                        onClick={() => handleSizeFilterChange(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                {/* Brand Filter */}
                <div className="mb-2 sm:mb-6">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-1 sm:mb-3">Brand</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {allBrands.map(brand => (
                      <button
                        key={brand}
                        className={`px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm ${
                          selectedBrands.includes(brand)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                        }`}
                        onClick={() => setSelectedBrands(selectedBrands.includes(brand)
                          ? selectedBrands.filter(b => b !== brand)
                          : [...selectedBrands, brand])}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Material Filter */}
                <div className="mb-2 sm:mb-6">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-1 sm:mb-3">Material</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {allMaterials.map(material => (
                      <button
                        key={material}
                        className={`px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm ${
                          selectedMaterials.includes(material)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                        }`}
                        onClick={() => setSelectedMaterials(selectedMaterials.includes(material)
                          ? selectedMaterials.filter(m => m !== material)
                          : [...selectedMaterials, material])}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Topic Filter */}
                <div className="mb-2 sm:mb-6">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-1 sm:mb-3">Topic</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {allTopics.map(topic => (
                      <button
                        key={topic}
                        className={`px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm ${
                          selectedTopics.includes(topic)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                        }`}
                        onClick={() => setSelectedTopics(selectedTopics.includes(topic)
                          ? selectedTopics.filter(t => t !== topic)
                          : [...selectedTopics, topic])}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Clear Filters Button */}
                <div className="mt-2 sm:mt-6">
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setFilterCategorySearch('');
                          setMinPrice(0);
                          setMaxPrice(10000);
                          setSelectedSizes([]);
                        setSelectedBrands([]);
                        setSelectedMaterials([]);
                        setSelectedTopics([]);
                          setShowFilters(false);
                          setSortOption('default');
                        }}
                      className="px-2 sm:px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-xs sm:text-sm font-medium"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {((filterCategorySearch && filterCategorySearch.length > 0) || 
            minPrice > 0 || 
            maxPrice < 999999 || 
            selectedSizes.length > 0 ||
            selectedBrands.length > 0 ||
            selectedMaterials.length > 0 ||
            selectedTopics.length > 0) && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex flex-wrap gap-2">
                {filterCategorySearch && filterCategorySearch.length > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Search: "{filterCategorySearch}"
                    <button
                      onClick={() => setFilterCategorySearch('')}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                )}
                {(minPrice > 0 || maxPrice > 0) && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Price Range: {minPrice > 0 ? `₹${minPrice}` : 'Min'} - {maxPrice > 0 ? `₹${maxPrice}` : 'Max'}
                    <button
                      onClick={() => {
                        setMinPrice(0);
                        setMaxPrice(10000);
                      }}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                )}
                {selectedSizes.length > 0 && selectedSizes.map((size) => (
                  <span key={size} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Size: {size}
                    <button
                      onClick={() => handleSizeFilterChange(size)}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {selectedBrands.length > 0 && selectedBrands.map(brand => (
                  <span key={brand} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Brand: {brand}
                    <button
                      onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {selectedMaterials.length > 0 && selectedMaterials.map(material => (
                  <span key={material} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Material: {material}
                    <button
                      onClick={() => setSelectedMaterials(selectedMaterials.filter(m => m !== material))}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {selectedTopics.length > 0 && selectedTopics.map(topic => (
                  <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Topic: {topic}
                    <button
                      onClick={() => setSelectedTopics(selectedTopics.filter(t => t !== topic))}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
              {filteredAndSortedItems.map((item) => (
                <ProductCard
                  key={item.id}
                  {...item}
                  onQuickView={handleQuickView}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                  cartItems={cartItems}
                  wishlistItems={wishlistItems}
                  item={item}
                />
              ))}
              {filteredAndSortedItems.length === 0 && (
                <p className="text-center text-gray-600 mt-8">No items found matching your criteria.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {quickView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 mb-6 pb-6">
          <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto max-h-[80vh] overflow-y-auto relative p-2 sm:p-6">
            <button
              onClick={() => setQuickView(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <img src={quickView.image} alt={quickView.name} className="w-full h-64 sm:h-48 md:h-[300px] object-contain rounded-lg mb-2 sm:mb-4" />
                  {quickView.isBestSeller && (
                    <span className="absolute top-4 left-4 bg-black text-white text-xs font-semibold px-2 py-1">
                      BESTSELLER
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{quickView.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{quickView.brand}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Suits & Formals</p>
                  <div className="flex items-baseline space-x-2 mb-2 sm:mb-4">
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">₹{quickView.discountedPrice.toFixed(2)}</p>
                    <p className="text-base sm:text-xl text-gray-500 line-through">₹{quickView.originalPrice.toFixed(2)}</p>
                  </div>
                  <p className="text-xs sm:text-base text-gray-600 mb-2 sm:mb-6">{quickView.description}</p>
                  {quickView.sizes && quickView.sizes.length > 0 && (
                    <div className="mb-2 sm:mb-6">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">Select Size</h3>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {quickView.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setQuickViewSize(size)}
                            className={`px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm ${quickViewSize === size ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-6">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => setQuickViewQuantity(Math.max(1, quickViewQuantity - 1))}
                        className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 text-xs sm:text-base"
                      >
                        -
                      </button>
                      <span className="px-2 sm:px-3 py-1 text-gray-900 text-xs sm:text-base">{quickViewQuantity}</span>
                      <button
                        onClick={() => setQuickViewQuantity(quickViewQuantity + 1)}
                        className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 text-xs sm:text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-2 sm:space-x-4">
                    <button
                      onClick={() => {
                        addToCart(quickView, quickViewQuantity, quickViewSize);
                        setQuickView(null);
                      }}
                      className="flex-1 bg-black text-white py-2 px-2 sm:px-4 rounded-md hover:bg-gray-800 transition-colors text-xs sm:text-base"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        addToWishlist(quickView, quickViewQuantity, quickViewSize);
                        setQuickView(null);
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-2 sm:px-4 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-base"
                    >
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default SuitsFormals; 