'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurants', [
      {
        id: 1,
        name: 'Pasta Paradise',
        description: 'Authentic Italian cuisine',
        address: '123 Italian St',
        phone: '+1234567890',
        email: 'info@pastaparadise.com',
        category_id: 1,
        rating: 4.5,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Spice Garden',
        description: 'Traditional Indian cuisine',
        address: '456 Curry Lane',
        phone: '+1987654321',
        email: 'info@spicegarden.com',
        category_id: 2,
        rating: 4.8,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Dragon Wok',
        description: 'Authentic Chinese cuisine',
        address: '789 Noodle Road',
        phone: '+1122334455',
        email: 'info@dragonwok.com',
        category_id: 3,
        rating: 4.3,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null, {});
  }
};
