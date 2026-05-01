# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints

### User Routes
- **Index**: `/users` [GET] - Returns a list of all users. (Token required)
- **Show**: `/users/:id` [GET] - Returns a single user by ID. (Token required)
- **Create**: `/users` [POST] - Creates a new user.
- **Authenticate**: `/users/authenticate` [POST] - Authenticates a user.

### Product Routes
- **Index**: `/products` [GET] - Returns a list of all products.
- **Show**: `/products/:id` [GET] - Returns a single product by ID.
- **Create**: `/products` [POST] - Creates a new product. (Token required)

### Order Routes
- **Index**: `/orders` [GET] - Returns a list of all orders.
- **Show**: `/orders/:id` [GET] - Returns a single order by ID.
- **Create**: `/orders` [POST] - Creates a new order. (Token required)
- **Add Product**: `/orders/:id/products` [POST] - Adds a product to an order. (Token required)

## Database Schema

### Users Table
- `id`: SERIAL (Primary Key)
- `firstName`: VARCHAR(100)
- `lastName`: VARCHAR(100)
- `password`: VARCHAR(255)

### Products Table
- `id`: SERIAL (Primary Key)
- `name`: VARCHAR(255)
- `price`: INTEGER
- `category`: VARCHAR(100) (Optional)

### Orders Table
- `id`: SERIAL (Primary Key)
- `user_id`: INTEGER (Foreign Key to users.id)
- `status`: VARCHAR(20) (active or complete)

### Order_Products Table (Join Table)
- `id`: SERIAL (Primary Key)
- `order_id`: INTEGER (Foreign Key to orders.id)
- `product_id`: INTEGER (Foreign Key to products.id)
- `quantity`: INTEGER


