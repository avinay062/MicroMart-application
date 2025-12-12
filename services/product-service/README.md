# Product Service

This microservice is responsible for managing the product catalog. It provides CRUD operations for products, allowing users to create, read, update, and delete product entries.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd microservices-app/product-service
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up the MongoDB connection**:
   Ensure that you have a MongoDB instance running and update the connection string in `src/utils/db.js`.

4. **Run the service**:
   ```
   npm start
   ```

## API Endpoints

### Products

- **Create Product**
  - `POST /api/products`
  - Request Body: `{ "name": "Product Name", "price": 100, "description": "Product Description" }`
  
- **Get Product**
  - `GET /api/products/:id`
  
- **Update Product**
  - `PUT /api/products/:id`
  - Request Body: `{ "name": "Updated Name", "price": 150, "description": "Updated Description" }`
  
- **Delete Product**
  - `DELETE /api/products/:id`

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)

## Author

- [Your Name] - [Your Contact Information]