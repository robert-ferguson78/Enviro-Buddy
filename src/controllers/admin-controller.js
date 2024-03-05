import { db } from "../models/db.js";

export const adminController = {
    index: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            console.log("adminController.index");
            // console.log(request.user);
            if (loggedInUser.type !== "admin") {
            return h.redirect("/");
            }
            // console.log("adminController.index");

            const allUsers = await db.userStore.getAllUsers();
            const brandUsers = allUsers.filter(user => user.type === "brand");
            const normalUsers = allUsers.filter(user => user.type === "user");

            const viewData = {
            brandUsers,
            normalUsers,
            };

            return h.view("admin-view", viewData);
        },
    },
    removeUser: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            console.log("remove user");
            if (loggedInUser.type !== "admin") {
                return h.redirect("/");
            }
    
            const userId = request.params.id;
            await db.userStore.deleteUserById(userId);

            return h.redirect("/admindashboard");
        },
    },
};
