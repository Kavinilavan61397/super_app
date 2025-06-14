require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import database and models
const { sequelize } = require('./src/models');
require('./src/models'); // This will initialize all models and their associations

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const productRoutes = require('./src/routes/product.routes');
const categoryRoutes = require('./src/routes/category.routes');
const userProfileRoutes = require('./src/routes/userProfile.routes');
const productVariationRoutes = require('./src/routes/productVariation.routes');
const restaurantCategoryRoutes = require('./src/routes/restaurantCategory.routes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/profile', userProfileRoutes);
app.use('/api/product-variations', productVariationRoutes);
app.use('/api/restaurant-categories', restaurantCategoryRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SuperApp API' });
});

// Routes
app.use('/api/orders', require('./src/routes/order.routes'));
app.use('/api/cart', require('./src/routes/cart.routes'));
app.use('/api/restaurants', require('./src/routes/restaurant.routes'));
app.use('/api/hotels', require('./src/routes/hotelRoutes'));
app.use('/api/rooms', require('./src/routes/roomRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/taxi', require('./src/routes/taxi.routes'));
app.use('/api/dishes', require('./src/routes/dish.routes'));
app.use('/api/taxi-drivers', require('./src/routes/taxiDriver.routes'));
app.use('/api/taxi-vehicles', require('./src/routes/taxiVehicle.routes'));
app.use('/api/taxi-rides', require('./src/routes/taxiRide.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database without force/alter options
    await sequelize.sync();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer(); 