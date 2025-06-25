// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const Brand = require('./Brand');
// const Category = require('./Category');

// const Product = sequelize.define('Product', {
//   id: {
//     type: DataTypes.BIGINT.UNSIGNED,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   slug: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   sku: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false
//   },
//   sale_price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: true
//   },
//   stock: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0
//   },
//   category_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'categories',
//       key: 'id'
//     }
//   },
//   featured_image: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   status: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true
//   },
//   meta_title: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   meta_description: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   photo: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   brand_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'brands',
//       key: 'id'
//     }
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     field: 'created_at',
//     allowNull: false
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     field: 'updated_at',
//     allowNull: false
//   }
// }, {
//   tableName: 'products',
//   timestamps: true,
//   indexes: [
//     {
//       fields: ['category_id']
//     }
//   ]
// });

// // Define associations
// Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
// Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// module.exports = Product; 



const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Brand = require('./Brand');
const Category = require('./Category');
// ❌ Removed ProductAttribute — it's not initialized yet here

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  featured_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  meta_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'brands',
      key: 'id'
    }
  }
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    {
      fields: ['category_id']
    }
  ]
});


Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });



module.exports = Product;
