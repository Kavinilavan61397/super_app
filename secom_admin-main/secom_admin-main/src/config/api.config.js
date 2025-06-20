const API_CONFIG = {
  // Base API URL - use environment variable or default to localhost
  BASE_URL: 'http://localhost:5000',  // Local backend URL
};

console.log('API Base URL loaded:', API_CONFIG.BASE_URL);

// Authentication endpoints
const AUTH = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',
  OTP: {
    GENERATE: '/api/auth/otp/generate',
    VERIFY: '/api/auth/otp/verify'
  }
};

const CATEGORY = {
  LIST: '/api/categories',
  DETAIL: (id) => `/api/categories/${id}`,
  CREATE: '/api/categories',
  UPDATE: (id) => `/api/categories/${id}`,
  DELETE: (id) => `/api/categories/${id}`,
  TOGGLE_STATUS: (id) => `/api/categories/${id}/toggle-status`
};

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'OnlineShop-accessToken',
  USER_DATA: 'userData',
  TOKEN_EXPIRATION: 'OnlineShop-tokenExpiration'
};

// Request headers
const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// Routes
const ROUTES = {
  LOGIN: '/auth/sign-in',
  SIGNUP: '/auth/sign-up',
  DASHBOARD: '/admin/default'
};

const ENDPOINTS = {
  ADMIN: {
    BRANDS: '/api/admin/brands',
    CATEGORIES: '/api/admin/categories',
    PRODUCTS: '/api/admin/products',
    PRODUCT_VARIATIONS: '/api/admin/product-variations',
    SIZES: '/api/admin/sizes',
    COLORS: '/api/admin/colors',
    UNITS: '/api/admin/units',
    ORDERS: '/api/admin/orders',
    USERS: '/api/admin/users',
    ROLES: '/api/admin/roles',
    PERMISSIONS: '/api/admin/permissions'
  },
  RESTAURANT: {
    CATEGORIES: '/api/restaurant/categories',
    SUB_CATEGORIES: '/api/restaurant/sub-categories',
    PRODUCTS: '/api/restaurant/products',
    PRODUCT_VARIATIONS: '/api/restaurant/product-variations',
    ORDERS: '/api/restaurant/orders',
    RATINGS: '/api/restaurant/ratings',
    DISCOUNTS: '/api/restaurant/discounts'
  }
};

const fullConfig = {
  ...API_CONFIG,
  AUTH,
  CATEGORY,
  STORAGE_KEYS,
  HEADERS,
  ROUTES,
  ENDPOINTS
};

export default fullConfig; 