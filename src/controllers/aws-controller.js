import dotenv from "dotenv";
import AWS from "aws-sdk";
import Boom from "@hapi/boom";
import { db } from "../models/db.js";

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

export const awsController = {
    // This function handles the upload of an image to AWS S3, creates a new car type 
    // with the uploaded image URL, and adds the image URL to the dealer's images array
    upload: {
        handler: async (request, h) => {
            // console.log(request.params); // Log the parameters
            // console.log("Here is payload: ", request.payload);
            // console.log("awsController upload handler called");
            const { image, carName, carRange, carType } = request.payload;
            // Get user_id from params
            const { userId } = request.params;
            // Get the current timestamp
            const timestamp = Date.now();
            // Create a unique filename using the timestamp and the original filename
            const uniqueFilename = `${timestamp}-${image.hapi.filename}`;
            // Define the data object with the bucket name, key (unique filename), and body (image data)
            const data = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: uniqueFilename,
                Body: image._data,
            };
            try {
                // Attempt to upload the image to AWS S3
                const result = await s3.upload(data).promise();
                // console.log("Upload successful, image URL:", result.Location);
                
                // Replace https with http in the image URL as AWS serves HTTPS by default
                const httpUrl = result.Location.replace("https://", "http://");

                // Create a new car type
                const newCarType = {
                    userId: userId,
                    carName: carName,
                    carRange: carRange,
                    carType: carType,
                    imageUrl: httpUrl,
                };
                // console.log(newCarType);
                
                // Add the image URL to the dealer's images array
                await db.carTypeStore.createCarType(newCarType);
    
                return h.response({ imageUrl: httpUrl }).code(200);
            } catch (err) {
                console.error("Upload failed:", err);
                 // Return a bad implementation error with the error message
                return Boom.badImplementation("upload failed", err);
            }
        }
    },
    // This function handles the deletion of an image from AWS S3
    deleteImage: {
        handler: async (request, h) => {
            // console.log("awsController delete handler called");
            
            // Extract the filename from the request payload
            const { filename } = request.payload;
            // Define the data object with the bucket name and key (filename)
            const data = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: filename
            };
            try {
                // Attempt to delete the file from AWS S3
                await s3.deleteObject(data).promise();
                // console.log("Delete successful");
                
                return h.response({ message: "Delete successful" }).code(200);
            } catch (err) {
                // console.error("Delete failed:", err);
                
                // Return a bad implementation error with the error message
                return Boom.badImplementation("delete failed", err);
            }
        }
    }
};