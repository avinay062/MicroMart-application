# Microservices Architecture Overview

This project is a microservices architecture built using Express.js and MongoDB. It consists of four main services: Product Service, Order Service, Inventory Service, and User Service. Each service is responsible for a specific domain and communicates with each other to provide a complete solution.

## Services

### 1. Product Service
- **Purpose**: Manages the product catalog.
- **Features**: 
  - CRUD operations for products.
- **Endpoints**:
  - `POST /products`: Create a new product.
  - `GET /products/:id`: Retrieve a product by ID.
  - `PUT /products/:id`: Update a product by ID.
  - `DELETE /products/:id`: Delete a product by ID.

### 2. Order Service
- **Purpose**: Handles order placement and status management.
- **Features**:
  - Create and manage orders.
- **Endpoints**:
  - `POST /orders`: Place a new order.
  - `GET /orders/:id`: Retrieve an order by ID.
  - `PUT /orders/:id/status`: Update the status of an order.

### 3. Inventory Service
- **Purpose**: Manages stock levels for products.
- **Features**:
  - Update and retrieve stock levels.
- **Endpoints**:
  - `PUT /inventory/:productId`: Update stock for a product.
  - `GET /inventory/:productId`: Get stock level for a product.

### 4. User Service
- **Purpose**: Manages user authentication and authorization.
- **Features**:
  - User registration and login.
  - Token-based authentication.
  - Role-based access control.
- **Endpoints**:
  - `POST /users/register`: Register a new user.
  - `POST /users/login`: Authenticate a user and issue a token.
  - `GET /users/:id`: Retrieve user details (protected route).

## Architecture

This application follows a **microservices architecture** where each service is independently developed, deployed, and scaled. The services communicate with each other using REST APIs. The architecture ensures modularity, scalability, and fault isolation.

### Key Components:
1. **Service Independence**: Each service has its own database and handles a specific domain.
2. **Communication**: Services interact via HTTP requests. For example:
   - The Order Service communicates with the Product Service to fetch product details.
   - The Inventory Service updates stock levels based on orders placed.
   - The User Service authenticates requests and ensures secure access to protected endpoints.
3. **Authentication**: The User Service issues JSON Web Tokens (JWT) for secure communication. Other services validate these tokens to authorize requests.

### Target of the eKart Application

The goal of this eKart application is to provide a scalable and modular e-commerce platform. The key objectives include:
- **Product Management**: Allow sellers to manage their product catalog.
- **Order Processing**: Enable customers to place and track orders seamlessly.
- **Inventory Management**: Ensure accurate stock levels and prevent overselling.
- **User Authentication**: Secure the platform with robust authentication and authorization mechanisms.
- **Scalability**: Support high traffic and large datasets by scaling services independently.

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to each service directory and install dependencies:
   ```
   cd product-service
   npm install
   cd ../order-service
   npm install
   cd ../inventory-service
   npm install
   cd ../user-service
   npm install
   ```

### Running the Services
- Start each service in separate terminal windows:
  ```
  cd product-service
  npm start
  ```
  ```
  cd order-service
  npm start
  ```
  ```
  cd inventory-service
  npm start
  ```
  ```
  cd user-service
  npm start
  ```

## Interactions
- The Order Service interacts with the Product Service to retrieve product details.
- The Inventory Service updates stock levels based on orders placed through the Order Service.
- The User Service authenticates users and issues tokens for secure communication between services.

# secret client?