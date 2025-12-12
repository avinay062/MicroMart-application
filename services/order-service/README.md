# Order Service

The Order Service is a microservice responsible for managing customer orders in the microservices architecture. It handles order placement, retrieval, and status updates.

## Features

- Create new orders
- Retrieve existing orders
- Update the status of orders

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd microservices-app/order-service
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

- **POST /orders**: Create a new order
- **GET /orders/:id**: Retrieve an order by ID
- **PATCH /orders/:id/status**: Update the status of an order

## Dependencies

- Express
- Mongoose

## License

This project is licensed under the MIT License.