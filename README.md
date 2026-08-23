

# Enterprise E-Commerce
A full-stack, scalable **microservices-based E-Commerce application** built using **Java, Spring Boot, React, MySQL, Spring Security, JWT, and GitHub Actions**.
The application follows a microservices architecture where each service is independently developed and maintains its own database.
## Microservices
| Service | Port | Database |
|---|---:|---|
| API Gateway | 8080 | — |
| Auth Service | 8081 | auth_db |
| User Service | 8082 | user_db |
| Product Service | 8083 | product_db |
| Cart Service | 8084 | cart_db |
| Order Service | 8085 | order_db |
| Inventory Service | 8086 | inventory_db |
| Payment Service | 8087 | payment_db |
| Shipping Service | 8088 | shipping_db |
| Review Service | 8089 | review_db |
| Notification Service | 8090 | notification_db |
## Architecture
```text
                         Client
                           |
                           v
                    +---------------+
                    | API Gateway   |
                    | :8080         |
                    +-------+-------+
                            |
        +-------------------+-------------------+
        |          |          |        |         |
        v          v          v        v         v
     Auth        User      Product    Cart      Order
    :8081       :8082      :8083     :8084     :8085
       |           |          |         |         |
       v           v          v         v         v
    auth_db      user_db   product_db cart_db  order_db
                                      |
                                      v
                              +---------------+
                              | Inventory     |
                              | :8086         |
                              +-------+-------+
                                      |
                                      v
                                 inventory_db
                    +----------------+----------------+
                    |                |                |
                    v                v                v
                Payment          Shipping          Review
                 :8087             :8088             :8089
                    |                |                |
                    v                v                v
               payment_db      shipping_db       review_db
                                      |
                                      v
                              Notification
                                 :8090
                                      |
                                      v
                              notification_db

API Gateway

The API Gateway is the single entry point for the frontend.

http://localhost:8080

The gateway routes requests to the appropriate microservice.

Frontend
   |
   v
API Gateway :8080
   |
   +----> Auth Service :8081
   +----> User Service :8082
   +----> Product Service :8083
   +----> Cart Service :8084
   +----> Order Service :8085
   +----> Inventory Service :8086
   +----> Payment Service :8087
   +----> Shipping Service :8088
   +----> Review Service :8089
   +----> Notification Service :8090

Auth Service

Responsible for authentication and authorization.

Features

* User registration
* User login
* JWT authentication
* Password encryption using BCrypt
* Role-based authorization
* Spring Security
* Stateless authentication
* Global exception handling
* MySQL integration
* Automated testing

Port

8081

Database

auth_db

API Endpoints

Method	Endpoint	Description
POST	/api/v1/auth/register	Register a new user
POST	/api/v1/auth/login	Authenticate an existing user

Authentication Flow

Client
   |
   v
Login
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
   |
   v
Authorization Header
Bearer <JWT>

User Service

Manages customer and administrator user information.

Responsibilities

* User profiles
* Customer information
* User roles
* User lookup
* User authorization data
* Communication with Auth Service

Port

8082

Database

user_db

Product Service

Manages the complete product catalog.

Features

* Create products
* Get all products
* Get product by ID
* Update products
* Delete products
* Product categories
* Product quantity
* Product pricing
* Product descriptions
* Product images
* Product videos
* Local media storage

Port

8083

Database

product_db

Product Media Flow

Product
   |
   v
ProductMedia
   |
   v
Local Image / Video Storage
   |
   v
Product API
   |
   v
React Frontend

Cart Service

Manages authenticated customer shopping carts.

Features

* Add product to cart
* View cart
* Update quantity
* Remove cart item
* Clear cart
* Calculate cart total

Port

8084

Database

cart_db

Order Service

Manages customer orders and order history.

Responsibilities

* Create orders
* Store order items
* Maintain order status
* Retrieve customer orders
* Retrieve order details
* Order history

Port

8085

Database

order_db

Inventory Service

Manages product stock.

Responsibilities

* Track inventory
* Check product availability
* Update stock
* Maintain quantities

Port

8086

Database

inventory_db

Payment Service

Manages payment information associated with orders.

Responsibilities

* Payment creation
* Payment status
* Payment information
* Order payment tracking

Port

8087

Database

payment_db

Shipping Service

Manages shipping information for orders.

Responsibilities

* Shipping information
* Delivery status
* Shipping address
* Order shipping tracking

Port

8088

Database

shipping_db

Review Service

Manages customer product reviews.

Features

* Create reviews
* Retrieve product reviews
* Review ratings
* Review summaries
* Customer review history

Port

8089

Database

review_db

Notification Service

Responsible for application notifications.

Responsibilities

* Order notifications
* Payment notifications
* Shipping notifications
* Application notifications

Port

8090

Database

notification_db

Frontend

The frontend is built using React.js and Vite.

The frontend communicates with the backend through the API Gateway.

React Frontend
      |
      v
API Gateway :8080
      |
      v
Microservices

Customer Features

* Registration
* Login
* JWT session restoration
* Product browsing
* Product search
* Product details
* Product images and videos
* Shopping cart
* Checkout
* Payment
* Order history
* Order details
* Product reviews
* Notifications
* User profile

Admin Features

* Admin dashboard
* Create products
* Update products
* Delete products
* Upload product images
* Upload product videos
* Manage inventory
* View users
* View orders
* Manage payments
* Manage shipping

Important Application Flows

Customer Authentication

Register / Login
       |
       v
Auth Service
       |
       v
JWT Token
       |
       v
React Frontend

Product Browsing

React
  |
  v
API Gateway
  |
  v
Product Service
  |
  v
product_db

Add to Cart

Customer
   |
   v
Product
   |
   v
Add to Cart
   |
   v
API Gateway
   |
   v
Cart Service
   |
   v
cart_db

Checkout

Cart
 |
 v
Checkout
 |
 v
Order Service
 |
 +----> Inventory Service
 |
 +----> Payment Service
 |
 +----> Shipping Service
 |
 v
Order Created

Product Review

Customer
   |
   v
Product Details
   |
   v
Review
   |
   v
Review Service
   |
   v
review_db

Local Development

Prerequisites

* Java 21
* Maven
* Node.js
* npm
* MySQL
* Git

Startup Order

1. Start MySQL databases required by the services.
2. Start Auth Service.
3. Start User Service.
4. Start Product Service.
5. Start Cart Service.
6. Start Order Service.
7. Start Inventory Service.
8. Start Payment Service.
9. Start Shipping Service.
10. Start Review Service.
11. Start Notification Service.
12. Start API Gateway on port 8080.
13. Start the React frontend.

Frontend

cd frontend
npm install
npm run dev

Frontend API Gateway

Default API Gateway:

http://localhost:8080

Optional Vite variable:

VITE_API_GATEWAY_URL=http://localhost:8080

Admin Development Account

The Auth Service initializes a development administrator account:

Email: admin@ecommerce.com
Password: Admin@123

Change the default development credentials before using the project outside a local development environment.

Product Media

Product images and videos are stored locally by Product Service.

product-service/
└── uploads/
    └── products/
        ├── images/
        └── videos/

The Product API returns media information to the frontend.

Technology Stack

Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* REST APIs
* JWT
* MySQL
* Maven

Frontend

* React.js
* Vite
* React Router
* JavaScript
* CSS

Architecture

* Microservices
* API Gateway
* Database per Service
* JWT Authentication
* Role-Based Authorization

DevOps

* Git
* GitHub
* GitHub Actions
* CI/CD

Project Structure

enterprise-ecommerce/
│
├── backend/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── user-service/
│   ├── product-service/
│   ├── cart-service/
│   ├── order-service/
│   ├── inventory-service/
│   ├── payment-service/
│   ├── shipping-service/
│   ├── review-service/
│   └── notification-service/
│
├── frontend/
│
├── .github/
│   └── workflows/
│
├── .gitignore
└── README.md

CI/CD

The project uses GitHub Actions for continuous integration and deployment workflows.

The active development branch is:

ci-cd

Changes pushed to the branch can trigger the configured GitHub Actions workflow.

Development Status

The core E-Commerce application includes:

* Authentication
* User management
* Product management
* Product media
* Cart
* Orders
* Inventory
* Payments
* Shipping
* Reviews
* Notifications
* Customer UI
* Admin UI
* API Gateway
* GitHub Actions CI/CD

Further infrastructure work can include:

* Docker
* Kafka
* Kubernetes
* Service discovery
* Observability
* Cloud deployment

After replacing the README, run these **outside the README code block**:
```bash
git add README.md
git commit -m "Update project README"
git push