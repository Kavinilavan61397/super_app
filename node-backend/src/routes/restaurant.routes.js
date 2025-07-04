const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurant.controller');
const restaurantCategoryController = require('../controllers/restaurantCategory.controller');
const {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish
} = require('../controllers/dish.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { validateImage } = require('../middlewares/imageValidation.middleware');

// Restaurant Category Routes
router.get('/categories', protect, authorize('admin', 'restaurant_admin'), restaurantCategoryController.getAll);
router.get('/categories/:id', protect, authorize('admin', 'restaurant_admin'), restaurantCategoryController.getById);
router.post('/categories', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), validateImage, restaurantCategoryController.create);
router.put('/categories/:id', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), restaurantCategoryController.update);
router.delete('/categories/:id', protect, authorize('admin', 'restaurant_admin'), restaurantCategoryController.delete);

// Restaurant Routes
router.get('/', protect, authorize('admin', 'restaurant_admin'), getAllRestaurants);
router.get('/:id', protect, authorize('admin', 'restaurant_admin'), getRestaurantById);
router.post('/', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), validateImage, createRestaurant);
router.put('/:id', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), updateRestaurant);
router.delete('/:id', protect, authorize('admin', 'restaurant_admin'), deleteRestaurant);

// Dish Routes
router.get('/dishes', protect, authorize('admin', 'restaurant_admin'), getAllDishes);
router.get('/dishes/:id', protect, authorize('admin', 'restaurant_admin'), getDishById);
router.post('/dishes', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), validateImage, createDish);
router.put('/dishes/:id', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), updateDish);
router.delete('/dishes/:id', protect, authorize('admin', 'restaurant_admin'), deleteDish);

module.exports = router; 