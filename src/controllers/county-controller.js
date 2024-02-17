import { DealerSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const countyController = {
  index: {
    handler: async function (request, h) {
      console.log("info here2");
      const county = await db.countyStore.getCountyById(request.params.id);
      console.log(county);
      const viewData = {
        title: "county",
        county: county,
      };
      return h.view("county-view", viewData);
    },
  },

  addDealer: {
    validate: {
      payload: DealerSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("county-view", { title: "Add dealer error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const county = await db.countyStore.getCountyById(request.params.id);
      const newDealer = {
        title: request.payload.title,
        artist: request.payload.artist,
        duration: Number(request.payload.duration),
      };
      await db.dealerStore.addDealer(county._id, newDealer);
      return h.redirect(`/county/${county._id}`);
    },
  },

  deleteDealer: {
    handler: async function (request, h) {
      const county = await db.countyStore.getCountyById(request.params.id);
      await db.dealerStore.deleteDealer(request.params.dealerid);
      return h.redirect(`/county/${county._id}`);
    },
  },
};
