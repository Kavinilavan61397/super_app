import React, { useState, useEffect, useRef } from 'react';
import Footer from '../SubPages/Footer';
import Header from '../SubPages/Header';
import { FaFilter, FaSortAmountUp, FaSortAmountDown, FaHeart, FaEye, FaStar, FaSearch, FaChevronUp, FaChevronDown, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import banner1 from '../Images/banner1.png';
import banner2 from '../Images/baner2.png';
import banner3 from '../Images/banner3.png';
import banner4 from '../Images/banner4.png';
import banner5 from '../Images/banner5.png';
import catFruits from '../Images/cat_fruits.png';
import catMasala from '../Images/cat_masala.png';
import catInstant from '../Images/cat_instant.png';
import catDairy from '../Images/cat_dairy.png';

// -------------------------------------
// Image Imports for Grocery Categories
// -------------------------------------

// --- Fruits & Vegetables Images ---
import broccoliImage from '../Images/broccoli.jpg';
import carrotImage from '../Images/Carrot.jpg';
import spinachImage from '../Images/spinach.jpg';
import tomatoImage from '../Images/tomato.jpg';
import potatoImage from '../Images/potatoe.jpg';
import onionImage from '../Images/onion.jpg';
import cucumberImage from '../Images/cucumber.jpg';
import bellpepperImage from '../Images/bellpeper.jpg';
import appleImage from '../Images/apple.jpg';
import bananaImage from '../Images/Banana.jpg';
import orangeImage from '../Images/orange.jpg';
import mangoImage from '../Images/mango.jpg';


// --- Dairy & Bakery Images ---
import milkImage from '../Images/milk.webp';
import cheeseImage from '../Images/cheese.jpg';
import yogurtImage from '../Images/yogurt.webp';
import butterImage from '../Images/butter.webp';
import paneerImage from '../Images/paneer.webp';
import curdImage from '../Images/curd.jpeg';
import creamImage from '../Images/cream.webp';
import breadImage from '../Images/bread.png';
import eggImage from '../Images/egg.png';
import pastryImage from '../Images/pastry.png';
import cakeImage from '../Images/cake.png';
import muffinImage from '../Images/muffin.png';

// --- Snacks & Dry Fruits Images ---
import chipsImage from '../Images/potato_chips.png';
import cookiesImage from '../Images/cookies.png';
import namkeenImage from '../Images/namkeen.jpg';
import biscuitsImage from '../Images/biscuits.png';
import dryFruitsImage from '../Images/dry_fruits.webp';
import tortillaChipsImage from '../Images/tortilla_chips.png';
import chocolateCookiesImage from '../Images/chocolate_cookies.png';
import karaBoondyImage from '../Images/kara_boondy.png';
import creamBiscuitsImage from '../Images/cream_biscuits.png';
import digestiveBiscuitsImage from '../Images/digestive_biscuits.png';


// --- Breakfast & More Images ---
import oatmealImage from '../Images/oatmeal.png';
import cornflakesImage from '../Images/cornflakes.png';
import muesliImage from '../Images/muesli.png';
import granolaImage from '../Images/granola.png';
import cerealImage from '../Images/cereal.png';
import pancakesMixImage from '../Images/pancakes_mix.png';
import honeyImage from '../Images/honey.png';
import jamImage from '../Images/jam.png';
import wafflesImage from '../Images/waffles.png';
import mapleSyrupImage from '../Images/maple_syrup.png';
import coffeeBeansImage from '../Images/coffee_beans.png';
import teaBagsImage from '../Images/tea_bags.png';

// --- Eggs, Meat & Fish Images ---
import chickenBreastImage from '../Images/chicken_breast.png';
import muttonImage from '../Images/mutton.png';
import fishFilletImage from '../Images/fish_fillet.png';
import prawnsImage from '../Images/prawns.png';
import chickenCurryCutImage from '../Images/chicken_curry_cut.png';
import chickenMinceImage from '../Images/chicken_mince.png';
import fishSteakImage from '../Images/fish_steak.png';
import chickenWingsImage from '../Images/chicken_wings.png';  

// --- Masalas, Oils & Dry Fruits Images ---
import garamMasalaImage from '../Images/garam_masala.png';
import oliveOilImage from '../Images/olive_oil.png';
import turmericPowderImage from '../Images/turmeric_powder.png';
import coconutOilImage from '../Images/coconut_oil.png';
import almondImage from '../Images/almond.png';
import redChilliPowderImage from '../Images/red_chilli_powder.png';
import cashewImage from '../Images/cashew.png';
import cuminPowderImage from '../Images/cumin_powder.png';
import raisinsImage from '../Images/raisins.png';

// --- Atta, Rice, Dals & Sugar Images ---
import riceImage from '../Images/rice.png';
import basmatiRiceImage from '../Images/basmati_rice.png';
import toorDalImage from '../Images/toor_dal.png';
import sugarImage from '../Images/sugar.png';
import moongDalImage from '../Images/moong_dal.png';
import multigrainAttaImage from '../Images/multigrain_atta.png';
import jaggeryImage from '../Images/jaggery.png';
import saltImage from '../Images/salt.png';
import brownSugarImage from '../Images/brown_sugar.png';

// --- Hot & Cold Beverages Images ---
import greenTeaImage from '../Images/green_tea.png';
import coffeeImage from '../Images/coffee.png';
import juiceImage from '../Images/juice.png';
import energyDrinkImage from '../Images/energy_drink.png';
import blackTeaImage from '../Images/black_tea.png';
import lemonadeImage from '../Images/lemonade.png';
import cappuccinoImage from '../Images/cappuccino.png';
import smoothieImage from '../Images/smoothie.png';

// --- Instant & Frozen Foods Images ---
import noodlesImage from '../Images/noodles.png';
import readyMealsImage from '../Images/ready_meals.png';
import frozenSnacksImage from '../Images/frozen_snacks.png';
import pastaImage from '../Images/pasta.png';
import soupsImage from '../Images/soups.png';
import frozenParathasImage from '../Images/frozen_parathas.png';
import frozenMealsImage from '../Images/frozen_meals.png';

// --- Chocolates & Ice Creams Images ---
import vanillaIceCreamImage from '../Images/vanilla_ice_cream.png';
import trufflesImage from '../Images/truffles.png';
import strawberryIceCreamImage from '../Images/strawberry_ice_cream.png';
import chocolateIceCreamImage from '../Images/chocolate_ice_cream.png';
import assortedChocolatesImage from '../Images/assorted_chocolates.png';
import mintIceCreamImage from '../Images/mint_ice_cream.png';
import whiteChocolateImage from '../Images/white_chocolate.png';
import chocolateBarsImage from '../Images/chocolate_bars.png';
import darkChocolateImage from '../Images/dark_chocolate.png';

// Default placeholder image for items without specific images
const defaultImage = 'https://via.placeholder.com/300x200?text=Image+Coming+Soon';

const GroceryCard = ({ item, addToCart, addToWishlist, cartItems, wishlistItems }) => {
  const [quantity, setQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    } else {
      alert('Please upload a valid image file (max 5MB).');
    }
  };

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const discountPercentage = Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100);
  
  // Check if item is in cart
  const cartItem = cartItems.find(
    cartItem => cartItem.id === item.id && cartItem.category === item.category
  );
  const isInCart = !!cartItem;
  
  // Check if item is in wishlist
  const wishlistItem = wishlistItems.find(
    wishlistItem => wishlistItem.id === item.id && wishlistItem.category === item.category
  );
  const isInWishlist = !!wishlistItem;

  // Set initial quantity based on cart or wishlist
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else if (wishlistItem) {
      setQuantity(wishlistItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem, wishlistItem]);

  const openQuickView = () => setShowQuickViewModal(true);
  const closeQuickView = () => setShowQuickViewModal(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={item.image}
          alt={`${item.name} - ${item.description}`}
          className="w-full aspect-square object-cover"
          onError={(e) => {
            console.error('Failed to load image:', item.image);
            e.target.onerror = null;
            e.target.src = defaultImage;
            e.target.alt = `${item.name} - Image not available`;
          }}
          onLoad={(e) => {
            // Optional: You can add any onLoad handling here if needed
          }}
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            className={`p-1 rounded-full shadow-md ${
              isInWishlist 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => addToWishlist(item)}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FaHeart className="w-5 h-5" />
          </button>
          <button
            className="p-1 rounded-full shadow-md bg-white text-gray-500 hover:text-gray-700"
            onClick={openQuickView}
            title="Quick View"
          >
            <FaEye className="w-5 h-5" />
          </button>
        </div>
        
        {item.isBestSeller && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Best Seller
          </span>
        )}
      </div>
      
      <div className="p-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 w-3 h-3" />
              <span className="text-xs text-gray-600 ml-0.5">{item.rating}</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mb-1 line-clamp-1">{item.description}</p>
        
        <div className="flex items-center space-x-2 mb-1">
          <p className="text-base font-bold text-[#00BB1C]">
            ₹{typeof item.discountedPrice === 'number' ? item.discountedPrice.toFixed(2) : '0.00'}
          </p>
          {item.originalPrice > item.discountedPrice && (
            <p className="text-xs text-gray-400 line-through">
              ₹{typeof item.originalPrice === 'number' ? item.originalPrice.toFixed(2) : '0.00'}
            </p>
          )}
          {discountPercentage > 0 && (
            <span className="text-xs text-green-600">{discountPercentage}% off</span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            className={`text-white text-sm font-medium py-0.5 px-2 rounded-md whitespace-nowrap w-24 ${
              isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'
            }`}
            onClick={() => addToCart(item, quantity)}
            disabled={isInCart}
          >
            {isInCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-xs font-medium text-gray-700">Qty:</span>
            <select
              className="w-16 px-2 py-1 border rounded"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={isInCart}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickViewModal && (
        <QuickViewModal item={item} onClose={closeQuickView} addToCart={addToCart} cartItems={cartItems} />
      )}
    </motion.div>
  );
};

// Quick View Modal Component
const QuickViewModal = ({ item, onClose, addToCart, cartItems }) => {
  const [quantity, setQuantity] = useState(1);

  const isInCart = cartItems.some(cartItem => cartItem.id === item.id && cartItem.category === item.category);

  // Sync quantity with cart if item is already in cart
  useEffect(() => {
    const cartItem = cartItems.find(ci => ci.id === item.id && ci.category === item.category);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItems, item]);

  const handleAddToCart = () => {
    addToCart(item, quantity);
    // Optionally close modal or give feedback
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 pt-8 z-50 md:items-center md:pt-0">
      <div className="bg-white rounded-lg shadow-xl max-w-xs md:max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all sm:scale-100 sm:w-full sm:mx-auto">
        <div className="p-3 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Quick View</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2 flex-shrink-0">
              <img src={item.image || defaultImage} alt={`${item.name} - ${item.description}`} className="w-full h-auto rounded-md object-cover aspect-square" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
              <div className="flex items-center mb-1"> 
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">{item.rating}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2 text-justify">{item.description}</p>
              <div className="flex items-center space-x-2 mb-2"> 
                <p className="text-xl font-bold text-[#00BB1C]">₹{item.discountedPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-400 line-through">₹{item.originalPrice.toFixed(2)}</p>
                <span className="text-sm text-green-600">{Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% off</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-end">
                <button
                  className={`text-white font-medium py-1 px-3 rounded-md text-sm w-24 flex-shrink-0 ${isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'}`}
                  onClick={handleAddToCart}
                  disabled={isInCart}
                >
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <div className="flex items-center border rounded-full px-2 py-1 flex-shrink-0">
                  <span className="text-xs font-medium text-gray-700 mr-1">Qty:</span>
                  <select
                    className="bg-transparent outline-none text-xs w-full"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={isInCart}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Groceries() {
  const [randomizedItems, setRandomizedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterMinimized, setIsFilterMinimized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [minRating, setMinRating] = useState(0);
  const [showBestSellersOnly, setShowBestSellersOnly] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    minRating: 0,
    showBestSellersOnly: false
  });
  const [showAllCategories, setShowAllCategories] = useState(false);
  const filterBarRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch items from backend on mount
  useEffect(() => {
    const fetchGroceries = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await fetch('http://localhost:5000/api/groceries');
        if (!response.ok) throw new Error('Failed to fetch groceries');
        const data = await response.json();
        
        // Log raw data for debugging
        console.log('Raw data from API:', data);
        
        // Format backend fields to match frontend expectations
        const formattedData = data.map(item => {
          // Convert string prices to numbers
          const originalPrice = typeof item.original_price === 'string' 
            ? parseFloat(item.original_price) 
            : item.original_price;
            
          const discountedPrice = typeof item.discounted_price === 'string'
            ? parseFloat(item.discounted_price)
            : item.discounted_price;
            
          console.log(`Item: ${item.name}, Original: ${originalPrice}, Discounted: ${discountedPrice}`);
          
          return {
            ...item,
            discountedPrice: discountedPrice,
            originalPrice: originalPrice,
            isBestSeller: item.is_best_seller,
            image: item.image?.startsWith('http') 
              ? item.image 
              : item.image?.startsWith('/uploads/') 
                ? `http://localhost:5000${item.image}`
                : `http://localhost:5000/uploads/${item.image}`
          };
        });
        
        // Log formatted data for debugging
        console.log('Formatted data:', formattedData);
        
        // Shuffle items
        const shuffled = [...formattedData].sort(() => Math.random() - 0.5);
        setRandomizedItems(shuffled);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching groceries:', error);
        setFetchError(error.message);
        setLoading(false);
      }
    };
    fetchGroceries();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsRecording(false);
      }
    }
  };
  
  // Update tempFilters when filter panel is opened
  useEffect(() => {
    if (showFilters) {
      setTempFilters({
        priceRange: { ...priceRange },
        minRating,
        showBestSellersOnly
      });
    }
  }, [showFilters]);

  // Apply filters function
  const applyFilters = () => {
    setPriceRange(tempFilters.priceRange);
    setMinRating(tempFilters.minRating);
    setShowBestSellersOnly(tempFilters.showBestSellersOnly);
    // Close the filter panel after applying
    setShowFilters(false);
  };

  // Clear all filters function
  const clearAllFilters = () => {
    const defaultFilters = {
      priceRange: { min: 0, max: 1000 },
      minRating: 0,
      showBestSellersOnly: false
    };
    setTempFilters(defaultFilters);
    setPriceRange(defaultFilters.priceRange);
    setMinRating(defaultFilters.minRating);
    setShowBestSellersOnly(defaultFilters.showBestSellersOnly);
  };

  // Filter items based on all criteria
  const filteredItems = randomizedItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = item.discountedPrice >= priceRange.min && item.discountedPrice <= priceRange.max;
    const matchesRating = item.rating >= minRating;
    const matchesBestSeller = !showBestSellersOnly || item.isBestSeller;
    return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesBestSeller;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOption === 'price-low') return a.discountedPrice - b.discountedPrice;
    if (sortOption === 'price-high') return b.discountedPrice - a.discountedPrice;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('GcartItems')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('GwishlistItems')) || [];
    setCartItems(storedCart);
    setWishlistItems(storedWishlist);
  }, []);

  // Listen for storage changes from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cartItems') {
        setCartItems(JSON.parse(e.newValue) || []);
      } else if (e.key === 'wishlistItems') {
        setWishlistItems(JSON.parse(e.newValue) || []);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (item, quantity) => {
    const currentCart = JSON.parse(localStorage.getItem('GcartItems')) || [];
    const existingItemIndex = currentCart.findIndex(
      cartItem => cartItem.id === item.id && cartItem.category === item.category
    );

    let updatedCart;
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      updatedCart = currentCart.map((cartItem, index) => 
        index === existingItemIndex 
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );
    } else {
      // Add new item
      updatedCart = [...currentCart, { ...item, quantity }];
    }

    // Update localStorage and state
    localStorage.setItem('GcartItems', JSON.stringify(updatedCart));
    setCartItems(updatedCart);

    // Dispatch storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cartItems',
      newValue: JSON.stringify(updatedCart)
    }));

    // Show success message
    
  };

  const addToWishlist = (item) => {
    const currentWishlist = JSON.parse(localStorage.getItem('GwishlistItems')) || [];
    const currentCart = JSON.parse(localStorage.getItem('GcartItems')) || [];
    
    // Check if item is in cart
    const cartItem = currentCart.find(
      cartItem => cartItem.id === item.id && cartItem.category === item.category
    );
    
    const isInWishlist = currentWishlist.some(
      wishlistItem => wishlistItem.id === item.id && wishlistItem.category === item.category
    );

    let updatedWishlist;
    if (isInWishlist) {
      // Remove from wishlist
      updatedWishlist = currentWishlist.filter(
        wishlistItem => !(wishlistItem.id === item.id && wishlistItem.category === item.category)
      );
      
    } else {
      // Add to wishlist with cart quantity if it exists in cart
      const wishlistItem = {
        ...item,
        quantity: cartItem ? cartItem.quantity : 1,
        inCart: !!cartItem // Add flag to indicate if item is in cart
      };
      updatedWishlist = [...currentWishlist, wishlistItem];
     
    }

    // Update localStorage and state
    localStorage.setItem('GwishlistItems', JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);

    // Dispatch storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'wishlistItems',
      newValue: JSON.stringify(updatedWishlist)
    }));
  };

  // Banner carousel state
  const bannerImages = [banner1, banner2, banner3, banner4, banner5];
  const [currentBanner, setCurrentBanner] = useState(0);
  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 6000); // Increased from 3500ms to 6000ms
    return () => clearInterval(interval);
  }, [bannerImages.length]);
  // Manual navigation
  const goToBanner = (idx) => setCurrentBanner(idx);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % bannerImages.length);

  // Category data for 'Shop by category' section
  const categoryList = [
    { name: 'Fruits & Vegetables', image: catFruits, label: 'Fruits & Vegetables' },
    { name: 'Bakery, Cakes & Dairy', image: catDairy, label: 'Bakery, Cakes & Dairy' },
    { name: 'Breakfast & More', image: cerealImage, label: 'Breakfast & More' },
    { name: 'Eggs, Meat & Fish', image: eggImage, label: 'Eggs, Meat & Fish' },
    { name: 'Masalas, Oils & Dry Fruits', image: catMasala, label: 'Masalas, Oils & Dry Fruits' },
    { name: 'Atta, Rice, Dals & Sugar', image: riceImage, label: 'Atta, Rice, Dals & Sugar' },
    { name: 'Chips, Biscuits & Namkeen', image: chipsImage, label: 'Chips, Biscuits & Namkeen' },
    { name: 'Hot & Cold Beverages', image: coffeeImage, label: 'Hot & Cold Beverages' },
    { name: 'Instant & Frozen Foods', image: catInstant, label: 'Instant & Frozen Foods' },
    { name: 'Chocolates & Ice Creams', image: chocolateBarsImage, label: 'Chocolates & Ice Creams' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-32">
        {/* Shop by category section */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Shop by category</h2>
            <button
              className="text-[#00BB1C] font-semibold text-sm hover:underline focus:outline-none"
              onClick={() => setShowAllCategories((prev) => !prev)}
            >
              {showAllCategories ? 'Show less' : 'Show more'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {(showAllCategories ? categoryList : categoryList.slice(0, 3)).map((cat, idx) => (
              <button
                key={cat.name}
                className="flex flex-col items-center bg-white rounded-lg shadow p-1 hover:bg-gray-100 focus:outline-none transition"
                onClick={() => {
                  setSelectedCategory(cat.label);
                  setTimeout(() => {
                    filterBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                type="button"
              >
                <img src={cat.image} alt={cat.label} className="w-20 h-20 object-contain mb-1" />
                <span className="text-xs font-medium text-center text-gray-700">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Banner Carousel */}
        <div className="max-w-4xl mx-auto mb-6 relative">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -50) {
                nextBanner();
              } else if (info.offset.x > 50) {
                prevBanner();
              }
            }}
            className="w-full h-56 md:h-80 object-cover rounded-xl shadow-md transition-all duration-500 cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'pan-y' }}
          >
            <img
              src={bannerImages[currentBanner]}
              alt={`Banner ${currentBanner + 1}`}
              className="w-full h-56 md:h-80 object-cover rounded-xl"
              draggable="false"
            />
          </motion.div>
          {/* Left Arrow */}
          <button
            onClick={prevBanner}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md z-10"
            aria-label="Previous banner"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          {/* Right Arrow */}
          <button
            onClick={nextBanner}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md z-10"
            aria-label="Next banner"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {bannerImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToBanner(idx)}
                className={`w-2.5 h-2.5 rounded-full ${currentBanner === idx ? 'bg-[#00BB1C]' : 'bg-white border border-gray-300'} transition-all`}
                aria-label={`Go to banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Bar */}
          <div ref={filterBarRef} className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for fruits and vegetables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BB1C]"
                />
                <button
                  onClick={toggleRecording}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                    isRecording 
                      ? 'text-red-500 hover:text-red-600 animate-pulse' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Voice Search'}
                >
                  {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <FaFilter />
                  <span>Filters</span>
                </button>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BB1C]"
                >
                  <option value="">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setSelectedCategory('Fruits & Vegetables')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Fruits & Vegetables'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fruits & Vegetables
              </button>
              <button
                onClick={() => setSelectedCategory('Bakery, Cakes & Dairy')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Bakery, Cakes & Dairy'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bakery, Cakes & Dairy
              </button>
              <button
                onClick={() => setSelectedCategory('Breakfast & More')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Breakfast & More'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Breakfast & More
              </button>
              <button
                onClick={() => setSelectedCategory('Eggs, Meat & Fish')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Eggs, Meat & Fish'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Eggs, Meat & Fish
              </button>
              <button
                onClick={() => setSelectedCategory('Masalas, Oils & Dry Fruits')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Masalas, Oils & Dry Fruits'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Masalas, Oils & Dry Fruits
              </button>
              <button
                onClick={() => setSelectedCategory('Atta, Rice, Dals & Sugar')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Atta, Rice, Dals & Sugar'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Atta, Rice, Dals & Sugar
              </button>
              <button
                onClick={() => setSelectedCategory('Chips, Biscuits & Namkeen')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Chips, Biscuits & Namkeen'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chips, Biscuits & Namkeen
              </button>
              <button
                onClick={() => setSelectedCategory('Hot & Cold Beverages')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Hot & Cold Beverages'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hot & Cold Beverages
              </button>
              <button
                onClick={() => setSelectedCategory('Instant & Frozen Foods')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Instant & Frozen Foods'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Instant & Frozen Foods
              </button>
              <button
                onClick={() => setSelectedCategory('Chocolates & Ice Creams')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'Chocolates & Ice Creams'
                    ? 'bg-[#00BB1C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chocolates & Ice Creams
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 border rounded-lg bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsFilterMinimized(!isFilterMinimized)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      {isFilterMinimized ? <FaChevronDown /> : <FaChevronUp />}
                    </button>
                  </div>
                </div>

                {!isFilterMinimized && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Price Range Filter */}
                      <div>
                        <h3 className="font-medium mb-2">Price Range</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tempFilters.priceRange.min}
                              onChange={(e) => setTempFilters(prev => ({
                                ...prev,
                                priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                              }))}
                              className="w-24 px-2 py-1 border rounded"
                              placeholder="Min"
                              min="0"
                            />
                            <span>to</span>
                            <input
                              type="number"
                              value={tempFilters.priceRange.max}
                              onChange={(e) => setTempFilters(prev => ({
                                ...prev,
                                priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                              }))}
                              className="w-24 px-2 py-1 border rounded"
                              placeholder="Max"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Rating Filter */}
                      <div>
                        <h3 className="font-medium mb-2">Minimum Rating</h3>
                        <select
                          value={tempFilters.minRating}
                          onChange={(e) => setTempFilters(prev => ({
                            ...prev,
                            minRating: Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BB1C]"
                        >
                          <option value={0}>Any Rating</option>
                          <option value={4}>4★ & above</option>
                          <option value={3}>3★ & above</option>
                          <option value={2}>2★ & above</option>
                          <option value={1}>1★ & above</option>
                        </select>
                      </div>

                      {/* Best Sellers Filter */}
                      <div>
                        <h3 className="font-medium mb-2">Best Sellers</h3>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={tempFilters.showBestSellersOnly}
                            onChange={(e) => setTempFilters(prev => ({
                              ...prev,
                              showBestSellersOnly: e.target.checked
                            }))}
                            className="rounded text-[#00BB1C] focus:ring-[#00BB1C]"
                          />
                          <span>Show Best Sellers Only</span>
                        </label>
                      </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Clear All Filters
                      </button>
                      <button
                        onClick={applyFilters}
                        className="px-6 py-2 bg-[#00BB1C] text-white rounded-lg hover:bg-[#009B16] transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">Loading items...</div>
          ) : fetchError ? (
            <div className="text-center py-12 text-red-500">{fetchError}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
              {sortedItems.map((item) => (
                <GroceryCard
                  key={`${item.category}-${item.id}`}
                  item={item}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                  cartItems={cartItems}
                  wishlistItems={wishlistItems}
                />
              ))}
            </div>
          )}
          {sortedItems.length === 0 && !loading && !fetchError && (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Groceries; 