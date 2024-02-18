# Enviro-Buddy
## Project description
This project will list main car manufacturers and there dealships (for electric car sales), initial spec below but subject to change

- List all Dealships that sell there brand of electric vehicle
- Group all dealerships by county
- Add reviews for each dealerhsip
- Give statistics/Analytics on user engagment
- main user ineterface for logged out users to view all data, data segmented by
    - Brand
    - County
    - Review rating
    - Weather description for test drive

## Technology Stack
- Backend: Node.js, Hapi.js
- Database: Firebase
- Templating: Handlebars
- API Validation: Joi
- API Documentation: OpenAI / Swagger
- Authentication: JSON Web Tokens (JWT)
- Styling: Bulma CSS
- Testing: Mocha, Chai

## Getting Started

### Prerequisites:
- Node.js and npm installed

### Dependencies:
- @hapi/boom: A library for returning HTTP-friendly error objects in Node.js applications.
- @hapi/cookie: A plugin for managing cookies securely in your Hapi.js application.
- @hapi/hapi: A rich framework for building applications and services, offering a robust plugin system.
- @hapi/inert: A static file and directory handler plugin for Hapi.js.
- @hapi/vision: A templates rendering plugin support for Hapi.js, integrating with various template engines.
- dotenv: A module that loads environment variables from a .env file into process.env for Node.js projects.
- handlebars: A templating engine for creating semantic templates effectively with minimal logic in templates.
- joi: A powerful schema description language and data validator for JavaScript.
- lowdb: A small local JSON database powered by Lodash, ideal for small projects or simple state persistence.
- mongoose: An elegant MongoDB object modeling tool designed to work in an asynchronous environment.
- uuid: A library for generating unique identifiers according to the UUID standard.

### Dev Dependencies:
- @types/lowdb: TypeScript type definitions for lowdb, providing autocomplete and type checking for lowdb in TypeScript projects.
- @types/uuid: TypeScript definitions for UUID, offering type safety and autocomplete features when working with UUIDs in TypeScript.
- axios: A promise-based HTTP client for the browser and Node.js, making it easy to send asynchronous HTTP requests to REST endpoints.
- chai: An assertion library for Node.js and the browser, allowing developers to use various assertion styles to test their code.
- eslint: A static code analysis tool for identifying problematic patterns found in JavaScript code, ensuring code quality and consistency.
- eslint-config-airbnb-base: A base set of ESLint rules following Airbnb's JavaScript style guide, without React specific rules.
- eslint-config-prettier: Disables all ESLint rules that are unnecessary or might conflict with Prettier, ensuring compatibility between ESLint and Prettier.
- eslint-plugin-import: An ESLint plugin that provides validation for ES2015+ (ES6+) import/export syntax, ensuring correct paths and imports.
- mocha: A flexible testing framework for JavaScript, making asynchronous testing simple and fun, often used for backend and frontend testing.
- nodemon: A utility that monitors for any changes in your source and automatically restarts your server, perfect for development environments.
- prettier: An opinionated code formatter that supports many languages and integrates with most editors, ensuring consistent code style.

### Installation:
- Clone the repository: git clone https://github.com/robert-ferguson78/Enviro-Buddy.git
- Navigate to the project directory: cd Enviro-Buddy
- Install dependencies: npm install

### Run application:
- Start application: npm start (or adjust the command according to your setup)