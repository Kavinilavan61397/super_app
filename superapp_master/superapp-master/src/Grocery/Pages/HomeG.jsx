import React, { useEffect, useState } from 'react';
import '../../Styles/Ecommerce/Groceries.css';
import { useCart } from '../../Utility/CartContext';
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import Footer from '../../Utility/Footer';

function Groceries() {
  const [randomizedItems, setRandomizedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const { addToCart, addToWishlist } = useCart();

  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/groceries');
        const data = await response.json();

        const formattedData = data.map(item => ({
          ...item,
          discountedPrice: item.discounted_price,
          originalPrice: item.original_price,
          isBestSeller: item.is_best_seller
        }));

        const shuffled = [...formattedData].sort(() => Math.random() - 0.5);
        setRandomizedItems(shuffled);
      } catch (error) {
        console.error('Failed to fetch groceries:', error);
      }
    };

    fetchGroceries();
  }, []);

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
    let sortedItems = [...randomizedItems];

    if (selectedOption === 'lowToHigh') {
      sortedItems.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (selectedOption === 'highToLow') {
      sortedItems.sort((a, b) => b.discountedPrice - a.discountedPrice);
    }

    setRandomizedItems(sortedItems);
  };

  const filteredItems = randomizedItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <EcommerceGroceryHeader />
      <div className="grocery-container">
        <div className="grocery-header">
          <h2>Groceries</h2>
          <div className="search-sort">
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select value={sortOption} onChange={handleSortChange}>
              <option value="">Sort by</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className="grocery-list">
          {filteredItems.map((item, index) => (
            <div className="grocery-card" key={index}>
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
              />
              <div className="grocery-details">
                <h3>{item.name}</h3>
                <p className="price">
                  ₹{item.discountedPrice}{' '}
                  <span className="original-price">₹{item.originalPrice}</span>
                </p>
                <div className="rating">
                  <span>⭐ {item.rating}</span>
                  {item.isBestSeller && (
                    <span className="bestseller-badge">Best Seller</span>
                  )}
                </div>
                <div className="card-buttons">
                  <button onClick={() => addToCart(item)}>Add to Cart</button>
                  <button onClick={() => addToWishlist(item)}>Wishlist</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Groceries;
