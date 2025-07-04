// Import all Mongoose models
const User = require('./User');
const UserProfile = require('./UserProfile');
const Category = require('./Category');
const Product = require('./Product');
const ProductVariation = require('./ProductVariation');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const OTP = require('./otp.model');
const GroceryOrder = require('./grocery_order');
const GroceryOrderItem = require('./grocery_order_item');
const Wishlist = require('./wishlist');

// Restaurant models
const RestaurantCategory = require('./restaurantcategory');
const Restaurant = require('./restaurant');
const Dish = require('./dish');

// Taxi models
const TaxiDriver = require('./taxidriver');
const TaxiVehicle = require('./taxivehicle');
const TaxiRide = require('./taxiride');

// Hotel models
const Hotel = require('./hotel');
const Room = require('./room');
const Booking = require('./booking');

// Other models
const ProductAttribute = require('./ProductAttribute');
const GCartItem = require('./gcart_items');
const Gwhishlist = require('./gwhishlist');
const Role = require('./Role');
const Staff = require('./Staff');
const Policy = require('./Policy');
const Location = require('./Location');
const Brand = require('./Brand');
const Amenity = require('./Amenity');

// Export all models
module.exports = {
  User,
  UserProfile,
  Category,
  Product,
  ProductVariation,
  Cart,
  CartItem,
  Order,
  OrderItem,
  OTP,
  RestaurantCategory,
  Restaurant,
  Dish,
  TaxiDriver,
  TaxiVehicle,
  TaxiRide,
  Hotel,
  Room,
  Booking,
  GroceryOrder,
  GroceryOrderItem,
  GCartItem,
  Gwhishlist,
  ProductAttribute,
  Role,
  Staff,
  Policy,
  Location,
  Wishlist,
  Brand,
  Amenity
};
