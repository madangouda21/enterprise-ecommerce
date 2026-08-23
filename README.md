# Enterprise E-Commerce

Full-stack Spring Boot microservices + React e-commerce application.

## Services

| Service | Port |
|---|---:|
| API Gateway | 8080 |
| Auth | 8081 |
| User | 8082 |
| Product | 8083 |
| Cart | 8084 |
| Order | 8085 |
| Inventory | 8086 |
| Payment | 8087 |
| Shipping | 8088 |
| Review | 8089 |
| Notification | 8090 |

## Frontend

The React application uses the API Gateway by default:

`http://localhost:8080`

Optional Vite variable:

`VITE_API_GATEWAY_URL=http://localhost:8080`

## Important flows

- JWT login/session restoration through Auth + User services.
- Customer product browsing and product media display.
- Customer cart operations through Cart Service.
- Checkout creates an Order, Payment and Shipping record.
- Customer order history and order details.
- Product reviews and review summary on product details.
- Admin product CRUD and local image/video upload.
- Admin inventory, users, orders, payments and shipping screens.
- API Gateway exposes all `/api/v1/**` service routes consistently.

## Local startup order

1. Start MySQL databases required by the services.
2. Start Auth, User, Product, Cart, Inventory, Order, Payment, Shipping, Review and Notification services.
3. Start API Gateway on port 8080.
4. Start the frontend with `npm install` then `npm run dev`.

Admin account initialized by Auth Service:

- Email: `admin@ecommerce.com`
- Password: `Admin@123`

Change the default development credentials before using the project outside a local environment.

## Media

Product images and videos are stored locally by Product Service under its `uploads/` directory.
