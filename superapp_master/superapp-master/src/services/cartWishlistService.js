const API_BASE = 'http://localhost:5000/api'; // Update if your backend runs on a different port

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// --- CART ---
export const fetchCart = async () => {
  const res = await fetch(`${API_BASE}/cart`, { headers: getHeaders(), credentials: 'include' });
  return res.json();
};

export const addToCart = async (product_id, quantity = 1) => {
  const res = await fetch(`${API_BASE}/cart/items`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({ product_id, quantity }),
  });
  return res.json();
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({ quantity }),
  });
  return res.json();
};

export const removeCartItem = async (itemId) => {
  const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include',
  });
  return res.json();
};

// --- WISHLIST ---
export const fetchWishlist = async () => {
  const res = await fetch(`${API_BASE}/wishlist`, { headers: getHeaders(), credentials: 'include' });
  return res.json();
};

export const addToWishlist = async (product_id, quantity = 1) => {
  const res = await fetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({ product_id, quantity }),
  });
  return res.json();
};

export const removeWishlistItem = async (itemId) => {
  const res = await fetch(`${API_BASE}/wishlist/${itemId}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include',
  });
  return res.json();
}; 