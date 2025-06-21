// const express = require('express');
// const router = express.Router();
// const groceryController = require('../controllers/grocery.controller');
// const upload = require('../middlewares/upload.middleware');
// // const Grocery = require('../models/Grocery');

// // GET all groceries
// router.get('/', groceryController.getAllGroceries);

// // GET all
// // router.get('/', async (req, res) => {
// //   const items = await Grocery.findAll();
// //   res.json(items);
// // });

// // GET grocery by ID
// router.get('/:id', groceryController.getGroceryById);

// // POST create grocery (with image upload)
// router.post('/', upload.single('image'), groceryController.createGrocery);

// // POST
// // router.post('/', async (req, res) => {
// //   try {
// //     const item = await Grocery.create(req.body);
// //     res.status(201).json(item);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // PUT update grocery (with image upload)
// router.put('/:id', upload.single('image'), groceryController.updateGrocery);

// // DELETE grocery
// router.delete('/:id', groceryController.deleteGrocery);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { Grocery } = require('../models');

// GET all
router.get('/', async (req, res) => {
  const items = await Grocery.findAll();
  res.json(items);
});

// POST
router.post('/', async (req, res) => {
  try {
    const item = await Grocery.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;