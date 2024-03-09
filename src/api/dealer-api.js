import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { DealerSpec, IdSpec, CountySpec } from "../models/joi-schemas.js";

export const dealerApi = {

  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const places = await db.placeStore.getAllDealers();
        return places;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: DealerSpec, failAction: validationError },
    description: "Get all dealersApi",
    notes: "Returns all dealersApi",
  },

  findOne: {
    auth: false,
    async handler(request) {
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
    },
  },
};
