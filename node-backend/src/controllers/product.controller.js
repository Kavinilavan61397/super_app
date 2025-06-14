const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductVariation = require('../models/ProductVariation');
const { processImage } = require('../utils/imageProcessor');
const slugify = require('slugify');
const path = require('path');

// Get all products with pagination
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      include: [
        {
          model: Category,
          as: 'productCategory',
          attributes: ['id', 'name']
        },
        {
          model: ProductVariation,
          as: 'productVariations'
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total: count,
          page,
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'productCategory',
          attributes: ['id', 'name']
        },
        {
          model: ProductVariation,
          as: 'productVariations'
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      sale_price,
      stock,
      category_id,
      meta_title,
      meta_description,
      variations
    } = req.body;

    // Generate SKU
    const sku = `PRD-${Date.now()}`;
    const slug = slugify(name, { lower: true });

    // Process featured image if uploaded
    let featured_image = null;
    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 1200,
        height: 1200,
        quality: 85
      });
      featured_image = path.join('uploads', 'products', processedImage.filename);
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      slug,
      sku,
      price,
      sale_price,
      stock,
      category_id,
      featured_image,
      meta_title,
      meta_description
    });

    // Create variations if provided
    if (variations && Array.isArray(variations)) {
      const productVariations = variations.map(variation => ({
        ...variation,
        product_id: product.id,
        sku: `${sku}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      }));

      await ProductVariation.bulkCreate(productVariations);
    }

    // Fetch the created product with its variations
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'productCategory',
          attributes: ['id', 'name']
        },
        {
          model: ProductVariation,
          as: 'productVariations'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
      fullError: error
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      sale_price,
      stock,
      category_id,
      meta_title,
      meta_description,
      status,
      variations
    } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Process featured image if uploaded
    let featured_image = product.featured_image;
    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 1200,
        height: 1200,
        quality: 85
      });
      featured_image = path.join('uploads', 'products', processedImage.filename);
    }

    // Update product
    const updateData = {
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      sale_price: sale_price || product.sale_price,
      stock: stock || product.stock,
      category_id: category_id || product.category_id,
      featured_image,
      meta_title: meta_title || product.meta_title,
      meta_description: meta_description || product.meta_description,
      status: status !== undefined ? status : product.status
    };

    if (name) {
      updateData.slug = slugify(name, { lower: true });
    }

    await product.update(updateData);

    // Update variations if provided
    if (variations && Array.isArray(variations)) {
      // Delete existing variations
      await ProductVariation.destroy({
        where: { product_id: product.id }
      });

      // Create new variations
      const productVariations = variations.map(variation => ({
        ...variation,
        product_id: product.id,
        sku: `${product.sku}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      }));

      await ProductVariation.bulkCreate(productVariations);
    }

    // Fetch updated product with variations
    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'productCategory',
          attributes: ['id', 'name']
        },
        {
          model: ProductVariation,
          as: 'productVariations'
        }
      ]
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
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

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete variations first
    await ProductVariation.destroy({
      where: { product_id: product.id }
    });

    // Delete product
    await product.destroy();

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

// Toggle product status
exports.toggleStatus = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update({ status: !product.status });

    res.json({
      success: true,
      message: `Product ${product.status ? 'enabled' : 'disabled'} successfully`,
      data: product
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling product status',
      error: error.message
    });
  }
}; 