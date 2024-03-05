import { UserSpec, BrandUserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const accountsController = {
  index: {
    auth: {
      mode: "try"
    },
    handler: function (request, h) {
      const viewData = {
        user: request.auth.credentials,
      };
      return h.view("main", { title: "Welcome to Enviro-Buddy" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Enviro-Buddy" });
    },
  },
  showBrandSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-brand-view", { title: "Sign up for Enviro-Buddy" });
    },
  },
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
  brandSignup: {
    auth: false,
    validate: {
      payload: BrandUserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      // pass "brand" as the user type
      await db.userStore.addUser(user, "brand");
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Enviro-Buddy" });
    },
  },
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
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
  
      // Check if the user type is admin
      if (user.type === "admin") {
        return h.redirect("/admindashboard");
      }
  
      return h.redirect("/dashboard");
    },
  },
  logout: {
    handler: function (request, h) {
      console.log("logout handler called");
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
