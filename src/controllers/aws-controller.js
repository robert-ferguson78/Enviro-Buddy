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
    upload: {
        handler: async (request, h) => {
            console.log(request.params); // Log the parameters
            console.log("Here is payload: ", request.payload); // Log the payload
    
            console.log("awsController upload handler called");
            const { image, carName, carRange, carType } = request.payload;
            const { userId } = request.params; // Get user_id from params
            const timestamp = Date.now();
            const uniqueFilename = `${timestamp}-${image.hapi.filename}`;
            const data = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: uniqueFilename,
                Body: image._data,
            };
            try {
                const result = await s3.upload(data).promise();
                console.log("Upload successful, image URL:", result.Location);
                const httpUrl = result.Location.replace("https://", "http://");

                // Create a new car type
                const newCarType = {
                    userId: userId,
                    carName: carName,
                    carRange: carRange,
                    carType: carType,
                    imageUrl: httpUrl,
                };
  
                console.log(newCarType);
                // Add the image URL to the dealer's images array
                await db.carTypeStore.createCarType(newCarType);
    
                return h.response({ imageUrl: httpUrl }).code(200);
            } catch (err) {
                console.error("Upload failed:", err);
                return Boom.badImplementation("upload failed", err);
            }
        }
    },
    delete: {
        handler: async (request, h) => {
            console.log("awsController delete handler called");
            const { filename } = request.payload;
            const data = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: filename
            };
            try {
                await s3.deleteObject(data).promise();
                console.log("Delete successful");
                return h.response({ message: "Delete successful" }).code(200);
            } catch (err) {
                console.error("Delete failed:", err);
                return Boom.badImplementation("delete failed", err);
            }
        }
    }
};