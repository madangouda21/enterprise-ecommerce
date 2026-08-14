# enterprise-ecommerce

# Enterprise E-Commerce

A scalable **microservices-based E-Commerce application** built using Java and Spring Boot.

## 🔐 Auth Service

The Auth Service is responsible for handling authentication and authorization for the application.

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

### Tech Stack

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- MySQL
- H2
- Maven
- GitHub Actions

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Authenticate an existing user |

### Authentication Flow

```text
Client
   ↓
Register / Login
   ↓
Auth Service
   ↓
Spring Security
   ↓
User Validation
   ↓
JWT Token
   ↓
Client
