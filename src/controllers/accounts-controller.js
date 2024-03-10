import { UserSpec, BrandUserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const accountsController = {
  // This function handles the index route, checking if a user is authenticated 
  // and redirecting to the main page
  index: {
    auth: {
      mode: "try"
    },
    handler: function (request, h) {
      console.log("index handler called");
      const viewData = {};
      if (request.auth.isAuthenticated) {
        console.log("user is authenticated");
        viewData.user = request.auth.credentials;
      } else {
        console.log("user is not authenticated");
      }
      console.log("rendering view");
      // return h.view("main", { title: "Welcome to Enviro-Buddy", ...viewData });
      return h.redirect("/envirobuddy");
    },
  },
  // This function handles the route to show the signup page for regular users
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Enviro-Buddy" });
    },
  },
  // This function handles the route to show the signup page for brand users
  showBrandSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-brand-view", { title: "Sign up for Enviro-Buddy" });
    },
  },
  // This function handles the signup process for regular users
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      // pass "user" as the user type
      await db.userStore.addUser(user, "user");
      return h.redirect("/");
    },
  },
  // This function handles the signup process for brand users
  brandSignup: {
    auth: false,
    validate: {
      payload: BrandUserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-brand-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      console.log("user: ", user);
      // pass "brand" as the user type
      await db.userStore.addUser(user, "brand");
      return h.redirect("/");
    },
  },
  // This function handles the route to show the login page
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Enviro-Buddy" });
    },
  },
  // This function handles the login process, checking user credentials and redirecting based on user type
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/login");
      }
      request.cookieAuth.set({ id: user._id });
  
      // Check if the user type is admin
      if (user.type === "admin") {
        return h.redirect("/admindashboard");
      }
      // Check if the user type is brand
      if (user.type === "brand") {
          return h.redirect("/dashboard");
      }
      // fall back to all other users
      return h.redirect("/envirobuddy");
      },
  },
  // This function handles the logout process, clearing the user session and redirecting to the main page
  logout: {
    handler: function (request, h) {
      console.log("logout handler called");
      request.cookieAuth.clear();
      console.log("cookie cleared");
      return h.redirect("/");
    },
  },

  // This function validates a user session by checking if the user exists in the database
  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
