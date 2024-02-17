import { DealerSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const dealerController = {
  index: {
    handler: async function (request, h) {
      const county = await db.countyStore.getCountyById(request.params.id);
      const dealer = await db.dealerStore.getDealerById(request.params.dealerid);
      const viewData = {
        title: "Edit Song",
        county: county,
        dealer: dealer,
      };
      return h.view("dealer-view", viewData);
    },
  },

  update: {
    validate: {
      payload: DealerSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dealer-view", { title: "Edit dealer error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const dealer = await db.dealerStore.getDealerById(request.params.dealerid);
      const newDealer = {
        title: request.payload.title,
        artist: request.payload.artist,
        duration: Number(request.payload.duration),
      };
      await db.dealerStore.updateDealer(dealer, newDealer);
      return h.redirect(`/county/${request.params.id}`);
    },
  },
};
