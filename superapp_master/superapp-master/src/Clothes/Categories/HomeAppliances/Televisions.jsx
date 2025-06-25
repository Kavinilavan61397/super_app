import React, { useEffect, useState } from 'react';
import Header from '../../Header/ClothesHeader';
import Footer from '../../../Utility/Footer';

function ProductCard({ product }) {
    return (
        <div className="border rounded-lg p-3 bg-white shadow flex flex-col items-center">
            <img src={product.featured_image || product.photo} alt={product.name} className="w-24 h-24 object-contain mb-2" />
            <div className="font-semibold text-sm text-center mb-1">{product.name}</div>
            <div className="text-xs text-gray-600 mb-1">₹{product.price}</div>
            {product.attributes && product.attributes.length > 0 && (
                <ul className="text-[11px] text-gray-500 list-disc pl-4 mb-1">
                    {product.attributes.map(attr => (
                        <li key={attr.attribute_name}><b>{attr.attribute_name}:</b> {attr.attribute_value}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Televisions() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch('/api/products/appliances');
                const data = await res.json();
                setProducts(data.data || data);
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
            <div className='mt-24 mb-28 pb-20 px-4'>
                <h1 className='text-2xl font-bold mb-4'>Televisions</h1>
                {loading && <div className="text-center py-8">Loading...</div>}
                {error && <div className="text-center text-red-500 py-8">{error}</div>}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No products found.</div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Televisions; 