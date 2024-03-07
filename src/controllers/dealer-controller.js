import { County } from "../models/mongo/county.js";
import { Dealer } from "../models/mongo/dealer.js";
import { DealerSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const dealerController = {
  index: {
    handler: async function (request, h) {
      const county = await db.countyStore.getCountyById(request.params.id);
      const dealer = await db.dealerStore.getDealerById(request.params.dealerid);
      const viewData = {
        title: "Edit Dealer",
        county: county,
        dealer: dealer,
        user: request.auth.credentials,
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
      const user = request.auth.credentials;
      const dealer = await db.dealerStore.getDealerById(request.params.dealerid);
        console.log(dealer);
      const newDealer = {
      name: request.payload.name,
      address: request.payload.address,
      phone: request.payload.phone,
      email: request.payload.email,
      website: request.payload.website,
      latitude: request.payload.latitude,
      longitude: request.payload.longitude
      };
      await db.dealerStore.updateDealer(dealer, newDealer);

      if (user.type === "admin") {
        return h.redirect(`/allcounties/${request.params.id}`);
      }
      return h.redirect(`/county/${request.params.id}`);
    },
  },
};