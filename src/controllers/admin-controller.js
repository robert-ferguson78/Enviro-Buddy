import { db } from "../models/db.js";
import { getAnalyticsByBrand } from "../utils/analytics.js";

export const adminController = {
    index: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            // console.log("adminController.index");
            if (loggedInUser.type !== "admin") {
                return h.redirect("/");
            }

            const allUsers = await db.userStore.getAllUsers();
            const brandUsers = allUsers.filter(user => user.type === "brand");
            const normalUsers = allUsers.filter(user => user.type === "user");

            // Call the getAnalyticsByBrand function
            // const analyticsByBrand = await getAnalyticsByBrand();

            const viewData = {
                brandUsers,
                normalUsers,
                // analyticsByBrand,
            };
            // console.log("analytocs brand info: ", analyticsByBrand);
            return h.view("admin-view", viewData);
        },
    },
    removeUser: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            // console.log("remove user");
            if (loggedInUser.type !== "admin") {
                return h.redirect("/");
            }
    
            const userId = request.params.id;
            await db.userStore.deleteUserById(userId);

            return h.redirect("/admindashboard");
        },
    },
};
