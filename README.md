# Enterprise E-Commerce

A scalable **microservices-based E-Commerce application** built using Java and Spring Boot.

The application follows a **microservices architecture**, where each service is independently developed and maintains its own database.

## Microservices

| Service | Port | Database |
|---|---:|---|
| Auth Service | 8081 | auth_db |
| User Service | 8082 | user_db |
| Product Service | 8083 | product_db |
| Cart Service | 8084 | cart_db |
| Order Service | 8085 | order_db |
| Inventory Service | 8086 | inventory_db |
| Payment Service | 8087 | payment_db |

## Architecture

```text
                         Client
                           |
                           v
                    +---------------+
                    |  API Gateway  |
                    +-------+-------+
                            |
          +-----------------+------------------+
          |                 |                  |
          v                 v                  v
   +-------------+   +-------------+   +-------------+
   | Auth        |   | User        |   | Product     |
   | Service     |   | Service     |   | Service     |
   | :8081       |   | :8082       |   | :8083       |
   +------+------+   +------+------+   +------+------+
          |                 |                  |
          v                 v                  v
      auth_db           user_db           product_db

                            |
                            v
                    +---------------+
                    | Cart Service  |
                    | :8084         |
                    +-------+-------+
                            |
                            v
                         cart_db

                            |
                            v
                    +---------------+
                    | Order Service |
                    | :8085         |
                    +-------+-------+
                            |
              +-------------+-------------+
              |                           |
              v                           v
      +---------------+           +---------------+
      | Inventory     |           | Payment       |
      | Service       |           | Service       |
      | :8086         |           | :8087         |
      +-------+-------+           +-------+-------+
              |                           |
              v                           v
        inventory_db                 payment_db

## Auth Service

The Auth Service is responsible for authentication and authorization.

### Features

- User registration
- User login
- JWT-based authentication
- Password encryption using BCrypt
- Role-based authorization
- Spring Security integration
- Global exception handling
- MySQL database integration
- H2 database for automated testing
- Stateless authentication using JWT

### Port

8081

### Database

auth_db

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Authenticate an existing user |

### Authentication Flow

```text
Client
   |
   v
Register / Login
   |
   v
Auth Service
   |
   v
Spring Security
   |
   v
User Validation
   |
   v
JWT Token
   |
   v
Client
