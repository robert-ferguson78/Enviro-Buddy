import { db } from "../models/db.js";

export const userController = {
    index: {
        handler: async function (request, h) {
            const dealers = await db.dealerStore.getAllDealers();
            const viewData = {
            dealers: dealers,
            // Add other view data here if needed
            };
            console.log(viewData);
            return h.view("envirobuddy-view", viewData);
        },
    },
  
};