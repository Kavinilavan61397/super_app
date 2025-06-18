'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('groceries', [
      {
        name: "Broccoli",
        description: "Fresh green broccoli, rich in vitamins.",
        original_price: 100,
        discounted_price: 80,
        image: "broccoli.jpg",
        rating: 4.5,
        is_best_seller: true,
        quantity: 1,
        category: "Fruits & Vegetables",
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Apple",
        description: "Fresh red apples, perfect for snacking.",
        original_price: 200,
        discounted_price: 150,
        image: "apple.jpg",
        rating: 4.5,
        is_best_seller: true,
        quantity: 1,
        category: "Fruits & Vegetables",
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      }
      // Add more items from HomeG.jsx here
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('groceries', null, {});
  }
};
