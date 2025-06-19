'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('gcart_items', [
      {
        user_id: 1,
        grocery_id: 8,
        name: 'Tomatoes',
        image: '/uploads/tomatoes.jpg',
        category: 'Vegetables',
        original_price: 40.0,
        discounted_price: 30.0,
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('gcart_items', null, {});
  }
};
