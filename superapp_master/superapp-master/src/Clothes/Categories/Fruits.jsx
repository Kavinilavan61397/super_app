import React, { useState, useEffect } from 'react';
import Footer from '../../Utility/Footer';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import appleImage from '../Images/apple.jpg';
import bananaImage from '../Images/Banana.jpg';
import orangeImage from '../Images/orange.jpg';
import mangoImage from '../Images/mango.jpg';
import pineappleImage from '../Images/pineapple.jpg';
import grapeImage from '../Images/grape.jpg';
import strawberryImage from '../Images/strawberry.jpg';
import watermelonImage from '../Images/watermelon.jpg';
import kiwiImage from '../Images/kiwi.jpg';
import pomegranateImage from '../Images/pomegranate.jpg';
import blueberryImage from '../Images/Blueberries.jpg';
import peachImage from '../Images/peach.jpg';
import cherryImage from '../Images/cherry.jpg';
import pappayaImage from '../Images/pappaya.jpg';
import dragonFruitImage from '../Images/dragonfruit.jpg';
import lemonImage from '../Images/lemon.jpg';
import avocadoImage from '../Images/avocado.jpg';
import plumImage from '../Images/plum.jpg';
import raspberriesImage from '../Images/raspberries.jpg';
import coconutImage from '../Images/coconut.jpg';
import guavaImage from '../Images/guava.jpg';
import pearImage from '../Images/pear.jpg';
import lycheeImage from '../Images/lychee.jpg';
import blackberryImage from '../Images/Blackberry.jpg';
import cantaloupeImage from '../Images/cantaloupe.jpg';
import figImage from '../Images/fig.jpg';
import starfruitImage from '../Images/starfruit.jpg';
import jackfruitImage from '../Images/jackfruit.jpg';
import chikooImage from '../Images/chikoo.jpg';
import custardAppleImage from '../Images/custardapple.jpg';
import woodAppleImage from '../Images/woodapple.jpg';
import jamunImage from '../Images/jamun.jpg';
import jujubeImage from '../Images/jujube.jpg';


