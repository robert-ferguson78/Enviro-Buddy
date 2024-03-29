import { CountySpec, DealerSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const countyController = {
  // This function retrieves all counties for the logged in user if they are a brand, sorts them alphabetically, and renders the county dashboard view
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // console.log("loggedInUser:", loggedInUser);
      let counties;
      let showBrandOption = false;
      // console.log("showBrandOptions:", showBrandOption);
      if (loggedInUser && loggedInUser.type === "brand") {
        // console.log("one");
        // console.log("userId is: ", loggedInUser._id);
        const userCounties = await db.countyStore.getCountiesByUserId(loggedInUser._id);
        // console.log("two");
       // console.log("logged in user: ", loggedInUser._id);
        counties = userCounties.sort((a, b) => a.county.localeCompare(b.county));
        showBrandOption = true;
      } else {
        const allCounties = await db.countyStore.getAllCounties();
        counties = allCounties.sort((a, b) => a.county.localeCompare(b.county));
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
  // This function retrieves all counties for the logged in user if they are an admin, sorts them alphabetically, and renders the county dashboard view
  adminIndex: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      let counties;
      let showAdminOption = false;
      if (loggedInUser && loggedInUser.type === "admin") {
        const { id: userId } = request.params; // get the user id from the route using object destructuring
        // console.log("userId:", userId); // log the userId
        const userCounties = await db.countyStore.getCountiesByUserId(userId);
        // console.log("logged in admin: ", loggedInUser._id);
        counties = userCounties.sort((a, b) => a.county.localeCompare(b.county));
        // console.log("userCounties:", userCounties); // log the result of getUserCounties(
        showAdminOption = true;
        // console.log("one");
      } else {
        return h.redirect("/"); // redirect to home page if user is not an admin
      }
      const viewData = {
        title: "Enviro-Buddy County Dashboard",
        user: loggedInUser,
        counties: counties,
        showAdminOption: showAdminOption,
        messages: request.yar.flash("info")
      };
      // console.log(viewData); // log the viewData object
      
      return h.view("list-admin-counties-view", viewData);
    },
  },
  // This function adds a new county for the logged in user if it does not already exist, and redirects to the county dashboard view
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
        // console.log("newCounty:", newCounty);
    
        // Check if a county with the same userid and county already exists
        const existingCounty = await db.countyStore.getCheckForCounty(newCounty);
        // console.log("addCounty:", existingCounty);
        if (!existingCounty) {
          const createdCounty = await db.countyStore.addCounty(newCounty);
          // console.log("addCounty:", createdCounty);
        }
        if (existingCounty) {
          request.yar.flash("info", "Duplicate county entry"); 
          // If the county already exists, return an error
          return h.redirect("/counties");
          // return h.view("dashboard-view", { title: "Add County error", errors: [{ message: "Duplicate county entry" }] }).takeover().code(400);
        }

        request.yar.flash("info", "County successfully added!");
        return h.redirect("/counties");
      } catch (error) {
        console.error("Error in addCounty handler:", error);
        throw error;
      }
    },
  },
  // This function deletes a specific county by ID and redirects to the county dashboard view
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
  // This function retrieves all dealers for a specific county by ID for the logged in user if they are a brand or an admin, and renders the county view
  allCountiesDealers: {
    handler: async function (request, h) {
      let userId;
      const user = request.auth.credentials;
      if (!user || (user.type !== "admin" && user.type !== "brand")) {
        return h.redirect("/");
      }
  
      const county = await db.countyStore.getCountyById(request.params.id);
      let dealers;
      if (user.type === "brand") {
        dealers = await db.dealerStore.getDealersByCountyId(user._id);
      } else {
        dealers = await db.dealerStore.getAllDealers();
        try {
          userId = await db.countyStore.getUserIdByCountyId(county._id);
        } catch (error) {
          console.error("Error getting user id by county id:", error);
        }
      }

      const viewData = {
        title: "county",
        county: county,
        user: user,
        dealers: dealers,
        userId: userId,
      };

      if (user.type === "admin") {
        return h.view("admin-county-view", viewData);
      }

      return h.view("county-view", viewData);
    },
  },
  // This function retrieves all counties for the logged in user if they are an admin, sorts them alphabetically, and renders the all counties view
  allCounties: {
    handler: async function (request, h) {
      const user = request.auth.credentials;
      if (!user || user.type !== "admin") {
        return h.redirect("/");
      }
  
      let counties = await db.countyStore.getAllCounties();
      counties = counties.sort((a, b) => a.county.localeCompare(b.county));
      const viewData = {
        title: "All Counties",
        counties: counties
      };
  
      return h.view("all-counties-view", viewData);
    },
  },
  // This function adds a new dealer for a specific county by ID for the logged in user, and redirects to the county view
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
      const loggedInUser = request.auth.credentials;
      const newDealer = {
        userid: loggedInUser._id,
        name: request.payload.name,
        address: request.payload.address,
        phone: request.payload.phone,
        email: request.payload.email,
        website: request.payload.website,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
      };
      // console.log(newDealer);
      await db.dealerStore.addDealer(county._id, newDealer);
      return h.redirect(`/county/${county._id}`);
    },
  },
  // This function deletes a specific dealer by ID and redirects to the county view
  deleteDealer: {
    handler: async function (request, h) {
      const user = request.auth.credentials;
      const county = await db.countyStore.getCountyById(request.params.id);
      await db.dealerStore.deleteDealer(request.params.dealerid);
  
      // Check if the user type is admin
      if (user.type === "admin") {
        return h.redirect(`/allcounties/${county._id}`);
      }
  
      return h.redirect(`/county/${county._id}`);
    },
  },
};
