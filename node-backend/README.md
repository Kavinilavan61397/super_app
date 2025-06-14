# demo admin user credentials
username: admin@example.com
password: admin123

# To install dependencies
npm install

# To drop a db
npx sequelize-cli db:drop

# To create a db
npx sequelize-cli db:create

# To migrate a db
npx sequelize-cli db:migrate

# To populate with demo data
npx sequelize-cli db:seed:all

# TO start the server
npm start