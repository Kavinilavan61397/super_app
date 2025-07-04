const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Size = require('../models/Size');
const Color = require('../models/Color');
const Unit = require('../models/Unit');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs').promises;
const ProductAttribute = require('../models/ProductAttribute');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('brand')
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category_id: categoryId })
      .populate('brand')
      .populate('category')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

exports.getProductsByCategoryName = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    const products = await Product.find({ category_id: category._id })
      .populate('brand')
      .populate('category')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products by category name:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category name',
      error: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('brand')
      .populate('category');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, brand_id, category_id, slug, sku, sale_price, stock, status, meta_title, meta_description } = req.body;
    let imagePath = null;
    if (req.file) {
      const processedImage = await processImage(req.file, {}, 'products');
      imagePath = `/uploads/products/${processedImage.filename}`;
    }
    const product = await Product.create({
      name,
      description,
      slug,
      sku,
      price,
      sale_price,
      stock,
      category_id,
      brand_id,
      photo: imagePath,
      featured_image: imagePath,
      status: status === 'true' || status === true,
      meta_title,
      meta_description,
    });
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    const { name, description, price, brand_id, category_id, slug, sku, sale_price, stock, status, meta_title, meta_description } = req.body;
    let processedImagePath = product.photo;
    if (req.file) {
      if (product.photo) {
        const oldImagePath = path.join(__dirname, '..', '..', 'uploads', product.photo.replace('/uploads/', ''));
        try {
          if (require('fs').existsSync(oldImagePath)) {
            await fs.unlink(oldImagePath);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      const processedImage = await processImage(req.file, {}, 'products');
      processedImagePath = `/uploads/products/${processedImage.filename}`;
    }
    product.name = name;
    product.description = description;
    product.slug = slug;
    product.sku = sku;
    product.price = price;
    product.sale_price = sale_price;
    product.stock = stock;
    product.category_id = category_id;
    product.brand_id = brand_id;
    product.photo = processedImagePath;
    product.featured_image = processedImagePath;
    product.status = status === 'true' || status === true;
    product.meta_title = meta_title;
    product.meta_description = meta_description;
    await product.save();
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    if (product.photo) {
      const oldImagePath = path.join(__dirname, '..', '..', 'uploads', product.photo.replace('/uploads/', ''));
      try {
        if (require('fs').existsSync(oldImagePath)) {
          await fs.unlink(oldImagePath);
        }
      } catch (error) {
        console.error('Error deleting product image:', error);
      }
    }
    await product.deleteOne();
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Stub functions for missing exports - TODO: Implement these with Mongoose
exports.bulkDeleteProducts = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Bulk delete products - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.getProductVariationById = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Get product variation by ID - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.getAllProductVariations = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Get all product variations - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.createProductVariation = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Create product variation - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.updateProductVariation = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Update product variation - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.deleteProductVariation = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Delete product variation - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.bulkDeleteProductVariations = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Bulk delete product variations - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.updateProductVariationStock = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Update product variation stock - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.getStockByProductVariation = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Get stock by product variation - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.deleteStockManagement = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Delete stock management - Not implemented yet (MongoDB migration in progress)'
  });
};

exports.getApplianceProductsWithAttributes = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Get appliance products with attributes - Not implemented yet (MongoDB migration in progress)'
  });
};