import { EditCarTypeSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const carTypeController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      let userCarTypes;
      let carTypes;
      if (loggedInUser && loggedInUser.type === "brand") {
        userCarTypes = await db.carTypeStore.getCarTypesByBrandId(loggedInUser._id);
        // Sort the carTypes array alphabetically by the 'name' property
        carTypes = userCarTypes.sort((a, b) => a.carName.localeCompare(b.carName));
      } else {
        carTypes = await db.carTypeStore.findCarType();
        carTypes = userCarTypes.sort((a, b) => a.carName.localeCompare(b.carName));
      }
      const viewData = {
        title: "Enviro-Buddy CarType Dashboard",
        user: loggedInUser,
        carTypes: carTypes,
        messages: request.yar.flash("info")
      };
      console.log("carTypes:", carTypes);
      return h.view("list-brand-car-types-view", viewData);
    },
  },

  updateCarType: {
    validate: {
      payload: EditCarTypeSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Edit Car Type error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const cartype = await db.carTypeStore.findByIdCarType(request.params.cartypeid);
        console.log(cartype);
      const newCarType = {
      name: request.payload.name,
      address: request.payload.address,
      phone: request.payload.phone,
      email: request.payload.email,
      website: request.payload.website,
      latitude: request.payload.latitude,
      longitude: request.payload.longitude
      };
      await db.carTypeStore.updateCarType(cartype, newCarType);
      return h.redirect(`/cartype/editcartype/${request.params.cartypeid}`);
    },
  },

  deleteCarType: {
    handler: async function (request, h) {
      const cartype = await db.carTypeStore.getCountyById(request.params.id);
      await db.carTypeStore.deleteDealer(request.params.dealerid);
      return h.redirect(`/cartype/${cartyoe._id}`);
    },
  },
};
