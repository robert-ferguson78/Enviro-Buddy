// Import the UUID library for generating unique IDs
import { v4 } from "uuid";

// Import the database utility functions
import { db } from "./store-utils.js";

// Define the JSON store for car types
export const carTypeJsonStore = {
  // Method to find all car types
  async findCarType() {
    // Read the current state of the database
    await db.read();
    // Return the array of car types
    return db.data.carTypes;
  },

  // Method to find a car type by its ID
  async findByIdCarType(id) {
    // Read the current state of the database
    await db.read();
    // Find and return the car type with the given ID
    return db.data.carTypes.find(carType => carType.id === id);
  },

  // Method to get all car types by a brand ID
  async getCarTypesByBrandId(brandId) {
    // Read the current state of the database
    await db.read();
    // Filter the car types by the given brand ID and return the array
    const carTypes = db.data.carTypes.filter(carType => carType.userId === brandId);
    return carTypes;
  },

  // Method to get all unique car body types
  async getAllCarBodyTypes() {
    // Read the current state of the database
    await db.read();
    // Map over the car types and get the car body type of each one
    // Use a Set to remove duplicates and return the array of unique car body types
    const carBodyTypes = [...new Set(db.data.carTypes.map(carType => carType.carType))];
    return carBodyTypes;
  },

  // Method to create a new car type
  async createCarType(carType) {
    // Read the current state of the database
    await db.read();
    // Generate a unique ID for the new car type
    carType.id = v4();
    // Add the new car type to the array of car types
    db.data.carTypes.push(carType);
    // Write the updated state to the database
    await db.write();
    // Return the new car type
    return carType;
  },

  // Method to update a car type
  async updateCarType(id, updatedCarType) {
    // Read the current state of the database
    await db.read();
    // Find the car type with the given ID
    const foundCarType = db.data.carTypes.find(ct => ct.id === id);
    // If the car type was not found, throw an error
    if (!foundCarType) {
      throw new Error("CarType not found");
    }
    // Merge the updated car type with the existing one
    Object.assign(foundCarType, updatedCarType);
    // Write the updated state to the database
    await db.write();
    // Return the updated car type
    return foundCarType;
  },

  // Method to delete a car type
  async deleteCarType(id) {
    // Read the current state of the database
    await db.read();
    // Find the index of the car type with the given ID
    const index = db.data.carTypes.findIndex(carType => carType.id === id);
    // If the car type was not found, throw an error
    if (index === -1) {
      throw new Error("CarType not found");
    }
    // Remove the car type from the array of car types
    db.data.carTypes.splice(index, 1);
    // Write the updated state to the database
    await db.write();
  }
};