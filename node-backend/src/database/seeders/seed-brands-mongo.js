const mongoose = require('mongoose');
const Brand = require('../../models/Brand');

const MONGO_URI = 'mongodb://localhost:27017/superapp_db';

const brandsData = [
  { name: 'LG', slug: 'lg', photo: 'brands/lg.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Samsung', slug: 'samsung', photo: 'brands/samsung.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Whirlpool', slug: 'whirlpool', photo: 'brands/whirlpool.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Godrej', slug: 'godrej', photo: 'brands/godrej.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Haier', slug: 'haier', photo: 'brands/haier.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Panasonic', slug: 'panasonic', photo: 'brands/panasonic.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Bosch', slug: 'bosch', photo: 'brands/bosch.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Hitachi', slug: 'hitachi', photo: 'brands/hitachi.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'IFB', slug: 'ifb', photo: 'brands/ifb.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Voltas', slug: 'voltas', photo: 'brands/voltas.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Blue Star', slug: 'bluestar', photo: 'brands/bluestar.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Symphony', slug: 'symphony', photo: 'brands/symphony.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Crompton', slug: 'crompton', photo: 'brands/crompton.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Daikin', slug: 'daikin', photo: 'brands/daikin.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Kenstar', slug: 'kenstar', photo: 'brands/kenstar.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Preethi', slug: 'preethi', photo: 'brands/preethi.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Philips', slug: 'philips', photo: 'brands/philips.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Bajaj', slug: 'bajaj', photo: 'brands/bajaj.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Prestige', slug: 'prestige', photo: 'brands/prestige.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Morphy Richards', slug: 'morphyrichards', photo: 'brands/morphyrichards.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Butterfly', slug: 'butterfly', photo: 'brands/butterfly.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Sujata', slug: 'sujata', photo: 'brands/sujata.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Kent', slug: 'kent', photo: 'brands/kent.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Sony', slug: 'sony', photo: 'brands/sony.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'TCL', slug: 'tcl', photo: 'brands/tcl.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'OnePlus', slug: 'oneplus', photo: 'brands/oneplus.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Vu', slug: 'vu', photo: 'brands/vu.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Mi', slug: 'mi', photo: 'brands/mi.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Havells', slug: 'havells', photo: 'brands/havells.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Usha', slug: 'usha', photo: 'brands/usha.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Orient', slug: 'orient', photo: 'brands/orient.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'V-Guard', slug: 'vguard', photo: 'brands/vguard.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Khaitan', slug: 'khaitan', photo: 'brands/khaitan.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Polycab', slug: 'polycab', photo: 'brands/polycab.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Nike', slug: 'nike-logo', photo: 'brands/nike-logo.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Adidas', slug: 'adidas-logo', photo: 'brands/adidas-logo.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Puma', slug: 'puma-logo', photo: 'brands/puma-logo.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Under Armour', slug: 'under-armour-logo', photo: 'brands/under-armour-logo.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Reebok', slug: 'reebok-logo', photo: 'brands/reebok-logo.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'New Balance', slug: 'new-balance-logo', photo: 'brands/new-balance-logo.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Converse', slug: 'converse-logo', photo: 'brands/converse-logo.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Vans', slug: 'vans-logo', photo: 'brands/vans-logo.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'Fila', slug: 'fila-logo', photo: 'brands/fila-logo.png', status: true, created_at: new Date(), updated_at: new Date() },
  { name: 'ASICS', slug: 'asics-logo', photo: 'brands/asics-logo.png', status: true, created_at: new Date(), updated_at: new Date() }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Optionally clear existing brands
    await Brand.deleteMany({});
    console.log('Cleared existing brands');

    await Brand.insertMany(brandsData);
    console.log('Brands inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding brands:', err);
    process.exit(1);
  }
}

seed(); 