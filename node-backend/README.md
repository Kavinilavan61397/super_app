# demo admin user credentials

# Main Admin	    admin@example.com	    password123
# Ecommerce Admin	ecommerce@example.com	password123
# Grocery Admin	    grocery@example.com	    password123
# Taxi Admin	    taxi@example.com	    password123
# Hotel Admin	    hotel@example.com	    password123

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