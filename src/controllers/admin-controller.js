import { db } from "../models/db.js";
import { UserSpecUpdate } from "../models/joi-schemas.js";
import { getAnalyticsByBrand } from "../utils/analytics.js";

export const adminController = {
    // function to get all users
    index: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            // console.log("adminController.index");
            if (loggedInUser.type !== "admin") {
                return h.redirect("/");
            }

            // Filter the users by type
            const allUsers = await db.userStore.getAllUsers();
            const brandUsers = allUsers.filter(user => user.type === "brand");
            const normalUsers = allUsers.filter(user => user.type === "user");

            // Call the getAnalyticsByBrand function
            const analyticsByBrand = await getAnalyticsByBrand();

            const viewData = {
                brandUsers,
                normalUsers,
                analyticsByBrand,
            };
                // console.log("analytocs brand info: ", analyticsByBrand);
            return h.view("admin-view", viewData);
        },
    },
    // Function to remove a user
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
      // function to show the profile view
      profile: {
        handler: async function (request, h) {
          const loggedInUser = request.auth.credentials;
      
          // Check if the logged in user is an admin
          if (loggedInUser.type !== "admin") {
            return h.redirect("/"); // Redirect non-admin users to home page
          }
      
          const userId = request.params.id;
            // console.log("userId: ", userId);
          const userDetails = await db.userStore.getUserById(userId);
            // console.log("user: ", userDetails); 
          const viewData = {
            title: "Enviro-Buddy County Dashboard",
            userDetails: userDetails,
            messages: request.yar.flash("info")
          };
          console.log("viewData: ", viewData);
          return h.view("admin-profile-view", viewData);
        },
      },
    // This function handles user profile updates
    updateProfile: {
        validate: {
            payload: UserSpecUpdate,
            options: { abortEarly: false },
            failAction: function (request, h, error) {
            return h.view("admin-profile-view", { title: "Profile Page", errors: error.details }).takeover().code(400);
            },
        },
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            const userId = request.params.id;
            const newUserData = request.payload; 
            // console.log("newUserData: ", newUserData);
            try {
            await db.userStore.adminUpdateUser(userId, newUserData);
                // console.log("did we get here?");
            } catch (error) {
                // console.error("Error updating user: ", error);
            }
            request.yar.flash("info", "Profile updated successfully");
            return h.redirect(`/user/profile/${userId}`);
        },
    },
};
