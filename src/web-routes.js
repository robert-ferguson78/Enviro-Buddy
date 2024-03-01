import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { countyController } from "./controllers/county-controller.js";
import { dealerController } from "./controllers/dealer-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/brandsignup", config: accountsController.showBrandSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/registerbrand", config: accountsController.brandSignup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addcounty", config: dashboardController.addCounty },
  { method: "GET", path: "/dashboard/deletecounty/{id}", config: dashboardController.deleteCounty },

  { method: "GET", path: "/allcounties", config: countyController.allCounties },
  { method: "GET", path: "/allcounties/{id}", config: countyController.allCountiesDealers },
  { method: "GET", path: "/county/{id}", config: countyController.index },
  { method: "POST", path: "/county/{id}/adddealer", config: countyController.addDealer },
  { method: "GET", path: "/county/{id}/deletedealer/{dealerid}", config: countyController.deleteDealer },

  { method: "GET", path: "/dealer/{id}/editdealer/{dealerid}", config: dealerController.index },
  { method: "POST", path: "/dealer/{id}/updatedealer/{dealerid}", config: dealerController.update },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];