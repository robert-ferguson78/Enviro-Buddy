import { userApi } from "./api/user-api.js";
// import { countyApi } from "./api/county-api.js";
// import { dealerApi } from "./api/dealer-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

//   { method: "POST", path: "/api/counties", config: countyApi.create },
//   { method: "DELETE", path: "/api/counties", config: countyApi.deleteAll },
//   { method: "GET", path: "/api/counties", config: countyApi.find },
//   { method: "GET", path: "/api/counties/{id}", config: countyApi.findOne },
//   { method: "DELETE", path: "/api/counties/{id}", config: countyApi.deleteOne },

  // { method: "GET", path: "/api/dealers", config: dealerApi.find },
  // { method: "GET", path: "/api/dealers/{id}", config: dealerApi.findOne },
  // { method: "POST", path: "/api/counties/{id}/dealers", config: dealerApi.create },
  // { method: "DELETE", path: "/api/dealers", config: dealerApi.deleteAll },
  // { method: "DELETE", path: "/api/dealers/{id}", config: dealerApi.deleteOne },

{ method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
];
