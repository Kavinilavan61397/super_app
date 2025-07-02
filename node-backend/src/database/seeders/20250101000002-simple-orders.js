'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = [
      {
        id: 1,
        user_id: 1,
        order_number: 'ORD-2025-001',
        status: 'pending',
        total_amount: 299.99,
        subtotal: 299.99,
        tax_amount: 0,
        shipping_amount: 0,
        discount_amount: 0,
        shipping_address: JSON.stringify({
          address_line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          pincode: '10001'
        }),
        billing_address: JSON.stringify({
          address_line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          pincode: '10001'
        }),
        payment_method: 'cod',
        payment_status: 'pending',
        payment_details: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        user_id: 2,
        order_number: 'ORD-2025-002',
        status: 'confirmed',
        total_amount: 149.50,
        subtotal: 149.50,
        tax_amount: 0,
        shipping_amount: 0,
        discount_amount: 0,
        shipping_address: JSON.stringify({
          address_line1: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          pincode: '90210'
        }),
        billing_address: JSON.stringify({
          address_line1: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          pincode: '90210'
        }),
        payment_method: 'card',
        payment_status: 'paid',
        payment_details: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('orders', orders, {});

    const orderItems = [
      {
        id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 2,
        price: 149.99,
        total_price: 299.98,
        product_data: JSON.stringify({
          name: 'Sample Product 1',
          sku: 'SKU-001',
          price: 149.99
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        order_id: 2,
        product_id: 2,
        quantity: 1,
        price: 149.50,
        total_price: 149.50,
        product_data: JSON.stringify({
          name: 'Sample Product 2',
          sku: 'SKU-002',
          price: 149.50
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('order_items', orderItems, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('orders', null, {});
  }
}; 