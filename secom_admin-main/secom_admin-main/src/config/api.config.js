const API_CONFIG = {
  // Base API URL - use environment variable or default to localhost
  BASE_URL: 'http://localhost:5000',  // Local backend URL
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    OTP: {
      GENERATE: '/api/auth/otp/generate',
      VERIFY: '/api/auth/otp/verify'
    }
  },

  CATEGORY: {
    LIST: '/api/categories',
    DETAIL: (id) => `/api/categories/${id}`,
    CREATE: '/api/categories',
    UPDATE: (id) => `/api/categories/${id}`,
    DELETE: (id) => `/api/categories/${id}`,
    TOGGLE_STATUS: (id) => `/api/categories/${id}/toggle-status`
  },

  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'OnlineShop-accessToken',
    USER_DATA: 'userData',
    TOKEN_EXPIRATION: 'OnlineShop-tokenExpiration'
  },

  // Request headers
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  // Routes
  ROUTES: {
    LOGIN: '/auth/sign-in',
    SIGNUP: '/auth/sign-up',
    DASHBOARD: '/admin/default'
  },

  ENDPOINTS: {
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
  }
};

export default API_CONFIG; 