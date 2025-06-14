const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const UserProfile = require('./UserProfile');
const Category = require('./Category');
const Product = require('./Product');
const ProductVariation = require('./ProductVariation');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const RestaurantCategory = require('./restaurantcategory')(sequelize, Sequelize.DataTypes);
const Restaurant = require('./restaurant')(sequelize, Sequelize.DataTypes);
const Dish = require('./dish')(sequelize, Sequelize.DataTypes);
const TaxiDriver = require('./taxidriver')(sequelize, Sequelize.DataTypes);
const TaxiVehicle = require('./taxivehicle')(sequelize, Sequelize.DataTypes);
const TaxiRide = require('./taxiride')(sequelize, Sequelize.DataTypes);
const Hotel = require('./hotel')(sequelize, Sequelize.DataTypes);
const Room = require('./room')(sequelize, Sequelize.DataTypes);
const Booking = require('./booking')(sequelize, Sequelize.DataTypes);

// Define User-UserProfile association
User.hasOne(UserProfile, {
  foreignKey: 'user_id',
  as: 'profile',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

UserProfile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Define associations for categories (self-referential)
Category.belongsTo(Category, { 
  as: 'parentCategory',
  foreignKey: 'parent_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Category.hasMany(Category, { 
  as: 'childCategories',
  foreignKey: 'parent_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Define associations between categories and products
Category.hasMany(Product, { 
  as: 'categoryProducts',
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Product.belongsTo(Category, { 
  as: 'productCategory',
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Define associations between products and variations
Product.hasMany(ProductVariation, { 
  as: 'productVariations',
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

ProductVariation.belongsTo(Product, { 
  as: 'baseProduct',
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Define Cart associations
User.hasMany(Cart, {
  foreignKey: 'user_id',
  as: 'carts',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Cart.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Cart.hasMany(CartItem, {
  foreignKey: 'cart_id',
  as: 'items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CartItem.belongsTo(Cart, {
  foreignKey: 'cart_id',
  as: 'cart',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CartItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CartItem.belongsTo(ProductVariation, {
  foreignKey: 'variation_id',
  as: 'variation',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Define Order associations
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
  onDelete: 'NO ACTION',
  onUpdate: 'CASCADE'
});

OrderItem.belongsTo(ProductVariation, {
  foreignKey: 'variation_id',
  as: 'variation',
  onDelete: 'NO ACTION',
  onUpdate: 'CASCADE'
});

// Self-referential relationship for categories
Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parent_id' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });

// Register associations for new models
if (RestaurantCategory.associate) RestaurantCategory.associate({ Restaurant });
if (Restaurant.associate) Restaurant.associate({ RestaurantCategory, Dish });
if (Dish.associate) Dish.associate({ Restaurant });
if (TaxiDriver.associate) TaxiDriver.associate({ TaxiVehicle, TaxiRide });
if (TaxiVehicle.associate) TaxiVehicle.associate({ TaxiDriver, TaxiRide });
if (TaxiRide.associate) TaxiRide.associate({ TaxiDriver, TaxiVehicle, User });

module.exports = {
  sequelize,
  User,
  UserProfile,
  Category,
  Product,
  ProductVariation,
  Cart,
  CartItem,
  Order,
  OrderItem,
  RestaurantCategory,
  Restaurant,
  Dish,
  TaxiDriver,
  TaxiVehicle,
  TaxiRide,
  Hotel,
  Room,
  Booking
}; 