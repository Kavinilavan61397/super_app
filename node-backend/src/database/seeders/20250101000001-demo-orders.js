'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get some user IDs (assuming we have users)
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Please run user seeders first.');
      return;
    }

    const orders = [];
    const orderItems = [];
    let orderItemId = 1;

    // Create 10 sample orders
    for (let i = 1; i <= 10; i++) {
      const userId = users[i % users.length].id;
      const orderNumber = `ORD-${Date.now()}-${i.toString().padStart(3, '0')}`;
      const subtotal = Math.random() * 500 + 50; // Random amount between 50-550
      const taxAmount = subtotal * 0.1;
      const shippingAmount = 0;
      const totalAmount = subtotal + taxAmount + shippingAmount;

      const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      const paymentMethods = ['cod', 'card', 'paypal', 'stripe'];
      const paymentStatuses = ['pending', 'paid', 'failed'];

      const order = {
        id: i,
        user_id: userId,
        order_number: orderNumber,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        total_amount: totalAmount,
        subtotal: subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        discount_amount: 0,
        shipping_address: JSON.stringify({
          address_line1: `${Math.floor(Math.random() * 9999) + 1} Main St`,
          address_line2: `Apt ${Math.floor(Math.random() * 999) + 1}`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
          state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
          country: 'USA',
          pincode: `${Math.floor(Math.random() * 90000) + 10000}`
        }),
        billing_address: JSON.stringify({
          address_line1: `${Math.floor(Math.random() * 9999) + 1} Main St`,
          address_line2: `Apt ${Math.floor(Math.random() * 999) + 1}`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
          state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
          country: 'USA',
          pincode: `${Math.floor(Math.random() * 90000) + 10000}`
        }),
        payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        payment_status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        payment_details: JSON.stringify({}),
        tracking_number: Math.random() > 0.5 ? `TRK${Math.floor(Math.random() * 999999999)}` : null,
        notes: Math.random() > 0.7 ? 'Sample order notes' : null,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        updated_at: new Date()
      };

      orders.push(order);

      // Create 1-3 items per order
      const itemCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < itemCount; j++) {
        const unitPrice = Math.random() * 100 + 10;
        const quantity = Math.floor(Math.random() * 5) + 1;
        const totalPrice = unitPrice * quantity;

        const orderItem = {
          id: orderItemId++,
          order_id: i,
          product_id: Math.floor(Math.random() * 50) + 1, // Random product ID
          variation_id: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 1 : null,
          quantity: quantity,
          price: unitPrice,
          total_price: totalPrice,
          product_data: JSON.stringify({
            name: `Sample Product ${Math.floor(Math.random() * 100) + 1}`,
            sku: `SKU-${Math.floor(Math.random() * 999999)}`,
            price: unitPrice,
            image: '/uploads/products/sample.jpg',
            category: 'Electronics',
            variation: Math.random() > 0.7 ? {
              sku: `VAR-${Math.floor(Math.random() * 999999)}`,
              attributes: {
                color: ['Red', 'Blue', 'Green', 'Black'][Math.floor(Math.random() * 4)],
                size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)]
              }
            } : null
          }),
          created_at: order.created_at,
          updated_at: order.updated_at
        };

        orderItems.push(orderItem);
      }
    }

    await queryInterface.bulkInsert('orders', orders, {});
    await queryInterface.bulkInsert('order_items', orderItems, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('orders', null, {});
  }
}; 