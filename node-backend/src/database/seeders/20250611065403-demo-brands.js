'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const brandsData = [
        {
          brand_name: 'Nike',
          photo: 'brands/nike-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          brand_name: 'Adidas',
          photo: 'brands/adidas-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          brand_name: 'Puma',
          photo: 'brands/puma-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          brand_name: 'Under Armour',
          photo: 'brands/under-armour-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          brand_name: 'Reebok',
          photo: 'brands/reebok-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          brand_name: 'New Balance',
          photo: 'brands/new-balance-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          brand_name: 'Converse',
          photo: 'brands/converse-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          brand_name: 'Vans',
          photo: 'brands/vans-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          brand_name: 'Fila',
          photo: 'brands/fila-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          brand_name: 'ASICS',
          photo: 'brands/asics-logo.png',
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      console.log('Starting to insert brands...');
      await queryInterface.bulkInsert('brands', brandsData, {});
      console.log('Brands inserted successfully!');
    } catch (error) {
      console.error('Error seeding brands:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('brands', null, {});
    } catch (error) {
      console.error('Error removing brands:', error);
      throw error;
    }
  }
}; 