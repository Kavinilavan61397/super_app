const { ProductAttribute } = require('../models');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs');

exports.create = async (req, res) => {
  try {
    const { product_id, attribute_name, attribute_value } = req.body;
    let imagePath = null;

    // Image is required for create
    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      }, 'hotel_attributes');
      imagePath = `/uploads/hotel_attributes/${processedImage.filename}`;
    } else {
      return res.status(400).json({ message: 'Attribute image is required.' });
    }

    const attribute = await ProductAttribute.create({
      product_id,
      attribute_name,
      attribute_value,
      image: imagePath
    });
    res.status(201).json(attribute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const attributes = await ProductAttribute.findAll({ where: { product_id } });
    res.json(attributes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const attribute = await ProductAttribute.findByPk(id);
    if (!attribute) return res.status(404).json({ message: 'Attribute not found' });

    const { product_id, attribute_name, attribute_value } = req.body;
    let imagePath = attribute.image;

    // If new image uploaded, process and replace old
    if (req.file) {
      // Delete old image if exists
      if (attribute.image) {
        const oldImagePath = path.join(__dirname, '..', '..', 'uploads', attribute.image.replace('/uploads/', ''));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      }, 'hotel_attributes');
      imagePath = `/uploads/hotel_attributes/${processedImage.filename}`;
    }

    await attribute.update({
      product_id: product_id || attribute.product_id,
      attribute_name: attribute_name || attribute.attribute_name,
      attribute_value: attribute_value || attribute.attribute_value,
      image: imagePath
    });
    res.json({ message: 'Updated', attribute });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductAttribute.destroy({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
