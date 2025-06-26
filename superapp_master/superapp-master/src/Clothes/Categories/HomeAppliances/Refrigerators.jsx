import React, { useEffect, useState } from 'react';
import Header from '../../Header/ClothesHeader';
import Footer from '../../../Utility/Footer';
import homeApplianceImg from '../../Images/homeAppliance.jpg';
import { FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';

function ProductCard({ product, onQuickView }) {
    const isBestSeller = product.attributes?.find(attr => attr.attribute_name === 'isBestSeller')?.attribute_value === 'true';
    const rating = product.attributes?.find(attr => attr.attribute_name === 'Rating')?.attribute_value;
    const [qty, setQty] = useState(1);
    const [wishlisted, setWishlisted] = useState(false);
    const imgSrc = product.featured_image || product.photo || homeApplianceImg;
    return (
        <div className="border rounded-2xl p-3 bg-white shadow-sm flex flex-col items-center relative h-full">
            <div className="relative w-full flex justify-center mb-2">
                <img src={imgSrc} alt={product.name} className="w-36 h-36 object-contain rounded" />
                {isBestSeller && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded z-10 mr-3">Best Seller</span>
                )}
                <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl bg-white rounded-full p-1 z-10 ml-2" onClick={() => setWishlisted(w => !w)}>{wishlisted ? <FaHeart /> : <FaRegHeart />}</button>
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
            <button className="bg-[#5C3FFF] hover:bg-[#4326c7] text-white px-4 py-2 rounded text-xs font-semibold w-full mt-auto mb-2">Add to Cart</button>
        </div>
    );
}

function QuickViewModal({ product, onClose }) {
    if (!product) return null;
    const imgSrc = product.featured_image || product.photo || homeApplianceImg;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 max-h-[90vh] overflow-y-auto relative">
                <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
                <img src={imgSrc} alt={product.name} className="w-48 h-48 object-contain mx-auto mb-2" />
                <div className="font-bold text-lg text-center mb-1">{product.name}</div>
                <div className="text-center text-gray-600 mb-2">₹{product.price}</div>
                {product.attributes && product.attributes.length > 0 && (
                    <ul className="text-[13px] text-gray-700 list-disc pl-4 mb-1">
                        {product.attributes.map(attr => (
                            <li key={attr.attribute_name}><b>{attr.attribute_name}:</b> {attr.attribute_value}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function Refrigerators() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch('/api/products/appliances');
                const data = await res.json();
                // Filter for 'Refrigerators' subcategory
                const filtered = (data.data || data).filter(
                  p => (p.category === 'Refrigerators' || p.category_name === 'Refrigerators' || (p.category && p.category.name === 'Refrigerators'))
                );
                setProducts(filtered);
                setLoading(false);
            } catch (err) {
                setError('Failed to load products');
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className='min-h-screen'>
            <Header />
            <div className='mt-24 mb-28 pb-8 px-4'>
                <h1 className='text-2xl font-bold mb-4'>Refrigerators</h1>
                {loading && <div className="text-center py-8">Loading...</div>}
                {error && <div className="text-center text-red-500 py-8">{error}</div>}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No products found.</div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                    ))}
                </div>
            </div>
            <Footer />
            <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        </div>
    );
}

export default Refrigerators; 