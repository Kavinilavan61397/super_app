import React, { useState, useEffect } from 'react'; // Added useEffect import
import Footer from '../../Utility/Footer';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import { FaFilter, FaSortAmountUp, FaSortAmountDown, FaHeart, FaEye, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import NavyBlueBlazer from '../Images/NavyBlueBlazer.png';
import BlackSuit from '../Images/BlackSuit.png';
import WhiteFormalShirt from '../Images/WhiteFormalShirt.jpg';
import DenimJeans from '../Images/DenimJeans.png';
import TShirt from '../Images/TShirt.png';
import CargoPants from '../Images/CargoPants.png';
import RunningShoes from '../Images/RunningShoes.png';
import TrackPants from '../Images/TrackPants.png';
import SportsTShirt from '../Images/SportsTShirt.png';
import LeatherBelt from '../Images/LeatherBelt.png';
import Sunglasses from '../Images/Sunglasses.png';
import Wallet from '../Images/Wallets.jpg';

const menWearCategories = [
  {
    name: 'Formal Wear',
    items: [
      { id: 1, name: 'Navy Blue Blazer', originalPrice: 5000, discountedPrice: 4000, image: NavyBlueBlazer, description: 'Classic navy blue blazer for formal occasions.', rating: 4.2, isBestSeller: true, quantity: 1, category: 'Men Uniforms - Formal Wear' },
      { id: 2, name: 'Black Suit', originalPrice: 7000, discountedPrice: 5600, image: BlackSuit, description: 'Complete black suit set for formal events.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Men Uniforms - Formal Wear' },
      { id: 3, name: 'White Formal Shirt', originalPrice: 2000, discountedPrice: 1600, image: WhiteFormalShirt, description: 'Crisp white formal shirt with slim fit.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Men Uniforms - Formal Wear' }
    ]
  },
  {
    name: 'Casual Wear',
    items: [
      { id: 4, name: 'Denim Jeans', originalPrice: 2500, discountedPrice: 2000, image: DenimJeans, description: 'Slim fit denim jeans.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Men Uniforms - Casual Wear' },
      { id: 5, name: 'T-Shirt', originalPrice: 1200, discountedPrice: 960, image: TShirt, description: 'Comfortable cotton t-shirt.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Men Uniforms - Casual Wear' },
      { id: 6, name: 'Cargo Pants', originalPrice: 1800, discountedPrice: 1440, image: CargoPants, description: 'Comfortable cargo pants with multiple pockets.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Men Uniforms - Casual Wear' }
    ]
  },
  {
    name: 'Sports Wear',
    items: [
      { id: 7, name: 'Running Shoes', originalPrice: 3500, discountedPrice: 2800, image: RunningShoes, description: 'Lightweight running shoes with good grip.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Men Uniforms - Sports Wear' },
      { id: 8, name: 'Track Pants', originalPrice: 1500, discountedPrice: 1200, image: TrackPants, description: 'Comfortable track pants for workouts.', rating: 4.4, isBestSeller: false, quantity: 1, category: 'Men Uniforms - Sports Wear' },
      { id: 9, name: 'Sports T-Shirt', originalPrice: 1000, discountedPrice: 800, image: SportsTShirt, description: 'Moisture-wicking sports t-shirt.', rating: 4.2, isBestSeller: true, quantity: 1, category: 'Men Uniforms - Sports Wear' }
    ]
  },
  {
    name: 'Accessories',
    items: [
      { id: 10, name: 'Leather Belt', originalPrice: 1500, discountedPrice: 1200, image: LeatherBelt, description: 'Stylish leather belt.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Men Uniforms - Accessories' },
      { id: 11, name: 'Sunglasses', originalPrice: 2000, discountedPrice: 1600, image: Sunglasses, description: 'Stylish sunglasses with UV protection.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Men Uniforms - Accessories' },
      { id: 12, name: 'Wallet', originalPrice: 1800, discountedPrice: 1440, image: Wallet, description: 'Premium leather wallet.', rating: 4.4, isBestSeller: false, quantity: 1, category: 'Men Uniforms - Accessories' }
    ]
  }
];

const UniformCard = ({ name, originalPrice, discountedPrice, image, description, rating, isBestSeller, onQuickView, item, addToCart, addToWishlist, cartItems, wishlistItems }) => {
  // Added item, addToCart, addToWishlist, cartItems, wishlistItems as props
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('S'); // Added state for selected size

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

  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  // Updated isInCart and isInWishlist to use category for uniqueness
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id && cartItem.category === item.category);
  const isInWishlist = wishlistItems.some((wishlistItem) => wishlistItem.id === item.id && wishlistItem.category === item.category);


  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2">
          <button
            className={`p-1 rounded-full shadow-md ${isInWishlist ? 'bg-purple-600 text-white' : 'bg-white text-gray-500 hover:text-gray-700'}`}
            onClick={() => addToWishlist(item)} // Connected to addToWishlist
          >
            <FaHeart className="w-5 h-5" /> {/* Using FaHeart for consistency with other categories */}
          </button>
        </div>
        
        {isBestSeller && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Best Seller
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaStar className="text-yellow-400" />
              <span className="text-xs text-gray-600 ml-1">{rating}</span>
            </div>
            {/* The wishlist button is moved inside the heart icon above for better UX */}
            <button 
              onClick={() => onQuickView(item)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaEye className="text-gray-500 hover:text-blue-500" />
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center space-x-2 mb-3">
          <p className="text-lg font-bold text-[#00BB1C]">₹{discountedPrice.toFixed(2)}</p>
          <p className="text-sm text-gray-400 line-through">₹{originalPrice.toFixed(2)}</p>
          <span className="text-sm text-green-600">{discountPercentage}% off</span>
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            className={`w-full text-white text-sm font-medium py-2 px-4 rounded-full ${
              isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'
            }`}
            onClick={() => addToCart(item, 1, selectedSize)} // Pass item, quantity (default 1), and selectedSize
            disabled={isInCart}
          >
            {isInCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-700">Size:</span>
            <select
              className="w-16 px-2 py-1 border rounded"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

function Menuniforms() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]); // Initialized cartItems state
  const [wishlistItems, setWishlistItems] = useState([]); // Initialized wishlistItems state
  const [quickView, setQuickView] = useState(null);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1); // State for quick view quantity
  const [quickViewSize, setQuickViewSize] = useState('S'); // State for quick view size

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setCartItems(storedCart);
    setWishlistItems(storedWishlist);
  }, []);

  const filteredItems = menWearCategories.map(category => ({
    ...category,
    items: category.items.filter(item => {
      if (!selectedCategory) return true;
      return selectedCategory === category.name;
    })
  }));

  const handleSort = (option) => {
    setSortOption(option);
    filteredItems.forEach(category => {
      category.items.sort((a, b) => {
        if (option === 'price-low') return a.discountedPrice - b.discountedPrice;
        if (option === 'price-high') return b.discountedPrice - a.discountedPrice;
        return 0;
      });
    });
  };

  // New addToCart function
  const addToCart = (product, quantity = 1, size = 'S') => { // Added quantity and size parameters
    const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    // Check for item with same ID AND category AND size to avoid duplicates
    if (!currentCart.some((item) => item.id === product.id && item.category === product.category && item.size === size)) {
      const updatedCart = [...currentCart, { ...product, quantity: parseInt(quantity), size: size }]; // Store quantity and size
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      alert(`${parseInt(quantity)} of ${product.name} (Size: ${size}) added to cart!`);
    } else {
      alert(`${product.name} (Size: ${size}) is already in your cart!`);
    }
  };

  // New addToWishlist function
  const addToWishlist = (product) => {
    const currentWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    if (currentWishlist.some((item) => item.id === product.id && item.category === product.category)) {
      const updatedWishlist = currentWishlist.filter((item) => item.id !== product.id || item.category !== product.category);
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      alert(`${product.name} removed from wishlist!`);
    } else {
      const updatedWishlist = [...currentWishlist, product];
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      alert(`${product.name} added to wishlist!`);
    }
  };

  const handleQuickView = (product) => {
    setQuickView(product);
    setQuickViewQuantity(1); // Reset quantity when modal opens
    setQuickViewSize('S'); // Reset size when modal opens
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EcommerceGroceryHeader />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Men's Fashion Collection</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <FaFilter />
                <span>Filters</span>
              </button>
              <div className="relative">
                <select 
                  value={sortOption} 
                  onChange={(e) => handleSort(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {menWearCategories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {filteredItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">{category.name}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {category.items.map((item) => (
                  <UniformCard 
                    key={`${item.id}-${item.category}`} // Updated key for uniqueness
                    item={item} // Pass the entire item object
                    addToCart={addToCart} // Pass addToCart function
                    addToWishlist={addToWishlist} // Pass addToWishlist function
                    cartItems={cartItems} // Pass cartItems state
                    wishlistItems={wishlistItems} // Pass wishlistItems state
                    {...item} // Spread other item properties
                    onQuickView={() => handleQuickView(item)}
                  />
                ))}
              </div>
            </div>
          ))}

          {quickView && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{quickView.name}</h3>
                  <button 
                    onClick={() => setQuickView(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    X
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={quickView.image} 
                      alt={quickView.name} 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-4">{quickView.description}</p>
                    <div className="flex items-center space-x-2 mb-4">
                      <p className="text-lg font-bold text-[#00BB1C]">₹{quickView.discountedPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-400 line-through">₹{quickView.originalPrice.toFixed(2)}</p>
                      <span className="text-sm text-green-600">{Math.round(((quickView.originalPrice - quickView.discountedPrice) / quickView.originalPrice) * 100)}% off</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="text-sm font-medium text-gray-700 mr-2">Size:</span>
                      <select
                        className="px-3 py-1 border rounded"
                        value={quickViewSize}
                        onChange={(e) => setQuickViewSize(e.target.value)}
                      >
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                      </select>
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="text-sm font-medium text-gray-700 mr-2">Quantity:</span>
                      <input 
                        type="number" 
                        min="1" 
                        max="10"
                        value={quickViewQuantity}
                        onChange={(e) => setQuickViewQuantity(parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border rounded"
                      />
                    </div>
                    <button
                      onClick={() => addToCart(quickView, quickViewQuantity, quickViewSize)}
                      className={`w-full text-white py-2 rounded-lg ${
                        cartItems.some(
                          (cartItem) =>
                            cartItem.id === quickView.id &&
                            cartItem.category === quickView.category &&
                            cartItem.size === quickViewSize
                        )
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#00BB1C] hover:bg-[#009B16]'
                      }`}
                      disabled={cartItems.some(
                        (cartItem) =>
                          cartItem.id === quickView.id &&
                          cartItem.category === quickView.category &&
                          cartItem.size === quickViewSize
                      )}
                    >
                      {cartItems.some(
                        (cartItem) =>
                          cartItem.id === quickView.id &&
                          cartItem.category === quickView.category &&
                          cartItem.size === quickViewSize
                      )
                        ? 'Added to Cart'
                        : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Menuniforms;