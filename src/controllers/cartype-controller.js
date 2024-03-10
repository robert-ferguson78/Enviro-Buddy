import dotenv from "dotenv";
import AWS from "aws-sdk";
import Boom from "@hapi/boom";
import { EditCarTypeSpec } from "../models/joi-schemas.js";
import { awsController } from "./aws-controller.js";
import { db } from "../models/db.js";

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

export const carTypeController = {
  // This function retrieves all car types for the logged in user if they are a brand, sorts them alphabetically, 
  // and renders the car type dashboard view
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      let userCarTypes;
      let carTypes;
      if (loggedInUser && loggedInUser.type === "brand") {
        userCarTypes = await db.carTypeStore.getCarTypesByBrandId(loggedInUser._id);
        // Sort the carTypes array alphabetically by the 'name' property
        carTypes = userCarTypes.sort((a, b) => a.carName.localeCompare(b.carName));
      } else {
        carTypes = await db.carTypeStore.findCarType();
        carTypes = userCarTypes.sort((a, b) => a.carName.localeCompare(b.carName));
      }
      const viewData = {
        title: "Enviro-Buddy CarType Dashboard",
        user: loggedInUser,
        carTypes: carTypes,
        messages: request.yar.flash("info")
      };
      // console.log("carTypes is here:", carTypes);
      return h.view("list-brand-car-types-view", viewData);
    },
  },
  // This function retrieves a specific car type by ID, checks if the logged in user is a brand 
  // and retrieves the car type if they are, and renders the car type view
  editCarType: {
    handler: async function (request, h) {
      console.log("editCarType handler called");
      const cartype = await db.carTypeStore.findByIdCarType(request.params.id);
      const loggedInUser = request.auth.credentials;
      let carTypes;
      if (loggedInUser && loggedInUser.type === "brand") {
        carTypes = await db.carTypeStore.findByIdCarType(cartype.id);
        // Sort the carTypes array alphabetically by the 'name' property
      } else {
        carTypes = await db.carTypeStore.findCarType();
      }
      const viewData = {
        title: "Enviro-Buddy CarType Dashboard",
        user: loggedInUser,
        carTypes: carTypes,
        messages: request.yar.flash("info")
      };
      // console.log("carTypes is here2:", carTypes);
      return h.view("cartype-view", viewData);
    },
  },
  // This function updates a specific car type by ID with the provided data, 
  // uploads a new image to AWS S3 if provided and deletes the old image, and returns the new image URL
  updateCarType: {
    handler: async (request, h) => {
        // console.log(request.params); // Log the parameters
        // console.log("Here is payload: ", request.payload); // Log the payload

        // console.log("awsController updateCarType handler called");
        const { image, carName, carRange, carType } = request.payload;
        const { id } = request.params; // Get car type id from params
        const foundCarType = await db.carTypeStore.findByIdCarType(id);

        // Update the car type
        const updatedCarType = {
            carName: carName,
            carRange: carRange,
            carType: carType,
        };
        try {
        // Check if an image object exists in the request
        if (typeof image === "object" && image !== null) {
            // console.log("Image object:", image);
            // // Get the current timestamp
            const timestamp = Date.now();
            // Create a unique filename using the timestamp and the original filename
            const uniqueFilename = `${timestamp}-${image.hapi.filename}`;

            // Define the data object with the bucket name, key (unique filename), and body (image data)
            const data = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: uniqueFilename,
                Body: image._data,
            };

            // Delete the old image from the S3 bucket, Check if the car type already has an image URL
            if (foundCarType.imageUrl) {
              // Extract the old image key from the image URL
              let oldImageKey = foundCarType.imageUrl.split("/").pop();
              // Decode the old image key
              oldImageKey = decodeURIComponent(oldImageKey);
              // Define the delete parameters with the bucket name and old image key
              const deleteParams = {
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: oldImageKey
              };
              // console.log("Old image key:", oldImageKey);
              try {
                  await s3.deleteObject(deleteParams).promise();
                  // console.log("Old image deleted successfully");
              } catch (err) {
                  console.error("Error deleting image:", err);
              }
            }
            
            try {
                // Attempt to upload the new image to AWS S3
                const result = await s3.upload(data).promise();
                // console.log("Upload successful, image URL:", result.Location);

                // Replace https with http in the image URL as AWS loads image in https by default
                const httpUrl = result.Location.replace("https://", "http://");

                // Only update the image URL if it has been changed
                if (httpUrl !== foundCarType.imageUrl) {
                    updatedCarType.imageUrl = httpUrl;
                }
            } catch (err) {
                console.error("Image upload failed:", err);
                return Boom.badImplementation("Image upload failed", err);
            }
        }
      } catch (err) {
        console.error("Error handling image:", err);
    }
        // console.log(updatedCarType);
        
        // Update the car type in the database
        try {
            await db.carTypeStore.updateCarType(id, updatedCarType);
            return h.response({ imageUrl: updatedCarType.imageUrl }).code(200);
        } catch (err) {
            console.error("Update failed:", err);
            return Boom.badImplementation("update failed", err);
        }
    }
  },

  // updateCarType: {
  //   validate: {
  //     payload: EditCarTypeSpec,
  //     options: { abortEarly: false },
  //     failAction: function (request, h, error) {
  //       return h.view("list-brand-car-types-view", { title: "Edit Car Type error", errors: error.details }).takeover().code(400);
  //     },
  //   },
  //   handler: async function (request, h) {
  //     const cartype = await db.carTypeStore.findByIdCarType(request.params.id);
  //       console.log(cartype);
  //     const newCarType = {
  //     carName: request.payload.carName,
  //     carRange: request.payload.carRange,
  //     carType: request.payload.carType,
  //     imagUrl: request.payload.imagUrl,
  //     website: request.payload.website,
  //     };
  //     await db.carTypeStore.updateCarType(cartype, newCarType);
  //     return h.redirect(`/cartype/editcartype/${request.params.id}`);
  //   },
  // },

  // This function deletes a specific car type by ID and redirects to the car type dashboard view
  deleteCarType: {
    handler: async function (request, h) {
      const cartype = await db.carTypeStore.findByIdCarType(request.params.id);
      // console.log(cartype);
      // console.log(cartype.id);
      await db.carTypeStore.deleteCarType(cartype.id);
      return h.redirect("/cartype");
    },
  },
};
