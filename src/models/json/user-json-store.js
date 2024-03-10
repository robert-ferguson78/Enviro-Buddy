// Import the UUID library for generating unique IDs
import { v4 } from "uuid";

// Import the database utility functions
import { db } from "./store-utils.js";

// Define the JSON store for users
export const userJsonStore = {
  // Method to get all users
  async getAllUsers() {
    // Read the current state of the database
    await db.read();
    // Return the array of users
    return db.data.users;
  },

  // Method to add a user
  async addUser(user, userType) {
    // Read the current state of the database
    await db.read();
    // Generate a unique ID for the new user
    user._id = v4();
    // Assign the user type to the user
    user.type = userType;
    // Add the new user to the array of users
    db.data.users.push(user);
    // Write the updated state to the database
    await db.write();
    // Return the new user
    return user;
  },

  // Method to get a user by its ID
  async getUserById(id) {
    // Read the current state of the database
    await db.read();
    // Find the user with the given ID
    let u = db.data.users.find((user) => user._id === id);
    // If the user was not found, set the user to null
    if (u === undefined) u = null;
    // Return the user or null
    return u;
  },

  // Method to get a user by its email
  async getUserByEmail(email) {
    // Read the current state of the database
    await db.read();
    // Find the user with the given email
    let u = db.data.users.find((user) => user.email === email);
    // If the user was not found, set the user to null
    if (u === undefined) u = null;
    // Return the user or null
    return u;
  },

  // Method to get all brand names
  async getAllBrandNames() {
    // Read the current state of the database
    await db.read();
    // Filter the users to get only the ones with type "brand"
    // Map the filtered users to get their brand names
    const brandNames = db.data.users
      .filter(user => user.type === "brand")
      .map(user => user.brandName);
    // Return the array of brand names
    return brandNames;
  },

  // Method to delete a user by its ID
  async deleteUserById(id) {
    // Read the current state of the database
    await db.read();
    // Find the index of the user with the given ID
    const index = db.data.users.findIndex((user) => user._id === id);
    // If the user was found, remove it from the array of users
    if (index !== -1) db.data.users.splice(index, 1);
    // Write the updated state to the database
    await db.write();
  },

  // Method to delete all users
  async deleteAll() {
    // Set the array of users to an empty array
    db.data.users = [];
    // Write the updated state to the database
    await db.write();
  },
};