// Import the UUID library
import { v4 } from "uuid";

// Import the Firestore database connection
import { db } from "./connect.js";

// Import the dealer Firestore store
import { dealerFirestoreStore } from "./dealer-firestore-store.js";

// Reference to the 'counties' collection in Firestore
const countiesRef = db.collection("counties");

// Define the Firestore store for counties
export const countyFirestoreStore = {
    // Method to get all counties
    async getAllCounties() {
        // Get a snapshot of the 'counties' collection
        const snapshot = await countiesRef.get();
        // Map over the documents in the snapshot and return an array of counties
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    // Method to add a county
    async addCounty(county) {
            // console.log("Starting addCounty with county: ", county);
        // Generate a unique ID
        const uniqueId = v4();
            // console.log("Generated uniqueId: ", uniqueId);
        // Prepare the data to be added
        const data = {
            _id: uniqueId,
            ...county
        };
            // console.log("Data to be added: ", data);
        // Try to add the data to the 'counties' collection
        try {
            await countiesRef.doc(uniqueId).set(data);
            // console.log("Document written with ID: ", uniqueId);
        } catch (error) {
            // Log any errors that occur
            console.error("Error writing document: ", error);
        }
        // Return the added data
        return data;
    },

    // Method to get a county by its ID
    async getCountyById(id) {
        // Check if the ID is a non-empty string
        if (typeof id !== "string" || id.trim() === "") {
            // Log an error message and return null if the ID is invalid
            console.error(`Invalid id: ${id}`);
            return null;
        }
        // Get the document with the given ID
        const doc = await countiesRef.doc(id).get();
        // If the document exists, return the county, otherwise return null
        const county = doc.exists ? { _id: doc.id, ...doc.data() } : null;
        // If the county exists, get its dealers
        if (county) {
            county.dealers = await dealerFirestoreStore.getDealersByCountyId(county._id);
        }
        // Return the county
        return county;
    },

    // Method to check for a county
    async getCheckForCounty(newCounty) {
        // Get a snapshot of the documents where 'userid' and 'county' match the new county
        const snapshot = await countiesRef
            .where("userid", "==", newCounty.userid)
            .where("county", "==", newCounty.county)
            .get();
        // If the snapshot is empty, return null, otherwise return the first matching county
        return snapshot.empty ? null : { _id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    // Method to get counties by user ID
    async getCountiesByUserId(id) {
        // Log that the method ran
        console.log("getCountiesByUserId ran");
        // Get a snapshot of the documents where 'userid' is equal to the given ID
        const snapshot = await countiesRef.where("userid", "==", id).get();
        // If the snapshot is empty, log a message and return an empty array
        if (snapshot.empty) {
          console.log("No matching documents.");
          return [];
        }  
        // Initialize an array to hold the counties
        const counties = [];
        // For each document in the snapshot, add the county to the array
        snapshot.forEach(doc => {
          counties.push({ _id: doc.id, ...doc.data() });
        });
        // Return the array of counties
        return counties;
    },

    // Method to get all unique counties
    async getAllUniqueCounties() {
        // Get a snapshot of the 'counties' collection
        const snapshot = await countiesRef.get();
        // Map over the documents in the snapshot to get an array of counties
        const counties = snapshot.docs.map(doc => doc.data());
        // Filter the array to remove duplicates and sort it alphabetically
        const uniqueCounties = counties
            .filter((county, index, self) =>
                index === self.findIndex((c) => c.county === county.county)
            )
            .sort((a, b) => a.county.localeCompare(b.county));
        // Return the array of unique counties
        return uniqueCounties;
    },

    // Method to find a county
    async findCounty({ userid, county }) {
        // Get a snapshot of the documents where 'userid' and 'county' match the given values
        const snapshot = await countiesRef.where("userid", "==", userid).where("county", "==", county).get();
        // If the snapshot is empty, return null, otherwise return the first matching county
        return snapshot.empty ? null : { _id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    // Method to get user counties
    async getUserCounties(userid) {
        // Get a snapshot of the documents where 'userid' is equal to the given user ID
        const snapshot = await countiesRef.where("userid", "==", userid).get();
        // Map over the documents in the snapshot and return an array of counties
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    // Method to get user ID by county ID
    async getUserIdByCountyId(countyId) {
        // Get the document with the given county ID
        const doc = await countiesRef.doc(countyId).get();
        // If the document exists, return the user ID, otherwise return null
        return doc.exists ? doc.data().userid : null;
    },

    // Method to delete a county by its ID
    async deleteCountyById(_id) {
        // Get a snapshot of the 'counties' collection
        const snapshot = await countiesRef.get();
        // For each document in the snapshot, check if its ID matches the given ID
        snapshot.forEach(async (doc) => {
            const data = doc.data();
            if (data._id === _id) {
                // If the ID matches, delete the document
                await countiesRef.doc(doc.id).delete();
            }
        });
    },

    // Method to delete all counties
    async deleteAllCounties() {
        // Get a snapshot of the 'counties' collection
        const snapshot = await countiesRef.get();
        // Initialize a batch
        const batch = db.batch();
        // For each document in the snapshot, add a delete operation to the batch
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        // Commit the batch
        await batch.commit();
    },
};