import React, { useEffect, useState, useRef } from 'react';
import Header from '../../Header/ClothesHeader';
import Footer from '../../../Utility/Footer';
import homeApplianceImg from '../../Images/homeAppliance.jpg';
import { FaHeart, FaRegHeart, FaEye, FaFilter } from 'react-icons/fa';
import { useCart } from '../../../Utility/CartContext';

function ProductCard({ product, onQuickView, addToCart, addToWishlist, cartItems, wishlistItems }) {
    const isBestSeller = product.attributes?.find(attr => attr.attribute_name === 'isBestSeller')?.attribute_value === 'true';
    const rating = product.attributes?.find(attr => attr.attribute_name === 'Rating')?.attribute_value;
    const [qty, setQty] = useState(1);
    const isWishlisted = wishlistItems.some(item => item.id === product.id);
    const imgSrc = product.photo ? `http://localhost:5000/uploads/${product.photo}` : (product.featured_image || homeApplianceImg);
    const isInCart = cartItems.some(item => item.id === product.id);
    return (
        <div className="border rounded-2xl p-3 bg-white shadow-sm flex flex-col items-center relative h-full">
            <div className="relative w-full flex justify-center mb-2">
                <img src={imgSrc} alt={product.name} className="w-36 h-36 object-contain rounded" />
                {isBestSeller && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-[10px] font-semibold px-1.5 py-0.5 rounded z-10 mr-2" style={{lineHeight: '1.1'}}>Best Seller</span>
                )}
                <button className={`absolute top-2 right-2 text-xl bg-white rounded-full p-1 z-10 ml-2 ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} onClick={() => addToWishlist(product)}>{isWishlisted ? <FaHeart /> : <FaRegHeart />}</button>
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
            <button className={`bg-black hover:bg-grey:800 text-white px-4 py-2 rounded text-xs font-semibold w-full mt-auto mb-2 ${isInCart ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={() => { if (!isInCart) { addToCart(product, qty); }}} disabled={isInCart}>{isInCart ? 'Added to Cart' : 'Add to Cart'}</button>
        </div>
    );
}

function QuickViewModal({ product, onClose }) {
    if (!product) return null;
    const imgSrc = product.featured_image || product.photo || homeApplianceImg;
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

function WashingMachines() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [brandOptions, setBrandOptions] = useState([]);
    const [attributeOptions, setAttributeOptions] = useState({});
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const sortOptions = [
      { value: 'newest', label: 'Newest' },
      { value: 'price_asc', label: 'Price: Low to High' },
      { value: 'price_desc', label: 'Price: High to Low' },
      { value: 'rating', label: 'Rating' },
    ];
    const sortButtonRef = useRef();

    // Use CartContext for cart and wishlist
    const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } = useCart();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (sort && sort !== 'rating') params.append('sort', sort);
            if (priceRange[0] > 0) params.append('minPrice', priceRange[0]);
            if (priceRange[1] < 100000) params.append('maxPrice', priceRange[1]);
            if (selectedBrands.length > 0) params.append('brand', selectedBrands.join(','));
            Object.entries(selectedAttributes).forEach(([key, value]) => {
                if (key !== 'isBestSeller' && value) params.append(key, value);
            });
            const res = await fetch(`/api/products/appliances?${params.toString()}`);
            const data = await res.json();
            let filtered = (data.data || data).filter(
              p => (p.category === 'Washing Machines' || p.category.name === 'Washing Machines' )
            );
            if (selectedAttributes.isBestSeller === 'true') {
              filtered = filtered.filter(p => p.attributes?.find(attr => attr.attribute_name === 'isBestSeller')?.attribute_value === 'true');
            }
            if (selectedRating) {
              filtered = filtered.filter(p => {
                const rating = Number(p.attributes?.find(attr => attr.attribute_name === 'Rating')?.attribute_value || 0);
                return rating >= selectedRating;
              });
            }
            if (sort === 'rating') {
              filtered = filtered.slice().sort((a, b) => {
                const ratingA = Number(a.attributes?.find(attr => attr.attribute_name === 'Rating')?.attribute_value || 0);
                const ratingB = Number(b.attributes?.find(attr => attr.attribute_name === 'Rating')?.attribute_value || 0);
                return ratingB - ratingA;
              });
            }
            setProducts(filtered);
            const brands = Array.from(new Set(filtered.map(p => p.brand?.brand_name).filter(Boolean)));
            setBrandOptions(brands);
            const attrMap = {};
            filtered.forEach(p => {
                (p.attributes || []).forEach(attr => {
                    if (!attrMap[attr.attribute_name]) attrMap[attr.attribute_name] = new Set();
                    attrMap[attr.attribute_name].add(attr.attribute_value);
                });
            });
            const attrOptions = {};
            Object.entries(attrMap).forEach(([k, v]) => { attrOptions[k] = Array.from(v); });
            setAttributeOptions(attrOptions);
            setLoading(false);
        } catch (err) {
            setError('Failed to load products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, sort, priceRange, selectedRating, selectedBrands, selectedAttributes]);

    const handleApplyFilters = () => {
        setShowFilterModal(false);
        fetchProducts();
    };
    const handleClearFilters = () => {
        setSelectedBrands([]);
        setSelectedRating(null);
        setPriceRange([0, 100000]);
        setSelectedAttributes({});
        setShowFilterModal(false);
        fetchProducts();
    };

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
            <div className='mt-24 mb-28 pb-8 px-4'>
                <h1 className='text-2xl font-bold mb-4'>Washing Machines</h1>
                <div className="mb-2">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5C3FFF]"
                  />
                </div>
                <div className="flex flex-row items-center gap-2 mb-4">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-full font-semibold text-sm h-9 w-1/2 justify-center"
                    style={{ fontSize: '14px' }}
                    onClick={() => setShowFilterModal(true)}
                  >
                    <FaFilter className="text-base" /> Filter
                  </button>
                  <div className="relative w-1/2">
                    <button
                      className="border border-gray-300 rounded-full px-3 py-1.5 focus:outline-none bg-white flex items-center w-full justify-between text-sm h-9"
                      style={{ fontSize: '14px' }}
                      onClick={() => setSortDropdownOpen(open => !open)}
                      type="button"
                    >
                      {sortOptions.find(o => o.value === sort)?.label || 'Sort'}
                      <svg className={`ml-2 w-4 h-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {sortDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto" style={{minWidth: '120px'}}>
                        {sortOptions.map(option => (
                          <button
                            key={option.value}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#F3F0FF] ${sort === option.value ? 'bg-[#F3F0FF] font-semibold' : ''}`}
                            onClick={() => { setSort(option.value); setSortDropdownOpen(false); }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {showFilterModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative border border-gray-200 pb-24">
                      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowFilterModal(false)}>✕</button>
                      <div className="mb-4">
                        <div className="font-semibold mb-2">Price Range</div>
                        <div className="flex gap-2 items-center">
                          <input type="number" min={0} max={priceRange[1]} value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className="border rounded px-2 py-1 w-20" />
                          <span>-</span>
                          <input type="number" min={priceRange[0]} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="border rounded px-2 py-1 w-20" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="font-semibold mb-2">Rating</div>
                        <div className="flex gap-2">
                          {[5,4,3,2,1].map(r => (
                            <button key={r} className={`px-2 py-1 rounded-full border ${selectedRating === r ? 'bg-[#5C3FFF] text-white' : ''}`} onClick={() => setSelectedRating(r === selectedRating ? null : r)}>{r}★</button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="font-semibold mb-2">Brand</div>
                        <div className="flex flex-wrap gap-2">
                          {brandOptions.map(b => (
                            <button key={b} className={`px-3 py-1 rounded-full border ${selectedBrands.includes(b) ? 'bg-[#5C3FFF] text-white' : ''}`} onClick={() => setSelectedBrands(selectedBrands.includes(b) ? selectedBrands.filter(x => x !== b) : [...selectedBrands, b])}>{b}</button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="font-semibold mb-2">Best Seller</div>
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={selectedAttributes.isBestSeller === 'true'} onChange={e => setSelectedAttributes({...selectedAttributes, isBestSeller: e.target.checked ? 'true' : null})} />
                          <span>Show only Best Sellers</span>
                        </label>
                      </div>
                      {Object.entries(attributeOptions).map(([attr, values]) => (
                        attr !== 'isBestSeller' && attr !== 'Rating' && (
                          <div className="mb-4" key={attr}>
                            <div className="font-semibold mb-2">{attr}</div>
                            <div className="flex flex-wrap gap-2">
                              {values.map(v => (
                                <button key={v} className={`px-3 py-1 rounded-full border ${selectedAttributes[attr] === v ? 'bg-[#5C3FFF] text-white' : ''}`} onClick={() => setSelectedAttributes({...selectedAttributes, [attr]: selectedAttributes[attr] === v ? null : v})}>{v}</button>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                      <div className="flex gap-2 justify-end mt-6">
                        <button className="px-4 py-2 rounded-full border border-gray-300" onClick={handleClearFilters}>Clear</button>
                        <button className="px-4 py-2 rounded-full bg-black text-white font-semibold" onClick={handleApplyFilters}>Apply</button>
                      </div>
                    </div>
                  </div>
                )}
                {loading && <div className="text-center py-8">Loading...</div>}
                {error && <div className="text-center text-red-500 py-8">{error}</div>}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No products found.</div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} cartItems={cartItems} wishlistItems={wishlistItems} />
                    ))}
                </div>
            </div>
            <Footer />
            <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        </div>
    );
}

export default WashingMachines; 