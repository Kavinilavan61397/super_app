const API_CONFIG = {
  // Base API URL - use environment variable or default to localhost
  BASE_URL: 'http://localhost:5000',
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile',
    OTP: {
      GENERATE: '/api/auth/otp/generate',
      VERIFY: '/api/auth/otp/verify'
    }
  },

  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'OnlineShop-accessToken',
    USER_DATA: 'OnlineShop-userData',
    TOKEN_EXPIRATION: 'OnlineShop-tokenExpiration'
  },

  // Request headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default API_CONFIG; 