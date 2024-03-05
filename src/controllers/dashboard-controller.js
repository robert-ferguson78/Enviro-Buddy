import { CountySpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const viewData = {
        // Define your view data here
      };
      console.log(viewData);
      return h.view("dashboard-view", viewData);
    },
  },
  
  // deleteCarType: {
  //   handler: async function (request, h) {
  //       // console.log("delete" + request.params.id);
  //     const cartype = await db.carTypeStore.getCarTypeById(request.params.id);
  //       // console.log("delete2");
  //     await db.carTypeStore.deleteCarTypeById(cartype._id);
  //       // console.log("delete3");
  //     return h.redirect("/dashboard");
  //   },
  // },
};
