// Import the UUID library for generating unique IDs
import { v4 } from "uuid";

// Import the database utility functions
import { db } from "./store-utils.js";

// Import the dealer JSON store
import { dealerJsonStore } from "./dealer-json-store.js";

// Define the JSON store for counties
export const countyJsonStore = {
    // Method to get all counties
    async getAllCounties() {
        // Read the current state of the database
        await db.read();
        // Return the array of counties
        return db.data.counties;
    },

    // Method to add a county
    async addCounty(county) {
        // Read the current state of the database
        await db.read();
        // Generate a unique ID for the new county
        county._id = v4();
        // Add the new county to the array of counties
        db.data.counties.push(county);
        // Write the updated state to the database
        await db.write();
        // Return the new county
        return county;
    },

    // Method to get a county by its ID
    async getCountyById(id) {
        // Read the current state of the database
        await db.read();
        // Find the county with the given ID
        let list = db.data.counties.find((county) => county._id === id);
        // If the county was found, get its dealers
        if (list) {
            list.dealers = await dealerJsonStore.getDealersByCountyId(list._id);
        } else {
            // If the county was not found, set the list to null
            list = null;
        }
        // Return the county or null
        return list;
    },

    // Method to get all unique counties
    async getAllUniqueCounties() {
        // Read the current state of the database
        await db.read();
        // Filter the counties to get only unique ones and sort them
        return db.data.counties
            .filter((county, index, self) =>
                index === self.findIndex((c) => c.county === county.county)
            )
            .sort((a, b) => a.county.localeCompare(b.county));
    },

    // Method to find a county by user ID and county name
    async findCounty({ userid, county }) {
        // Read the current state of the database
        await db.read();
        // Find and return the county with the given user ID and county name
        return db.data.counties.find(c => c.userid === userid && c.county === county);
    },

    // Method to get all counties of a user
    async getUserCounties(userid) {
        // Read the current state of the database
        await db.read();
        // Filter the counties by the given user ID and return the array
        return db.data.counties.filter((county) => county.userid === userid);
    },

    // Method to get the user ID of a county by its ID
    async getUserIdByCountyId(countyId) {
        // Read the current state of the database
        await db.read();
        // Find the county with the given ID
        const foundCounty = db.data.counties.find((county) => county._id === countyId);
        // If the county was found, return its user ID, otherwise return null
        return foundCounty ? foundCounty.userid : null;
    },

    // Method to delete a county by its ID
    async deleteCountyById(id) {
        // Read the current state of the database
        await db.read();
        // Find the index of the county with the given ID
        const index = db.data.counties.findIndex((county) => county._id === id);
        // If the county was found, remove it from the array of counties
        if (index !== -1) db.data.counties.splice(index, 1);
        // Write the updated state to the database
        await db.write();
    },

    // Method to delete all counties
    async deleteAllCounties() {
        // Set the array of counties to an empty array
        db.data.counties = [];
        // Write the updated state to the database
        await db.write();
    },
};