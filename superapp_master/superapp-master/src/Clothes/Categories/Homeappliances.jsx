import React, { useRef, useEffect, useState } from 'react';
import Header from '../Header/ClothesHeader';
import search from '../../Icons/search.svg';
import mic from '../../Icons/Mic.svg';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from '../Images/home_appliances_banner.jpeg';
import banner2 from '../Images/fan_banner.jpeg';
import banner3 from '../Images/tv_banner.jpg';
import banner4 from '../Images/ac_banner.jpg';
import banner5 from '../Images/kitchen_banner.jpeg';
import banner6 from '../Images/refrigerator_banner.jpeg';
import refrigeratorImg from '../Images/refrigerator.png';
import washingMachineImg from '../Images/washing_machine.png';
import airConditionerImg from '../Images/air_conditioner.png';
import kitchenAppliancesImg from '../Images/blender.png';
import televisionImg from '../Images/television.png';
import fansImg from '../Images/fans.png';
import Footer from '../../Utility/Footer';
import { FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';
import { useCart } from '../../Utility/CartContext';


const categories = [
    { name: "Refrigerators", image: refrigeratorImg, route: '/categories/homeappliances/refrigerators' },
    { name: "Washing Machines", image: washingMachineImg, route: '/categories/homeappliances/washing-machines' },
    { name: "Air Conditioners & Coolers", image: airConditionerImg, route: '/categories/homeappliances/air-conditioners-coolers' },
    { name: "Kitchen Appliances", image: kitchenAppliancesImg, route: '/categories/homeappliances/kitchen-appliances' },
    { name: "Televisions", image: televisionImg, route: '/categories/homeappliances/televisions' },
    { name: "Fans & Other appliances", image: fansImg, route: '/categories/homeappliances/fans-other' },
];

const bannerImage = [
    { id: 1, mobile_image_url: banner1 },
    { id: 2, mobile_image_url: banner2 },
    { id: 3, mobile_image_url: banner3 },
    { id: 4, mobile_image_url: banner4 },
    { id: 5, mobile_image_url: banner5 },
    { id: 6, mobile_image_url: banner6 },
    // Add more banners if available
];

function ProductCard({ product, onQuickView, addToCart, addToWishlist, cartItems, wishlistItems }) {
    const isBestSeller = product.attributes?.find(attr => attr.attribute_name === 'isBestSeller')?.attribute_value === 'true';
    const rating = product.attributes?.find(attr => attr.attribute_name === 'Rating')?.attribute_value;
    const [qty, setQty] = useState(1);
    const imgSrc = product.photo ? `http://localhost:5000/uploads/${product.photo}` : (product.featured_image || refrigeratorImg);
    const isInCart = cartItems.some(item => item.id === product.id);
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    return (
        <div className="border rounded-2xl p-3 bg-white shadow-sm flex flex-col items-center relative h-full">
            <div className="relative w-full flex justify-center mb-2">
                <img src={imgSrc} alt={product.name} className="w-36 h-36 object-contain rounded" />
                {isBestSeller && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-[10px] font-semibold px-1.5 py-0.5 rounded z-10 mr-2" style={{lineHeight: '1.1'}}>Best Seller</span>
                )}
                <button className={`absolute top-2 right-2 text-xl bg-white rounded-full p-1 z-10 ml-2 ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} onClick={() => addToWishlist(product)}>{isInWishlist ? <FaHeart /> : <FaRegHeart />}</button>
                <button className="absolute top-2 right-10 text-gray-400 hover:text-blue-500 text-xl bg-white rounded-full p-1 z-10 ml-2" onClick={() => onQuickView(product)}><FaEye /></button>
            </div>
            <div className="font-semibold text-sm text-center mb-1 line-clamp-2">{product.name}</div>
            <div className="flex items-center justify-center gap-4 w-full mb-1">
                {rating && <div className="flex items-center text-xs text-yellow-600"><span className="mr-1 text-base">★</span><span className="font-semibold">{rating}</span></div>}
                <div className="flex items-center gap-1">
                    <span className="text-xs">Qty:</span>
                    <button className="border px-2 rounded text-xs" onClick={() => setQty(q => Math.max(1, q-1))}>-</button>
                    <span className="text-xs w-4 text-center">{qty}</span>
                    <button className="border px-2 rounded text-xs" onClick={() => setQty(q => q+1)}>+</button>
                </div>
            </div>
            <div className="text-lg font-bold text-green-700 mb-1">₹{product.price}</div>
            <button
                className={`bg-black hover:bg-gray-900 text-white px-4 py-2 rounded text-xs font-semibold w-full mt-auto mb-2 ${isInCart ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => addToCart(product, qty)}
                disabled={isInCart}
            >
                {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
        </div>
    );
}

function QuickViewModal({ product, onClose }) {
    if (!product) return null;
    const imgSrc = product.featured_image || product.photo || refrigeratorImg;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 max-h-[90vh] overflow-y-auto relative border border-gray-200">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>✕</button>
            <img src={imgSrc} alt={product.name} className="w-60 h-60 object-contain mx-auto mb-4 rounded-lg shadow-sm" />
            {product.brand && (
              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F0FF] text-[#684DFF] font-semibold text-sm shadow-sm border border-[#E0D7FF]">
                  {product.brand.brand_name}
                </span>
              </div>
            )}
            <div className="border-b border-gray-200 mb-3"></div>
            <div className="font-extrabold text-lg text-center mb-1 text-gray-900">{product.name}</div>
            <div className="text-center text-[#1FA300] font-bold text-lg mb-3">₹{product.price}</div>
            {product.attributes && product.attributes.length > 0 && (
              <ul className="text-[15px] text-gray-800 space-y-1 mb-1">
                {product.attributes
                  .filter(attr => attr.attribute_name !== 'isBestSeller')
                  .map(attr => (
                    <li key={attr.attribute_name}>
                      <span className="font-semibold">{attr.attribute_name}:</span> <span className="font-normal">{attr.attribute_value}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
    );
}

function HomeAppliances() {
    const navigate = useNavigate();
    const [bestSellers, setBestSellers] = useState([]);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    // Use CartContext for cart and wishlist
    const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } = useCart();

    useEffect(() => {
        async function fetchBestSellers() {
            try {
                const res = await fetch('/api/products/appliances');
                const data = await res.json();
                let all = (data.data || data) || [];
                let best = all.filter(p => p.attributes?.find(attr => attr.attribute_name === 'isBestSeller')?.attribute_value === 'true');
                best = best.sort(() => 0.5 - Math.random()).slice(0, 6);
                setBestSellers(best);
            } catch (e) {
                setBestSellers([]);
            }
        }
        fetchBestSellers();
    }, []);

    // CartContext-based addToCart and addToWishlist
    const handleAddToCart = async (product, quantity = 1) => {
        await addToCart(product.id, quantity);
    };
    const handleAddToWishlist = async (product) => {
        const isInWishlist = wishlist?.some(item => item.product_id === product.id);
        if (isInWishlist) {
            const item = wishlist.find(item => item.product_id === product.id);
            await removeFromWishlist(item.id);
        } else {
            await addToWishlist(product.id, 1);
        }
    };

    // Prepare cartItems and wishlistItems for ProductCard
    const cartItems = cart?.items?.map(i => ({ ...i.product, id: i.product_id })) || [];
    const wishlistItems = wishlist?.map(i => ({ ...i.product, id: i.product_id })) || [];

    return (
        <div className='min-h-screen'>
            <Header />
            <div className='mt-24 mb-28 pb-20 px-4'>
                {/* Search */}
                <div className="flex justify-center mt-4 ">
                    <div className="relative w-full ">
                        <img src={search} alt="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-7" />
                        <input
                            type="text"
                            placeholder="What do you want.."
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF]"
                        />
                        <img src={mic} alt="mic" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-7 h-7" />
                    </div>
                </div>

                {/* Banners */}
                <div className="w-full">
                    <Swiper
                        spaceBetween={16}
                        slidesPerView="auto"
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        modules={[Autoplay]}
                        className="!py-4 w-full"
                    >
                        {bannerImage.map((banner) => (
                            <SwiperSlide key={banner.id} className="!w-full">
                                <div className="flex flex-col items-center w-full h-[200px] rounded-2xl shadow-md cursor-pointer overflow-hidden">
                                    <img
                                        src={banner.mobile_image_url}
                                        alt="banner"
                                        className="w-full h-full object-cover rounded-2xl"
                                        loading="lazy"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Categories */}
                <div className="mt-8 mb-2 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl font-extrabold text-black text-center tracking-wide" style={{ letterSpacing: '2px' }}>
                        HOME APPLIANCE CATEGORIES
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="relative w-full aspect-square rounded-lg overflow-hidden bg-white p-1 flex flex-col items-center justify-center shadow-sm"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(category.route)}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-20 h-20 object-contain mb-1"
                            />
                            <div className="text-[11px] font-semibold text-center leading-tight whitespace-normal w-full px-1">
                                {category.name}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Best Sellers Heading */}
                <div className="mt-6 mb-2 flex items-center">
                    <span className="text-lg font-bold text-[#222]">Best Sellers</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {bestSellers.length === 0 && <div className="col-span-2 text-gray-400 text-center">No best sellers found.</div>}
                  {bestSellers.map(product => (
                    <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} cartItems={cartItems} wishlistItems={wishlistItems} />
                  ))}
                </div>
                <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

            </div>
                <Footer/>
        </div>
    );
}

export default HomeAppliances;