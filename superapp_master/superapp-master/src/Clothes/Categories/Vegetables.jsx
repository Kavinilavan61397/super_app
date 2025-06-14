import React, { useState, useEffect } from 'react';
import Footer from '../../Utility/Footer';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import vegetable from '../Images/vegetabel.svg';
import broccoliImage from '../Images/broccoli.jpg';
import carrotImage from '../Images/Carrot.jpg';
import spinachImage from '../Images/spinach.jpg';
import tomatoImage from '../Images/tomato.jpg';
import potatoImage from '../Images/potatoe.jpg';
import onionImage from '../Images/onion.jpg';
import cucumberImage from '../Images/cucumber.jpg';
import bellpepperImage from '../Images/bellpeper.jpg';
import cabbageImage from '../Images/cabbage.jpg';
import cornImage from '../Images/corn.jpg';
import eggplantImage from '../Images/Eggplant.jpg';
import asparagusImage from '../Images/asparagus.jpg';
import greenbeanImage from '../Images/greenbean.jpg';
import peaImage from '../Images/pea.jpg';
import kaleImage from '../Images/kale.jpg';
import mushroomImage from '../Images/mushroom.jpg';
import pumpkinImage from '../Images/pumpkin.jpg';
import sweetpotatoImage from '../Images/sweetpotato.jpg';
import cauliflowerImage from '../Images/cauliflower.jpg';
import radishImage from '../Images/radish.jpg';
import beetrootImage from '../Images/beetroot.jpg';
import bottleGourdImage from '../Images/bottlegourd.jpg';
import ivyGourdImage from '../Images/ivygourd.jpg';
import curryLeavesImage from '../Images/curryleaves.jpg';
import clusterBeansImage from '../Images/clusterbeans.jpg';
import bitterGourdImage from '../Images/Bittergourd.jpg';
import drumstickImage from '../Images/drumstick.jpg';
import fenugreekLeavesImage from '../Images/FenugreekLeaves.jpg';
import amaranthLeavesImage from '../Images/Amaranthleaves.jpg';
import ridgeGourdImage from '../Images/ridgegourd.jpg';
import snakeGourdImage from '../Images/Snake Gourd.jpg';
import spongeGourdImage from '../Images/SpongeGourd.jpg';
import BrinjalImage from '../Images/Brinjal.jpg';
import dillLeavesImage from '../Images/dillleaves.jpg';
import okraImage from '../Images/Okra.jpg';
import turnipImage from '../Images/Turnip.jpg';



