const express = require('express');
const cors = require('cors');
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const brandRoutes = require('./routes/brand.routes');
const productRoutes = require('./routes/product.routes');
const sizeRoutes = require('./routes/size.routes');
const colorRoutes = require('./routes/color.routes');
const unitRoutes = require('./routes/unit.routes');
const path = require('path');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', brandRoutes);  // Brand routes under /api/admin prefix
app.use('/api/admin', productRoutes);  // Product routes under /api/admin prefix
app.use('/api/admin', sizeRoutes);  // Size routes under /api/admin prefix
app.use('/api/admin', colorRoutes);  // Color routes under /api/admin prefix
app.use('/api/admin', unitRoutes);  // Unit routes under /api/admin prefix
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
const groceryRoutes = require('./routes/grocery.routes');
app.use('/api/groceries', groceryRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Super App API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      admin: '/api/admin',
      hotels: '/api/hotels',
      rooms: '/api/rooms',
      bookings: '/api/bookings',
      groceries: '/api/groceries'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app; 