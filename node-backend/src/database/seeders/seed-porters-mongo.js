const mongoose = require('mongoose');
const User = require('../../models/User');
const Porter = require('../../models/Porter');
const PorterOrder = require('../../models/PorterOrder');
const OrderTracking = require('../../models/OrderTracking');
const Rating = require('../../models/Rating');
const SavedAddress = require('../../models/SavedAddress');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;
console.log('Connecting to:', MONGO_URI);

// 1. Define users (customers and porters)
const users = [
  { name: 'Alice', email: 'alice@example.com', password: 'password', role: 'user' },
  { name: 'Bob', email: 'bob@example.com', password: 'password', role: 'user' },
  { name: 'Porter One', email: 'porter1@example.com', password: 'password', role: 'user' },
  { name: 'Porter Two', email: 'porter2@example.com', password: 'password', role: 'user' }
];

// 2. Define porters (linked to users)
const porters = [
  {
    vehicleType: 'bike',
    status: 'active',
    currentLocation: { lat: 12.97, lng: 77.59 },
    rating: 4.5,
    phoneNumber: '9876543210',
    profilePhoto: '/uploads/porters/porter1.jpg',
    vehicleNumber: 'KA01AB1234',
    isAvailable: true,
    licenseNumber: 'DL-1234567890'
  },
  {
    vehicleType: 'auto',
    status: 'active',
    currentLocation: { lat: 12.98, lng: 77.60 },
    rating: 4.0,
    phoneNumber: '9876543211',
    profilePhoto: '/uploads/porters/porter2.jpg',
    vehicleNumber: 'KA02CD5678',
    isAvailable: false,
    licenseNumber: 'DL-0987654321'
  }
];

// 3. Define porter orders (linked to customers and porters)
const orders = [
  {
    pickupAddress: 'A Street',
    pickupLat: 12.97,
    pickupLng: 77.59,
    dropAddress: 'B Avenue',
    dropLat: 12.98,
    dropLng: 77.60,
    vehicleType: 'bike',
    fare: 50,
    status: 'completed',
    paymentStatus: 'paid',
    distance: 2.1,
    estimatedArrivalTime: new Date(Date.now() + 30 * 60000), // 30 min from now
    instructions: 'Call on arrival',
    cancelReason: null
  },
  {
    pickupAddress: 'C Road',
    pickupLat: 12.96,
    pickupLng: 77.58,
    dropAddress: 'D Lane',
    dropLat: 12.99,
    dropLng: 77.61,
    vehicleType: 'auto',
    fare: 80,
    status: 'cancelled',
    paymentStatus: 'failed',
    distance: 3.5,
    estimatedArrivalTime: new Date(Date.now() + 45 * 60000),
    instructions: 'Leave at the gate',
    cancelReason: 'Customer not available'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await OrderTracking.deleteMany({});
    await Rating.deleteMany({});
    await SavedAddress.deleteMany({});
    await PorterOrder.deleteMany({});
    await Porter.deleteMany({});
    await User.deleteMany({ email: { $in: users.map(u => u.email) } });
    console.log('Cleared porters, porter orders, tracking, ratings, saved addresses, and sample users');

    // Insert users
    const userDocs = await User.insertMany(users);
    // Map porters to user IDs
    porters[0].user = userDocs[2]._id;
    porters[1].user = userDocs[3]._id;
    const porterDocs = await Porter.insertMany(porters);

    // Map orders to customer and porter IDs
    orders[0].customer = userDocs[0]._id;
    orders[0].porter = porterDocs[0]._id;
    orders[1].customer = userDocs[1]._id;
    orders[1].porter = porterDocs[1]._id;
    const orderDocs = await PorterOrder.insertMany(orders);

    // Insert order tracking with speed and accuracy
    await OrderTracking.insertMany([
      {
        order: orderDocs[0]._id,
        porterLat: 12.97,
        porterLng: 77.59,
        speed: 25,
        accuracy: 5,
        timestamp: new Date()
      },
      {
        order: orderDocs[1]._id,
        porterLat: 12.98,
        porterLng: 77.60,
        speed: 30,
        accuracy: 8,
        timestamp: new Date()
      }
    ]);
    console.log('Order tracking seeded!');

    // Insert ratings
    await Rating.insertMany([
      {
        order: orderDocs[0]._id,
        customer: userDocs[0]._id,
        porter: porterDocs[0]._id,
        stars: 5,
        comment: 'Great service!',
        createdAt: new Date()
      },
      {
        order: orderDocs[1]._id,
        customer: userDocs[1]._id,
        porter: porterDocs[1]._id,
        stars: 4,
        comment: 'Quick delivery.',
        createdAt: new Date()
      }
    ]);
    console.log('Ratings seeded!');

    // Insert saved addresses
    await SavedAddress.insertMany([
      {
        user: userDocs[0]._id,
        label: 'Home',
        address: 'A Street',
        lat: 12.97,
        lng: 77.59
      },
      {
        user: userDocs[1]._id,
        label: 'Work',
        address: 'C Road',
        lat: 12.96,
        lng: 77.58
      }
    ]);
    console.log('Saved addresses seeded!');

    console.log('Porter users, porters, orders, tracking, ratings, and addresses seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
}

seed(); 