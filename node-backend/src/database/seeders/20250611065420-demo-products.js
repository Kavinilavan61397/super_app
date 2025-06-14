'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, create the products
    await queryInterface.bulkInsert('products', [
      {
        id: 1,
        name: 'iPhone 13 Pro',
        description: 'Latest iPhone with pro camera system',
        slug: 'iphone-13-pro',
        sku: 'IP13P-001',
        price: 999.99,
        stock: 50,
        category_id: 3, // Smartphones
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'MacBook Pro M1',
        description: 'Powerful laptop with M1 chip',
        slug: 'macbook-pro-m1',
        sku: 'MBP-M1-001',
        price: 1299.99,
        stock: 30,
        category_id: 4, // Laptops
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Men\'s Casual T-Shirt',
        description: 'Comfortable cotton t-shirt',
        slug: 'mens-casual-tshirt',
        sku: 'MCT-001',
        price: 29.99,
        stock: 100,
        category_id: 5, // Men's Clothing
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Then, create product variations
    await queryInterface.bulkInsert('product_variations', [
      {
        product_id: 1,
        sku: 'IP13P-001-128GB',
        price: 999.99,
        stock: 20,
        attributes: JSON.stringify({ storage: '128GB', color: 'Graphite' }),
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 1,
        sku: 'IP13P-001-256GB',
        price: 1099.99,
        stock: 30,
        attributes: JSON.stringify({ storage: '256GB', color: 'Graphite' }),
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 2,
        sku: 'MBP-M1-001-8GB',
        price: 1299.99,
        stock: 15,
        attributes: JSON.stringify({ ram: '8GB', storage: '256GB' }),
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 3,
        sku: 'MCT-001-S',
        price: 29.99,
        stock: 30,
        attributes: JSON.stringify({ size: 'S', color: 'Black' }),
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 3,
        sku: 'MCT-001-M',
        price: 29.99,
        stock: 40,
        attributes: JSON.stringify({ size: 'M', color: 'Black' }),
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_variations', null, {});
    return queryInterface.bulkDelete('products', null, {});
  }
};
