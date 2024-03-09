import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import Hapi from "@hapi/hapi";
import Cookie from "@hapi/cookie";
import Yar from "@hapi/yar";
import dotenv from "dotenv";
import path from "path";
import Joi from "joi";
import jwt from "hapi-auth-jwt2";
import HapiSwagger from "hapi-swagger";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import { handlebarsHelpers } from "./helpers/handlebars-helpers.js";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { apiRoutes } from "./api-routes.js";
import { validate } from "./api/jwt-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  // process.exit(1);
}

// Register each helper with Handlebars
Object.keys(handlebarsHelpers).forEach((helper) => {
  if (Object.prototype.hasOwnProperty.call(handlebarsHelpers, helper)) {
    Handlebars.registerHelper(helper, handlebarsHelpers[helper]);
  }
});

const swaggerOptions = {
  info: {
    title: "Envrio Buddy",
    version: "0.1.0",
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header"
    }
  },
  security: [{ jwt: [] }]
};

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    // host: "localhost",
  });

  server.ext("onPreResponse", (request, h) => {
    if (request.auth.isAuthenticated && request.response.source && request.response.source.context) {
      const context = {
        user: request.auth.credentials
      };
      // Merge the existing context with the new context
      request.response.source.context = {
        ...request.response.source.context,
        ...context
      };
      // console.log("some text here: ", request.response.source.context.user);
    }
    return h.continue;
  });

  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(jwt);
  server.validator(Joi);

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      plugin: Yar,
      options: {
        storeBlank: false,
        cookieOptions: {
          password: process.env.COOKIE_PASSWORD,
          isSecure: false,
        },
      },
    }
  ]);

  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });
  server.auth.strategy("jwt", "jwt", {
    key: process.env.COOKIE_PASSWORD,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] },
  });
  server.auth.default("session");

  // db.init("json");
  // db.init("mongo");
  db.init("firestore");
  server.route(webRoutes);
  server.route(apiRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();