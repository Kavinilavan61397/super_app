import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import Footer from '../../Utility/Footer';
import fruits from '../Categories/Fruits';

const FruitDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const fruit = fruits.find((f) => f.id === parseInt(id)); 
  const [quantity, setQuantity] = useState(1); 
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setCartItems(storedCart);
    setWishlistItems(storedWishlist);
  }, []);

  // Save cart and wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [cartItems, wishlistItems]);

  // Handle image upload
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

  // Clean up uploaded image URL
  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  // Add to cart
  const addToCart = (fruit, quantity) => {
    if (!cartItems.some((item) => item.id === fruit.id)) {
      const updatedCart = [...cartItems, { ...fruit, quantity, totalPrice: fruit.discountedPrice * quantity }];
      setCartItems(updatedCart);
      alert(`${quantity} kg of ${fruit.name} added to cart!`);
    }
  };

  // Add/remove from wishlist
  const addToWishlist = (fruit) => {
    if (wishlistItems.some((item) => item.id === fruit.id)) {
      const updatedWishlist = wishlistItems.filter((item) => item.id !== fruit.id);
      setWishlistItems(updatedWishlist);
      alert(`${fruit.name} removed from wishlist!`);
    } else {
      const updatedWishlist = [...wishlistItems, fruit];
      setWishlistItems(updatedWishlist);
      alert(`${fruit.name} added to wishlist!`);
    }
  };

  const isInCart = cartItems.some((item) => item.id === fruit?.id);
  const isInWishlist = wishlistItems.some((item) => item.id === fruit?.id);

  const quantityOptions = [
    { value: 0.5, label: '0.5 kg' },
    { value: 1, label: '1 kg' },
    { value: 2, label: '2 kg' },
    { value: 3, label: '3 kg' },
  ];

  const calculatedOriginalPrice = fruit ? fruit.originalPrice * quantity : 0;
  const calculatedDiscountedPrice = fruit ? fruit.discountedPrice * quantity : 0;
  const discountPercentage = fruit
    ? Math.round(((fruit.originalPrice - fruit.discountedPrice) / fruit.originalPrice) * 100)
    : 0;

  if (!fruit) {
    return <div className="text-center py-10">Fruit not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EcommerceGroceryHeader />
      <div className="pt-24 px-4 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:underline"
        >
          &larr; Back to Fruits
        </button>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative mb-4 md:mb-0 md:w-1/2">
              <img
                src={uploadedImage || fruit.image}
                alt={fruit.name}
                className="w-full h-64 object-contain rounded-lg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute bottom-0 left-0 w-full h-10 opacity-0 cursor-pointer"
                id={`image-upload-${fruit.id}`}
                aria-label={`Upload image for ${fruit.name}`}
              />
            </div>
            {/* Details Section */}
            <div className="md:w-1/2 md:pl-6">
              <h1 className="text-2xl font-bold text-[#000000]">{fruit.name}</h1>
              <div className="flex items-center my-2">
                {fruit.isBestSeller && (
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Best Seller
                  </span>
                )}
                <div className="flex items-center ml-4">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span className="text-sm text-gray-600 ml-1">{fruit.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{fruit.description}</p>
              {/* Pricing and Offer Details */}
              <div className="mb-4">
                <p className="text-lg font-bold text-[#00BB1C]">
                  ₹{calculatedDiscountedPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 line-through">
                  ₹{calculatedOriginalPrice.toFixed(2)}
                </p>
                <span className="text-sm text-green-600">{discountPercentage}% off</span>
              </div>
              {/* Quantity Selector */}
              <div className="mb-4">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                  className="ml-2 border rounded px-3 dangerouslySetInnerHTML={{ __html: py-1 }} text-sm"
                  aria-label={`Select quantity for ${fruit.name}`}
                >
                  {quantityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  className={`text-white text-sm font-medium px-6 py-2 rounded-full ${
                    isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'
                  }`}
                  onClick={() => addToCart(fruit, quantity)}
                  disabled={isInCart}
                >
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <button
                  className={`rounded-full p-2 ${
                    isInWishlist ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
                  }`}
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  onClick={() => addToWishlist(fruit)}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isInWishlist ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FruitDetail;