'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('dishes', [
      {
        id: 1,
        restaurant_id: 1,
        name: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper',
        price: 15.99,
        image: null,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        restaurant_id: 1,
        name: 'Margherita Pizza',
        description: 'Traditional pizza with tomato sauce, mozzarella, and basil',
        price: 12.99,
        image: null,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        restaurant_id: 2,
        name: 'Butter Chicken',
        description: 'Tender chicken in a spiced tomato, butter, and cream sauce',
        price: 16.99,
        image: null,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        restaurant_id: 2,
        name: 'Vegetable Biryani',
        description: 'Fragrant basmati rice cooked with mixed vegetables and Indian spices',
        price: 14.99,
        image: null,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        restaurant_id: 3,
        name: 'Kung Pao Chicken',
        description: 'Spicy stir-fried chicken with peanuts, vegetables, and chili peppers',
        price: 17.99,
        image: null,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        restaurant_id: 3,
        name: 'Dim Sum Platter',
        description: 'Assortment of steamed and fried dumplings',
        price: 13.99,
        image: null,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('dishes', null, {});
  }
};
