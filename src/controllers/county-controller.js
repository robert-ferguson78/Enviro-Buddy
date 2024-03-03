import { CountySpec, DealerSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const countyController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      let counties;
      let showBrandOption = false;
      if (loggedInUser && loggedInUser.type === "brand") {
          // console.log(loggedInUser.type);
        const userCounties = await db.countyStore.getUserCounties(loggedInUser._id);
        // Sort the counties array alphabetically by the 'name' property
        counties = userCounties.sort((a, b) => a.county.localeCompare(b.county));
        showBrandOption = true;
      } else {
          // console.log(loggedInUser.type);
        counties = await db.countyStore.getAllCounties();
        counties = counties.sort((a, b) => a.county.localeCompare(b.county));
      }
      const viewData = {
        title: "Enviro-Buddy County Dashboard",
        user: loggedInUser,
        counties: counties,
        showBrandOption: showBrandOption,
        messages: request.yar.flash("info")
      };
      return h.view("list-brand-counties-view", viewData);
    },
  },

  addCounty: {
    validate: {
      payload: CountySpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("list-brand-counties-view", { title: "Add County error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const loggedInUser = request.auth.credentials;
        const newCounty = {
          userid: loggedInUser._id,
          county: request.payload.county,
        };
        console.log("newCounty:", newCounty);
    
        // Check if a county with the same userid and county already exists
        const existingCounty = await db.countyStore.findCounty(newCounty);
        console.log("addCounty:", existingCounty);
        if (!existingCounty) {
          const createdCounty = await db.countyStore.addCounty(newCounty);
          console.log("addCounty:", createdCounty);
        }
        if (existingCounty) {
          request.yar.flash("info", "Duplicate county entry"); 
          // If the county already exists, return an error
          return h.redirect("/counties");
          // return h.view("dashboard-view", { title: "Add County error", errors: [{ message: "Duplicate county entry" }] }).takeover().code(400);
        }
    
        await db.countyStore.addCounty(newCounty);
        request.yar.flash("info", "County successfully added!");
        return h.redirect("/counties");
      } catch (error) {
        console.error("Error in addCounty handler:", error);
        throw error;
      }
    },
  },

  deleteCounty: {
    handler: async function (request, h) {
        // console.log("delete" + request.params.id);
      const county = await db.countyStore.getCountyById(request.params.id);
        // console.log("delete2");
      await db.countyStore.deleteCountyById(county._id);
        // console.log("delete3");
      return h.redirect("/counties");
    },
  },

  allCountiesDealers: {
    auth: {
      mode: "try"
    },
    handler: async function (request, h) {
      // console.log("info here2");
      const county = await db.countyStore.getCountyById(request.params.id);
      // console.log(county);
      const viewData = {
        title: "county",
        county: county,
        user: request.auth.credentials,
      };
       // console.log(request.auth.credentials);
      return h.view("county-view", viewData);
    },
  },

  allCounties: {
    auth: false,
    handler: async function (request, h) {
      let counties = await db.countyStore.getAllCounties();
      counties = counties.sort((a, b) => a.county.localeCompare(b.county));
      const viewData = {
        title: "All Counties",
        counties: counties
      };
      return h.view("all-counties-view", viewData);
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
        name: request.payload.name,
        address: request.payload.address,
        phone: request.payload.phone,
        email: request.payload.email,
        website: request.payload.website,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
      };
      console.log(newDealer);
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
