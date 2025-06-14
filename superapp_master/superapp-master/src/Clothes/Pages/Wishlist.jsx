import React from 'react'
import shirt from "../Images/shirt.svg";
import Footer from '../../Utility/Footer';
import ClothesHeader from '../Header/ClothesHeader';
import WishlistProducts from '../SubPages/AllProducts/WishlistProducts';

const products = [
    {
        id: 1,
        name: "Men Uniforms",
        image: shirt, 
        price: 4000,
        originalPrice: 5000,
        discount: "30% Off",
        rating: 4.2,
        bestSeller: true,
    },
    {
        id: 2,
        name: "Men Uniforms",
        image: shirt,
        price: 4000,
        originalPrice: 5000,
        discount: "30% Off",
        rating: 4.2,
        bestSeller: true,
    },
    {
        id: 3,
        name: "Men Uniforms",
        image: shirt,
        price: 4000,
        originalPrice: 5000,
        discount: "30% Off",
        rating: 4.2,
        bestSeller: true,
    },
    {
        id: 4,
        name: "Men Uniforms",
        image: shirt,
        price: 4000,
        originalPrice: 5000,
        discount: "30% Off",
        rating: 4.2,
        bestSeller: true,
    },
    {
        id: 5,
        name: "Men Uniforms",
        image: shirt,
        price: 4000,
        originalPrice: 5000,
        discount: "30% Off",
        rating: 4.2,
        bestSeller: true,
    },
];

function Wishlist() {
    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <ClothesHeader />
            <div className='px-4 pt-24 pb-28'>
                <div className='font-medium text-base'>Wishlist</div>

                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                    {products.map((product) => (
                        <WishlistProducts key={product.id} product={product} />
                    ))}
                </div>

            </div>
            <Footer />
        </div>
    )
}
export default Wishlist;