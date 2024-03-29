import Joi from "joi";
import { CarTypeSpec } from "./models/joi-schemas.js";
import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { countyController } from "./controllers/county-controller.js";
import { dealerController } from "./controllers/dealer-controller.js";
import { awsController } from "./controllers/aws-controller.js";
import { carTypeController } from "./controllers/cartype-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { userController } from "./controllers/user-controller.js";

console.log(awsController);

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/brandsignup", config: accountsController.showBrandSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/registerbrand", config: accountsController.brandSignup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  { method: "GET", path: "/profile", config: accountsController.profile },
  { method: "POST", path: "/updateuser/{id}", config: accountsController.updateProfile },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/envirobuddy", config: userController.index },
  { method: "GET", path: "/envirobuddy/carcounty/", config: userController.carCounty },
  { method: "GET", path: "/envirobuddy/carbrand/", config: userController.carBrand },
  { method: "GET", path: "/envirobuddy/carbodytype/", config: userController.bodyType },
  
  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "GET", path: "/brandcounties/{id}", config: countyController.adminIndex },
  { method: "GET", path: "/counties", config: countyController.index },
  { method: "POST", path: "/county/addcounty", config: countyController.addCounty },
  { method: "GET", path: "/county/{id}", config: countyController.allCountiesDealers },
  { method: "GET", path: "/county/deletecounty/{id}", config: countyController.deleteCounty },

  { method: "GET", path: "/allcounties", config: countyController.allCounties },
  { method: "GET", path: "/allcounties/{id}", config: countyController.allCountiesDealers },
  { method: "POST", path: "/county/{id}/adddealer", config: countyController.addDealer },
  { method: "GET", path: "/county/{id}/deletedealer/{dealerid}", config: countyController.deleteDealer },

  { method: "GET", path: "/dealer/{id}/editdealer/{dealerid}", config: dealerController.index },
  { method: "POST", path: "/dealer/{id}/updatedealer/{dealerid}", config: dealerController.update },

  { method: "GET", path: "/cartype", config: carTypeController.index },
  { method: "GET", path: "/cartype/{id}", config: carTypeController.editCarType },
  // { method: "POST", path: "/editcartype/{id}", config: carTypeController.updateCarType },
  { method: "GET", path: "/cartype/deletecartype/{id}", config: carTypeController.deleteCarType },
  
  { method: "POST", 
    path: "/editcartype/{id}",
    handler: carTypeController.updateCarType.handler, // Handler function for updating a car type
    options: {
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data", // Allow multipart form data
        multipart: true
      },
      validate: {
        payload: Joi.object({ // Validation for the payload
          image: Joi.any(), // Image is required and can be any type
          carName: CarTypeSpec.carName,
          carRange: CarTypeSpec.carRange,
          carType: CarTypeSpec.carType
        })
      },
    },
  },

  { method: "POST", 
    path: "/upload/{userId}",
    handler: awsController.upload.handler, // Handler function for uploading a car type
    options: {
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data", // Allow multipart form data
        multipart: true
      },
      validate: {
        payload: Joi.object({ // Validation for the payload
          image: Joi.any().required(), // Image is required and can be any type
          carName: CarTypeSpec.carName,
          carRange: CarTypeSpec.carRange,
          carType: CarTypeSpec.carType
        })
      },
    },
  },
  { method: "DELETE", 
    path: "/delete", 
    handler: awsController.deleteImage.handler, // Handler function for deleting an image
    options: {
      auth: false
    }
  },

  { method: "GET", path: "/admindashboard", config: adminController.index },
  { method: "GET", path: "/user/profile/{id}", config: adminController.profile },
  { method: "POST", path: "/user/updateuser/{id}", config: adminController.updateProfile },
  { method: "GET", path: "/removeuser/{id}", config: adminController.removeUser },

  // Add pblic folder for CSS and favicon
  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },

];