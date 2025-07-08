const express = require('express');
const cors = require('cors');
const path = require('path');
const groceryOrderRoutes = require('./routes/groceryOrder.routes');
const hotelRoutes = require('./routes/hotel.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const brandRoutes = require('./routes/brand.routes');
const productRoutes = require('./routes/product.routes');
const sizeRoutes = require('./routes/size.routes');
const colorRoutes = require('./routes/color.routes');
const unitRoutes = require('./routes/unit.routes');
const gcartRoutes = require('./routes/gcart.routes');
const groceryRoutes = require('./routes/grocery.routes');
const taxiRideRoutes = require('./routes/taxiRide.routes');
const taxiDriverRoutes = require('./routes/taxiDriver.routes');
const taxiVehicleRoutes = require('./routes/taxiVehicle.routes');
const gwishlistRoutes = require('./routes/gwishlist.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const permissionRoutes = require('./routes/permission.routes');
const staffRoutes = require('./routes/staff.routes');
const productAttributeRoutes = require('./routes/productAttribute.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const dishRoutes = require('./routes/dish.routes');
const amenityRoutes = require('./routes/amenity.routes');
const policyRoutes = require('./routes/policy.routes');
const locationRoutes = require('./routes/location.routes');
const faqRoutes = require('./routes/faq.routes');
const wishlistRoutes = require('./routes/wishlist.routes')
const cartRoutes = require('./routes/cart.routes')
const orderRoutes = require('./routes/order.routes')
const adminOrderRoutes = require('./routes/adminOrder.routes')

const app = express();

// ✅ CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files from the 'uploads' directory (not 'public/uploads')
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/orders', adminOrderRoutes); // Admin order routes
app.use('/api/admin', brandRoutes);     // /admin/brands
app.use('/api/products',productRoutes);
app.use('/api/wishlist',wishlistRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/orders', orderRoutes);    // User order routes
app.use('/api/admin', sizeRoutes);      // /admin/sizes
app.use('/api/admin', colorRoutes);     // /admin/colors
app.use('/api/admin', unitRoutes);      // /admin/units
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/groceries', groceryRoutes);
app.use('/api/gcart', gcartRoutes);     // ✅ Grocery cart items
app.use('/api/gwishlist', gwishlistRoutes);
app.use('/api/gorders', groceryOrderRoutes); // ✅ Grocery wishlist
app.use('/api/taxi-rides', taxiRideRoutes);
app.use('/api/taxi-drivers', taxiDriverRoutes);
app.use('/api/taxi-vehicles', taxiVehicleRoutes);
app.use('/api/users', userRoutes);      // ✅ User management
app.use('/api/roles', roleRoutes);      // ✅ Role management
app.use('/api/permissions', permissionRoutes); // ✅ Permission management
app.use('/api/staff', staffRoutes);     // ✅ Staff management
app.use('/api/grocery-orders', groceryOrderRoutes);
app.use('/api/product-attributes', productAttributeRoutes);
app.use('/api/restaurants', restaurantRoutes); // ✅ Restaurant management
app.use('/api/dishes', dishRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/faqs', faqRoutes);

// ✅ Default API welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Super App API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      brands: '/api/admin/brands',
      cart: '/api/cart',
      orders: '/api/orders',
      wishlist: '/api/wishlist',
      admin: '/api/admin',
      hotels: '/api/hotels',
      rooms: '/api/rooms',
      bookings: '/api/bookings',
      groceries: '/api/groceries',
      gcart: '/api/gcart',
      gwishlist: '/api/gwishlist',
      taxiRides: '/api/taxi-rides',
      taxiDrivers: '/api/taxi-drivers',
      taxiVehicles: '/api/taxi-vehicles',
      gorders: '/api/gorders',
      users: '/api/users',
      roles: '/api/roles',
      permissions: '/api/permissions',
      staff: '/api/staff',
      amenities: '/api/amenities',
      policies: '/api/policies',
      locations: '/api/locations',
      faqs: '/api/faqs'
    }
  });
});

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