const vegetables = [
  { id: 1, name: 'Broccoli', originalPrice: 100, discountedPrice: 80, image: broccoliImage, description: 'Fresh green broccoli, rich in vitamins.', rating: 4.5, isBestSeller: true },
  { id: 2, name: 'Carrot', originalPrice: 60, discountedPrice: 50, image: carrotImage, description: 'Crunchy orange carrots, perfect for salads.', rating: 4.3, isBestSeller: false },
  { id: 3, name: 'Spinach', originalPrice: 40, discountedPrice: 35, image: spinachImage, description: 'Leafy green spinach, ideal for smoothies.', rating: 4.4, isBestSeller: true },
  { id: 4, name: 'Tomato', originalPrice: 50, discountedPrice: 45, image: tomatoImage, description: 'Red ripe tomatoes, great for sauces.', rating: 4.2, isBestSeller: false },
  { id: 5, name: 'Potato', originalPrice: 30, discountedPrice: 25, image: potatoImage, description: 'Versatile potatoes, perfect for mashing or frying.', rating: 4.0, isBestSeller: true },
  { id: 6, name: 'Onion', originalPrice: 35, discountedPrice: 30, image: onionImage, description: 'Pungent onions, a staple for many dishes.', rating: 4.1, isBestSeller: false },
  { id: 7, name: 'Cucumber', originalPrice: 45, discountedPrice: 40, image: cucumberImage, description: 'Cool cucumbers, refreshing in salads.', rating: 4.3, isBestSeller: false },
  { id: 8, name: 'Bell Pepper', originalPrice: 70, discountedPrice: 60, image: bellpepperImage, description: 'Colorful bell peppers, good for stir-fries.', rating: 4.6, isBestSeller: true },
  { id: 9, name: 'Cabbage', originalPrice: 55, discountedPrice: 48, image: cabbageImage, description: 'Green cabbage, great for coleslaw and stir-fries.', rating: 4.0, isBestSeller: false },
  { id: 11, name: 'Corn', originalPrice: 40, discountedPrice: 32, image: cornImage, description: 'Sweet corn on the cob, a summer favorite.', rating: 4.5, isBestSeller: false },
  { id: 12, name: 'Eggplant', originalPrice: 75, discountedPrice: 65, image: eggplantImage, description: 'Purple eggplant, delicious in curries and baked dishes.', rating: 4.1, isBestSeller: true },
  { id: 13, name: 'Asparagus', originalPrice: 90, discountedPrice: 75, image: asparagusImage, description: 'Green asparagus spears, great roasted or steamed.', rating: 4.6, isBestSeller: true },
  { id: 14, name: 'Green Bean', originalPrice: 50, discountedPrice: 40, image: greenbeanImage, description: 'Crisp green beans, perfect as a side dish.', rating: 4.0, isBestSeller: false },
  { id: 15, name: 'Pea', originalPrice: 45, discountedPrice: 38, image: peaImage, description: 'Sweet green peas, a versatile addition to many meals.', rating: 4.3, isBestSeller: false },
  { id: 16, name: 'Kale', originalPrice: 60, discountedPrice: 50, image: kaleImage, description: 'Nutrient-rich kale, excellent for salads or chips.', rating: 4.5, isBestSeller: true },
  { id: 17, name: 'Mushroom', originalPrice: 80, discountedPrice: 70, image: mushroomImage, description: 'Earthy mushrooms, ideal for stir-fries and pasta.', rating: 4.2, isBestSeller: true },
  { id: 20, name: 'Pumpkin', originalPrice: 70, discountedPrice: 60, image: pumpkinImage, description: 'Sweet and nutritious pumpkin, great for soups or baking.', rating: 4.0, isBestSeller: false },
  { id: 21, name: 'Sweet Potato', originalPrice: 55, discountedPrice: 45, image: sweetpotatoImage, description: 'Naturally sweet and healthy sweet potatoes.', rating: 4.4, isBestSeller: true },
   { id: 22, name: 'Cauliflower', originalPrice: 65, discountedPrice: 55, image: cauliflowerImage, description: 'Mild cauliflower, perfect for roasting or mashing.', rating: 4.2, isBestSeller: false },
  { id: 24, name: 'Radish', originalPrice: 35, discountedPrice: 30, image: radishImage, description: 'Crisp, peppery radishes, ideal for salads.', rating: 4.0, isBestSeller: false },
   { id: 25, name: 'Beetroot', originalPrice: 60, discountedPrice: 50, image: beetrootImage, description: 'Sweet and earthy beetroot, great for roasting.', rating: 4.4, isBestSeller: true },
 {  id: 26,  name: 'Bottle Gourd', originalPrice: 50, discountedPrice: 45,image: bottleGourdImage, description: 'Mild bottle gourd, ideal for lauki curry or soup.', rating: 4.2, isBestSeller: true },
{  id: 27,  name: 'Ivy Gourd',  originalPrice: 45,  discountedPrice: 40,  image: ivyGourdImage,  description: 'Crisp ivy gourd, perfect for tindora fry.',  rating: 4.3, isBestSeller: true },
 { id: 28, name: 'Curry Leaves', originalPrice: 30, discountedPrice: 25, image: curryLeavesImage, description: 'Aromatic curry leaves, essential for tempering.', rating: 4.4,isBestSeller: true },
  { id: 29, name: 'Cluster Beans', originalPrice: 55, discountedPrice: 48, image: clusterBeansImage, description: 'Nutty cluster beans, great for guar phali sabzi.', rating: 4.1,isBestSeller: false },
{ id: 30, name: 'Bitter Gourd', originalPrice: 50, discountedPrice: 42, image: bitterGourdImage, description: 'Bitter gourd, perfect for karela sabzi or stuffed dishes.', rating: 4.1, isBestSeller: false },
  { id: 31, name: 'Drumstick', originalPrice: 60, discountedPrice: 50, image: drumstickImage, description: 'Nutritious drumsticks, great for sambar or curry.', rating: 4.3, isBestSeller: true },
  { id: 34, name: 'Fenugreek Leaves', originalPrice: 35, discountedPrice: 30, image: fenugreekLeavesImage, description: 'Aromatic fenugreek leaves, ideal for methi paratha or curry.', rating: 4.4, isBestSeller: true },
  { id: 35, name: 'Amaranth Leaves', originalPrice: 40, discountedPrice: 35, image: amaranthLeavesImage, description: 'Nutritious amaranth leaves, great for stir-fries or dal.', rating: 4.2, isBestSeller: false },
   { id: 36, name: 'Ridge Gourd', originalPrice: 55, discountedPrice: 48, image: ridgeGourdImage, description: 'Juicy ridge gourd, great for turai curry or chutney.', rating: 4.2, isBestSeller: false },
  { id: 40, name: 'Snake Gourd', originalPrice: 50, discountedPrice: 42, image: snakeGourdImage, description: 'Long snake gourd, great for stir-fries or curries.', rating: 4.0, isBestSeller: false },
  { id: 41, name: 'Sponge Gourd', originalPrice: 45, discountedPrice: 38, image: spongeGourdImage, description: 'Soft sponge gourd, great for gilki sabzi or soups.', rating: 4.1, isBestSeller: false },
  { id: 42, name: 'Brinjal (Green)', originalPrice: 50, discountedPrice: 45, image: BrinjalImage, description: 'Green brinjal, ideal for bharwa baingan or curries.', rating: 4.2, isBestSeller: true },
  { id: 45, name: 'Dill Leaves', originalPrice: 30, discountedPrice: 25, image: dillLeavesImage, description: 'Fragrant dill leaves, great for suva bhaji or dal.', rating: 4.3, isBestSeller: true },
   { id: 46, name: 'Okra', originalPrice: 45, discountedPrice: 38, image: okraImage, description: 'Tender okra, ideal for bhindi masala or frying.', rating: 4.3, isBestSeller: true },
   { id: 47, name: 'Turnip', originalPrice: 40, discountedPrice: 35, image: turnipImage, description: 'Mild turnips, great for stews or roasting.', rating: 4.0, isBestSeller: false },

   
];

