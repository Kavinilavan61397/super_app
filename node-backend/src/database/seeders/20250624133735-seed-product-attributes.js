'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('product_attributes', [
      {
        product_id: 1,
        attribute_name: 'Capacity',
        attribute_value: '300L',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 2,
        attribute_name: 'Screen Size',
        attribute_value: '55 inch',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 3,
        attribute_name: 'Power Consumption',
        attribute_value: '180W',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 3, // Ceiling Fan
        attribute_name: 'Power',
        attribute_value: '75W',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 10,
        attribute_name: 'TON',
        attribute_value: '1.5',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 10,
        attribute_name: 'Energy Rating',
        attribute_value: '5 Star',
        created_at: new Date(),
        updated_at: new Date()
      }

      
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('product_attributes', null, {});
  }
};
