# Inventory Service

The Inventory Service is a microservice responsible for managing stock levels of products in the catalog. It provides endpoints to update and retrieve stock information.

## Features

- Update stock levels when orders are placed.
- Retrieve current stock levels for products.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd microservices-app/inventory-service
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Configure the database**:
   Update the database connection settings in `src/utils/db.js` to point to your MongoDB instance.

4. **Run the service**:
   ```
   npm start
   ```

## API Endpoints

- **Update Stock**
  - **Endpoint**: `POST /api/inventory/update`
  - **Description**: Updates the stock level for a specific product.
  - **Request Body**:
    ```json
    {
      "productId": "string",
      "quantity": "number"
    }
    ```

- **Get Stock**
  - **Endpoint**: `GET /api/inventory/stock/:productId`
  - **Description**: Retrieves the current stock level for a specific product.
  - **Response**:
    ```json
    {
      "productId": "string",
      "stock": "number"
    }
    ```

## Dependencies

- Express
- Mongoose

## License

This project is licensed under the MIT License.