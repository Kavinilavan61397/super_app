'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, create parent categories
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        slug: 'electronics',
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Clothing',
        description: 'Fashion and apparel',
        slug: 'clothing',
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Then, create child categories
    await queryInterface.bulkInsert('categories', [
      {
        id: 3,
        name: 'Smartphones',
        description: 'Mobile phones and accessories',
        slug: 'smartphones',
        status: true,
        parent_id: 1, // Electronics
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Laptops',
        description: 'Laptops and accessories',
        slug: 'laptops',
        status: true,
        parent_id: 1, // Electronics
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'Men\'s Clothing',
        description: 'Men\'s fashion and apparel',
        slug: 'mens-clothing',
        status: true,
        parent_id: 2, // Clothing
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        name: 'Women\'s Clothing',
        description: 'Women\'s fashion and apparel',
        slug: 'womens-clothing',
        status: true,
        parent_id: 2, // Clothing
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // First, set all parent_id to NULL
    await queryInterface.bulkUpdate('categories', 
      { parent_id: null },
      { parent_id: { [Op.ne]: null } }
    );
    
    // Then delete all categories
    await queryInterface.bulkDelete('categories', null, {});
  }
};
