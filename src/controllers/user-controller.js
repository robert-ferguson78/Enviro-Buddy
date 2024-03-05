import { db } from "../models/db.js";

export const userController = {
    index: {
        handler: async function (request, h) {
            const dealers = await db.dealerStore.getAllDealers();
            console.log("Dealers:", dealers);
            const brandNames = await db.userStore.getAllBrandNames();
            console.log("Brand Names:", brandNames);
            const counties = await db.countyStore.getAllUniqueCounties();
            console.log("Counties:", JSON.stringify(counties, null, 2));
            const carBodyTypes = await db.carTypeStore.getAllCarBodyTypes();
            console.log("Car Body Types:", carBodyTypes);

            const viewData = {
                dealers: dealers,
                brandNames: brandNames,
                counties: counties,
                carBodyTypes: carBodyTypes
            };

            console.log(viewData);
            return h.view("envirobuddy-view", viewData);
        },
    },
};