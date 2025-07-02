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

const PRODUCT = {
  LIST: '/api/products',
  DETAIL: (id) => `/api/products/${id}`,
  CREATE: '/api/products',
  UPDATE: (id) => `/api/products/${id}`,
  DELETE: (id) => `/api/products/${id}`,
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
    CATEGORIES: '/api/categories',
    PRODUCTS: '/api/products',
    PRODUCT_VARIATIONS: '/api/admin/product-variations',
    SIZES: '/api/admin/sizes',
    COLORS: '/api/admin/colors',
    UNITS: '/api/admin/units',
    ORDERS: '/api/admin/orders',
    USERS: '/api/admin/users',
    ROLES: '/api/admin/roles',
    PERMISSIONS: '/api/admin/permissions'
  }
};

const fullConfig = {
  ...API_CONFIG,
  AUTH,
  CATEGORY,
  PRODUCT,
  STORAGE_KEYS,
  HEADERS,
  ROUTES,
  ENDPOINTS
};

export default fullConfig; 