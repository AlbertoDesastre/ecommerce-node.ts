# Node.js Project with TypeScript, MySQL, and JWT Authentication

![Node.js](https://img.shields.io/badge/Node.js-v14.x-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-v8.x-blue.svg)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)
![Swagger](https://img.shields.io/badge/Swagger-API%20Documentation-red.svg)

This is a sample project for a backend web application developed in Node.js, using TypeScript as the programming language and MySQL as the database. The application includes unit tests and E2E tests to ensure code quality and functionality.

## Key Features

- **TypeScript**: Developed entirely in TypeScript for increased security and code clarity.
- **MySQL**: Relational database for data storage.
- **JWT Authentication**: Implements JWT token-based authentication to protect routes and resources.
- **Swagger**: API documentation generated automatically using Swagger for easy understanding and testing of the API.
- **Unit Tests**: Unit tests implemented with Jest to ensure code quality.
- **E2E Tests**: End-to-end tests with Supertest to verify end-to-end functionality.
- **Test Coverage**: The project aims to achieve test coverage of 80% or more.
- **Good Coding Practices**: Follows object-oriented programming (OOP) principles and utilizes good coding practices.
- **Scalability**: Designed with scalability in mind, making it easy to add new features and routes.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/your-project.git
   ```

2. Install dependencies:

   ```bash
   cd tu-proyecto
   npm install
   ```

3. Configure the .env file as shown in the example. Ensure you understand the purpose of each variable:

   ```bash
   PORT=8090 # Set the port on which the API will run
   DB_PORT=4123 # Set the port for the database connection
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   DB_TYPE=TEST # TEST / PROD. Depending on the mode you set, tests will run in that environment. DO NOT run E2E tests in a production environment as existing records are constantly deleted.
   DB_NAME=some_name
   SECRET= # Secret for your application, used when creating JWT tokens.
   EXAMPLE_TOKEN= # An example JWT token for certain E2E tests
   ```

4. Configure the MySQL database in the config/database.ts file. Make sure to provide the correct connection information.

5. Start the application:
   ```bash
   npm run serve
   ```

## E2E Test

End-to-end tests are implemented with Supertest and can be run using the following command:

```bash
npm run e2e
```

This will execute all end-to-end tests and provide detailed results. Note that the database connection must already be open.

## Test coverage

The project aims to achieve test coverage of 80% or more. You can generate a detailed test coverage report with the following command:

```bash
npm run e2e:coverage
```

This will generate an HTML report that can be found in the coverage folder, helping you identify areas that require additional testing.

## API Documentation

API documentation is automatically generated using Swagger and is available at http://localhost:\*\*\*\*/api-docs when the application is running. You can explore and test API routes using this interactive interface.

## License

This project is licensed under the MIT license. See the LICENSE file for more details.
