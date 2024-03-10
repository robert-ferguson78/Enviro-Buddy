// Import the UUID library for generating unique IDs
import { v4 } from "uuid";

// Import the database utility functions
import { db } from "./store-utils.js";

// Define the JSON store for dealers
export const dealerJsonStore = {
  // Method to get all dealers
  async getAllDealers() {
    // Read the current state of the database
    await db.read();
    // Return the array of dealers
    return db.data.dealers;
  },

  // Method to add a dealer
  async addDealer(countyId, dealer) {
    // Read the current state of the database
    await db.read();
    // Generate a unique ID for the new dealer
    dealer._id = v4();
    // Assign the county ID to the dealer
    dealer.countyId = countyId;
    // Add the new dealer to the array of dealers
    db.data.dealers.push(dealer);
    // Write the updated state to the database
    await db.write();
    // Return the new dealer
    return dealer;
  },

  // Method to add an image to a dealer
  async addImageToDealer(id, imageUrl) {
    // Read the current state of the database
    await db.read();
    // Find the dealer with the given ID
    const foundDealer = db.data.dealers.find((dealer) => dealer._id === id);
    // If the dealer was not found, throw an error
    if (!foundDealer) {
        throw new Error("Dealer not found");
    }
    // If the dealer does not have an images array, create one
    if (!foundDealer.images) {
        foundDealer.images = [];
    }
    // Add the image URL to the dealer's images array
    foundDealer.images.push(imageUrl);
    // Write the updated state to the database
    await db.write();
  },

  // Method to get all dealers in a county
  async getDealersByCountyId(id) {
    // Read the current state of the database
    await db.read();
    // Filter the dealers by the given county ID and return the array
    return db.data.dealers.filter((dealer) => dealer.countyId === id);
  },

  // Method to get a dealer by its ID
  async getDealerById(id) {
    // Read the current state of the database
    await db.read();
    // Find and return the dealer with the given ID
    return db.data.dealers.find((dealer) => dealer._id === id);
  },

  // Method to delete a dealer
  async deleteDealer(id) {
    // Read the current state of the database
    await db.read();
    // Find the index of the dealer with the given ID
    const index = db.data.dealers.findIndex((dealer) => dealer._id === id);
    // Remove the dealer from the array of dealers
    db.data.dealers.splice(index, 1);
    // Write the updated state to the database
    await db.write();
  },

  // Method to delete all dealers
  async deleteAllDealers() {
    // Set the array of dealers to an empty array
    db.data.dealers = [];
    // Write the updated state to the database
    await db.write();
  },

  // Method to update a dealer
  async updateDealer(dealer, updatedDealer) {
    // Update the dealer's properties with the new values
    dealer.name = updatedDealer.name;
    dealer.address = updatedDealer.address;
    dealer.phone = updatedDealer.phone;
    dealer.email = updatedDealer.email;
    dealer.website = updatedDealer.website;
    dealer.latitude = updatedDealer.latitude;
    dealer.longitude = updatedDealer.longitude;
    // Write the updated state to the database
    await db.write();
  },
};