import { CountySpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const dashboardController = {
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
        title: "Enviro-Buddy Dashboard",
        user: loggedInUser,
        counties: counties,
        showBrandOption: showBrandOption,
        messages: request.yar.flash("info")
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addCounty: {
    validate: {
      payload: CountySpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Add County error", errors: error.details }).takeover().code(400);
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
        console.log("existingCounty:", existingCounty);
        if (existingCounty) {
          request.yar.flash("info", "Duplicate county entry"); 
          // If the county already exists, return an error
          return h.redirect("/dashboard");
          // return h.view("dashboard-view", { title: "Add County error", errors: [{ message: "Duplicate county entry" }] }).takeover().code(400);
        }
    
        await db.countyStore.addCounty(newCounty);
        request.yar.flash("info", "County successfully added!");
        return h.redirect("/dashboard");
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
      return h.redirect("/dashboard");
    },
  },
};
