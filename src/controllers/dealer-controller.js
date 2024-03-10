import { db } from "../models/firestore/connect.js";
import { DealerSpec } from "../models/joi-schemas.js";

const countiesRef = db.collection("counties");
const dealersRef = db.collection("dealers");

export const dealerController = {
  // This function retrieves a specific county and dealer by their IDs, prepares the 
  // view data, and renders the dealer view
  index: {
    handler: async function (request, h) {
      const countyDoc = await countiesRef.doc(request.params.id).get();
      const county = { _id: countyDoc.id, ...countyDoc.data() };

      const dealerDoc = await dealersRef.doc(request.params.dealerid).get();
      const dealer = { _id: dealerDoc.id, ...dealerDoc.data() };

      const viewData = {
        title: "Edit Dealer",
        county: county,
        dealer: dealer,
        user: request.auth.credentials,
      };
      return h.view("dealer-view", viewData);
    },
  },
  // This function validates the request payload using the DealerSpec, updates a specific dealer by their ID 
  // with the new data, and redirects to the county view or all counties view depending on the user type
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

      const newDealer = {
        name: request.payload.name,
        address: request.payload.address,
        phone: request.payload.phone,
        email: request.payload.email,
        website: request.payload.website,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude
      };
      // Updates the dealer document in Firestore with the ID from the request parameters using the newDealer data
      await dealersRef.doc(request.params.dealerid).update(newDealer);

      if (user.type === "admin") {
        return h.redirect(`/allcounties/${request.params.id}`);
      }
      return h.redirect(`/county/${request.params.id}`);
    },
  },
};