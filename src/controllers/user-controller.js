import { db } from "../models/db.js";

export const userController = {
  index: {
    handler: async function (request, h) {
      const viewData = {
        // Define your view data here
      };
      console.log(viewData);
      return h.view("envirobuddy-view", viewData);
    },
  },
  
};