const VegetableCard = ({ vegetable, addToCart, addToWishlist, cartItems, wishlistItems }) => {
  const [uploadedImage, setUploadedImage] = useState(null);

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

  const discountPercentage = Math.round(((vegetable.originalPrice - vegetable.discountedPrice) / vegetable.originalPrice) * 100);

  const isInCart = cartItems.some((item) => item.id === vegetable.id);
  const isInWishlist = wishlistItems.some((item) => item.id === vegetable.id);

  return (
    <div className="relative border rounded-lg p-4 flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="absolute top-2 right-2">
        <button
          className={`rounded-full p-1 ${isInWishlist ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => addToWishlist(vegetable)}
        >
          <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
      <div className="relative">
        <img src={uploadedImage || vegetable.image} alt={vegetable.name} className="w-24 h-24 object-contain mb-2" />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute bottom-0 left-0 w-full h-6 opacity-0 cursor-pointer"
          id={`image-upload-${vegetable.id}`}
          aria-label={`Upload image for ${vegetable.name}`}
        />
      </div>
      <div className="flex items-center justify-between w-full mb-2">
        {vegetable.isBestSeller && (
          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">Best Seller</span>
        )}
        <div className="flex items-center">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span className="text-xs text-gray-600 ml-1">{vegetable.rating}</span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-[#000000]">{vegetable.name}</h3>
      <p className="text-xs text-gray-600">{vegetable.description}</p>
      <div className="flex items-center space-x-2 mt-2">
        <p className="text-base font-bold text-[#00BB1C]">₹{vegetable.discountedPrice.toFixed(2)}</p>
        <p className="text-sm text-gray-500 line-through">₹{vegetable.originalPrice.toFixed(2)}</p>
        <span className="text-xs text-green-600">{discountPercentage}% off</span>
      </div>
      <button
        className={`mt-2 text-white text-xs font-medium px-4 py-2 rounded-full ${
          isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'
        }`}
        onClick={() => addToCart(vegetable)}
        disabled={isInCart}
      >
        {isInCart ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
};

function Vegetables() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    // Optional: Load cart and wishlist from localStorage or an API on component mount
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setCartItems(storedCart);
    setWishlistItems(storedWishlist);
  }, []);

  useEffect(() => {
    // Save cart and wishlist to localStorage whenever they change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [cartItems, wishlistItems]);

  const addToCart = (vegetable) => {
    if (!cartItems.some((item) => item.id === vegetable.id)) {
      const updatedCart = [...cartItems, vegetable];
      setCartItems(updatedCart);
      alert(`${vegetable.name} added to cart!`);
    }
  };

  const addToWishlist = (vegetable) => {
    if (wishlistItems.some((item) => item.id === vegetable.id)) {
      const updatedWishlist = wishlistItems.filter((item) => item.id !== vegetable.id);
      setWishlistItems(updatedWishlist);
      alert(`${vegetable.name} removed from wishlist!`);
    } else {
      const updatedWishlist = [...wishlistItems, vegetable];
      setWishlistItems(updatedWishlist);
      alert(`${vegetable.name} added to wishlist!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EcommerceGroceryHeader />
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#000000]">Vegetables</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {vegetables.map((vegetable) => (
            <VegetableCard
              key={vegetable.id}
              vegetable={vegetable}
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              cartItems={cartItems}
              wishlistItems={wishlistItems}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Vegetables;