const fruits = [
  { id: 1, name: 'Apple', originalPrice: 200, discountedPrice: 150, image: appleImage, description: 'Fresh red apples, perfect for snacking.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 2, name: 'Banana', originalPrice: 80, discountedPrice: 60, image: bananaImage, description: 'Ripe yellow bananas, great for smoothies.', rating: 4.0, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 3, name: 'Orange', originalPrice: 120, discountedPrice: 90, image: orangeImage, description: 'Juicy oranges, rich in vitamin C.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 4, name: 'Mango', originalPrice: 250, discountedPrice: 200, image: mangoImage, description: 'Sweet and juicy mangoes, perfect for desserts.', rating: 4.7, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 5, name: 'Pineapple', originalPrice: 150, discountedPrice: 120, image: pineappleImage, description: 'Tropical pineapples, great for juicing.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 6, name: 'Grapes', originalPrice: 180, discountedPrice: 140, image: grapeImage, description: 'Seedless green grapes, sweet and crisp.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 7, name: 'Strawberry', originalPrice: 300, discountedPrice: 250, image: strawberryImage, description: 'Fresh strawberries, ideal for smoothies and desserts.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 8, name: 'Watermelon', originalPrice: 100, discountedPrice: 80, image: watermelonImage, description: 'Juicy watermelons, perfect for hydration.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 9, name: 'Kiwi', originalPrice: 220, discountedPrice: 180, image: kiwiImage, description: 'Tangy kiwis, packed with vitamins.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 10, name: 'Pomegranate', originalPrice: 260, discountedPrice: 210, image: pomegranateImage, description: 'Rich pomegranates, full of antioxidants.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 11, name: 'Blueberry', originalPrice: 350, discountedPrice: 300, image: blueberryImage, description: 'Sweet blueberries, great for baking.', rating: 4.4, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 12, name: 'Peach', originalPrice: 190, discountedPrice: 150, image: peachImage, description: 'Juicy peaches, perfect for summer snacks.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 13, name: 'Cherry', originalPrice: 320, discountedPrice: 270, image: cherryImage, description: 'Sweet and tart cherries, perfect for snacking.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 14, name: 'Papaya', originalPrice: 140, discountedPrice: 110, image: pappayaImage, description: 'Tropical papaya, great for digestion.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 15, name: 'Dragon Fruit', originalPrice: 280, discountedPrice: 230, image: dragonFruitImage, description: 'Exotic dragon fruit, vibrant and refreshing.', rating: 4.3, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 16, name: 'Lemon', originalPrice: 90, discountedPrice: 70, image: lemonImage, description: 'Zesty lemons, ideal for beverages and cooking.', rating: 4.0, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 17, name: 'Avocado', originalPrice: 200, discountedPrice: 160, image: avocadoImage, description: 'Creamy avocados, perfect for salads and spreads.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 18, name: 'Plum', originalPrice: 170, discountedPrice: 130, image: plumImage, description: 'Juicy plums, great for snacking or baking.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 19, name: 'Raspberry', originalPrice: 340, discountedPrice: 290, image: raspberriesImage, description: 'Tart raspberries, ideal for desserts and smoothies.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 20, name: 'Coconut', originalPrice: 110, discountedPrice: 90, image: coconutImage, description: 'Fresh coconuts, perfect for hydration and cooking.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 21, name: 'Guava', originalPrice: 130, discountedPrice: 100, image: guavaImage, description: 'Sweet and aromatic guavas, great for snacking.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 22, name: 'Pear', originalPrice: 160, discountedPrice: 120, image: pearImage, description: 'Juicy pears, perfect for fresh eating or baking.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 23, name: 'Lychee', originalPrice: 270, discountedPrice: 220, image: lycheeImage, description: 'Sweet and floral lychees, ideal for desserts.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 24, name: 'Blackberry', originalPrice: 330, discountedPrice: 280, image: blackberryImage, description: 'Juicy blackberries, perfect for desserts and smoothies.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 25, name: 'Cantaloupe', originalPrice: 130, discountedPrice: 100, image: cantaloupeImage, description: 'Sweet cantaloupes, ideal for refreshing snacks.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 26, name: 'Fig', originalPrice: 240, discountedPrice: 200, image: figImage, description: 'Sweet figs, great for fresh eating or baking.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 27, name: 'Starfruit', originalPrice: 260, discountedPrice: 210, image: starfruitImage, description: 'Tangy starfruit, great for garnishes and snacks.', rating: 4.3, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 28, name: 'Jackfruit', originalPrice: 180, discountedPrice: 140, image: jackfruitImage, description: 'Sweet and versatile jackfruit, ideal for curries and desserts.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 29, name: 'Chikoo', originalPrice: 150, discountedPrice: 120, image: chikooImage, description: 'Creamy and sweet sapota, perfect for milkshakes.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 28, name: 'Jackfruit', originalPrice: 180, discountedPrice: 140, image: jackfruitImage, description: 'Sweet and versatile jackfruit, ideal for curries and desserts.', rating: 4.6, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 29, name: 'Chikoo', originalPrice: 150, discountedPrice: 120, image: chikooImage, description: 'Creamy and sweet sapota, perfect for milkshakes.', rating: 4.4, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 30, name: 'Custard Apple', originalPrice: 200, discountedPrice: 160, image: custardAppleImage, description: 'Creamy custard apples, great for desserts.', rating: 4.5, isBestSeller: true, quantity: 1, category: 'Fruits' },
  { id: 31, name: 'Wood Apple', originalPrice: 140, discountedPrice: 110, image: woodAppleImage, description: 'Aromatic wood apples, ideal for refreshing juices.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 32, name: 'Jamun', originalPrice: 160, discountedPrice: 130, image: jamunImage, description: 'Nutritious jamun, great for digestion and cooling.', rating: 4.2, isBestSeller: false, quantity: 1, category: 'Fruits' },
  { id: 34, name: 'Jujube', originalPrice: 120, discountedPrice: 90, image: jujubeImage, description: 'Sweet and chewy jujube, perfect with salt and chili.', rating: 4.1, isBestSeller: false, quantity: 1, category: 'Fruits' },
];

const FruitCard = ({ fruit, addToCart, addToWishlist, cartItems, wishlistItems }) => {
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

  const discountPercentage = Math.round(((fruit.originalPrice - fruit.discountedPrice) / fruit.originalPrice) * 100);

  const isInCart = cartItems.some((item) => item.id === fruit.id && item.category===fruit.category );
  const isInWishlist = wishlistItems.some((item) => item.id === fruit.id && item.category===fruit.category);

  return (
    <div className="relative border rounded-lg p-4 flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="absolute top-2 right-2">
        <button
          className={`rounded-full p-1 ${isInWishlist ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => addToWishlist(fruit)}
        >
          <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
      <div className="relative">
        <img src={uploadedImage || fruit.image} alt={fruit.name} className="w-24 h-24 object-contain mb-2" />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute bottom-0 left-0 w-full h-6 opacity-0 cursor-pointer"
          id={`image-upload-${fruit.id}`}
          aria-label={`Upload image for ${fruit.name}`}
        />
      </div>
      <div className="flex items-center justify-between w-full mb-2">
        {fruit.isBestSeller && (
          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">Best Seller</span>
        )}
        <div className="flex items-center">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span className="text-xs text-gray-600 ml-1">{fruit.rating}</span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-[#000000]">{fruit.name}</h3>
      <p className="text-xs text-gray-600">{fruit.description}</p>
      <div className="flex items-center space-x-2 mt-2">
        <p className="text-base font-bold text-[#00BB1C]">₹{fruit.discountedPrice.toFixed(2)}</p>
        <p className="text-sm text-gray-500 line-through">₹{fruit.originalPrice.toFixed(2)}</p>
        <span className="text-xs text-green-600">{discountPercentage}% off</span>
      </div>
      <button
        className={`mt-2 text-white text-xs font-medium px-4 py-2 rounded-full ${
          isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00BB1C] hover:bg-[#009B16]'
        }`}
        onClick={() => addToCart(fruit)}
        disabled={isInCart}
      >
        {isInCart ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
};

function Fruits() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setCartItems(storedCart);
    setWishlistItems(storedWishlist);
  }, []);

  // useEffect(() => {
  //   localStorage.setItem('cartItems', JSON.stringify(cartItems));
  //   localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  // }, [cartItems, wishlistItems]);

  const addToCart = (fruit) => {
    const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (!currentCart.some((item) => item.id === fruit.id && item.category===fruit.category)) {
      const updatedCart = [...currentCart, fruit];
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      alert(`${fruit.name} added to cart!`);
    }
  };

  const addToWishlist = (fruit) => {
    const currentWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    if (currentWishlist.some((item) => item.id === fruit.id && item.category===fruit.category)) {
      const updatedWishlist = currentWishlist.filter((item) => item.id !== fruit.id || item.category!==fruit.category);
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      alert(`${fruit.name} removed from wishlist!`);
    } else {
      const updatedWishlist = [...currentWishlist, fruit];
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      alert(`${fruit.name} added to wishlist!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EcommerceGroceryHeader />
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#000000]">Fruits</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {fruits.map((fruit) => (
            <FruitCard
              key={fruit.id}
              fruit={fruit}
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

export default Fruits;