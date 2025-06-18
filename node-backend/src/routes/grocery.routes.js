const express = require('express');
const router = express.Router();
const Grocery = require('../models/Grocery');

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
