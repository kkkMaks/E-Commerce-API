# E-Commerce-API

Welcome to Project Name! This project is a web application that allows users to browse and purchase products, leave reviews, and manage their orders. It provides a seamless shopping experience and offers various features to enhance user engagement and satisfaction.

You can find documentation for the API here [https://e-commerce-kkkmaks-g7aal.ondigitalocean.app/api/v1/docs/](https://e-commerce-kkkmaks-g7aal.ondigitalocean.app/api/v1/docs/)

## Features

- User Registration and Authentication: Users can create an account, log in securely, and manage their profile information.

- Product Catalog: A wide range of products are available for users to browse, search, and view detailed information including price, description, and images.

- Reviews and Ratings: Users can leave reviews and ratings for products they have purchased, helping other users make informed decisions.

- Shopping Cart: Users can add products to their shopping cart, modify quantities, and proceed to checkout to complete their purchase.

- Order Management: Users can view their order history, track the status of their orders, and update relevant information such as shipping address.

- Security: The application implements secure authentication using bearer token-based authentication to ensure the privacy and integrity of user data.

## Technologies Used

- Backend Framework: Node.js, Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- SendMailer: SendGrid
- Service for storing images: Cloudinary
- Deployment: DigitalOcean
- API Documentation: Swagger

## Local Installation and Setup

1. Clone the repository and navigate to the project directory.

```bash
git clone https://github.com/kkkMaks/E-Commerce-API.git
cd E-Commerce-API
```

2. Install the required dependencies using [package manager]. Run the following command:

```bash
npm install
```

3. Configure the environment variables:

- MONGO_URL - mongodb url
- JWT_SECRET - secret key for jwt
- JWT_LIFETIME - token lifetime
- CLOUD_NAME - cloudinary name
- CLOUD_API_KEY - cloudinary api key
- CLOUD_API_SECRET - cloudinary api secret
- MAX_FILE_UPLOAD - max file size
- SENDGRID_API_KEY - sendgrid api key

4. Run the application using [package manager]. Execute the following command:

```bash
npm start
```

5. Access the application by visiting [http://localhost:5000] in your web browser.

## API Documentation

The API documentation provides detailed information about the available endpoints, request/response formats, and authentication requirements. It is generated based on the OpenAPI Specification (OAS) and can be accessed by opening the `docs` directory or at [link](https://e-commerce-kkkmaks-g7aal.ondigitalocean.app/api/v1/docs/)

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request.
