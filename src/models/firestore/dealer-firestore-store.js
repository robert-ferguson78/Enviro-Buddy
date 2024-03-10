// Import the Firestore database connection
import { db } from "./connect.js";

// Reference to the 'dealers' collection in Firestore
const dealersRef = db.collection("dealers");

// Define the Firestore store for dealers
export const dealerFirestoreStore = {
    // Method to get all dealers
    async getAllDealers() {
        // Get a snapshot of the 'dealers' collection
        const snapshot = await dealersRef.get();
        // Map over the documents in the snapshot and return an array of dealers
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    // Method to add a dealer
    async addDealer(countyId, dealer) {
        // Assign the county ID to the dealer
        dealer.countyId = countyId;
            // console.log("Dealer to be added: ", dealer);
        // Add the dealer to the 'dealers' collection and get a reference to the document
        const docRef = await dealersRef.add(dealer);
        // Return the added dealer
        return { _id: docRef.id, ...dealer };
    },

    // Method to add an image to a dealer
    async addImageToDealer(id, imageUrl) {
        // Get the document with the given ID
        const doc = await dealersRef.doc(id).get();
        // If the document does not exist, throw an error
        if (!doc.exists) {
            throw new Error("Dealer not found");
        }
        // Get the dealer data
        const dealer = doc.data();
        // If the dealer does not have an 'images' property, initialize it as an empty array
        if (!dealer.images) {
            dealer.images = [];
        }
        // Add the image URL to the 'images' array
        dealer.images.push(imageUrl);
        // Update the dealer document with the new data
        await dealersRef.doc(id).update(dealer);
    },

    // Method to get dealers by county ID
    async getDealersByCountyId(id) {
        // Get a snapshot of the documents where 'countyId' is equal to the given ID
        const snapshot = await dealersRef.where("countyId", "==", id).get();
        // Map over the documents in the snapshot and return an array of dealers
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    // Method to get a dealer by its ID
    async getDealerById(id) {
        // Get the document with the given ID
        const doc = await dealersRef.doc(id).get();
        // If the document exists, return the dealer, otherwise return null
        return doc.exists ? { _id: doc.id, ...doc.data() } : null;
    },

    // Method to delete a dealer by its ID
    async deleteDealer(id) {
        // Get a snapshot of the documents where '_id' is equal to the given ID
        const snapshot = await dealersRef.where("_id", "==", id).get();
        // If the snapshot is not empty, delete the first document
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await doc.ref.delete();
        } else {
            // If the snapshot is empty, log a message
            console.log(`No dealer found with _id: ${id}`);
        }
    },

    // Method to delete all dealers
    async deleteAllDealers() {
        // Get a snapshot of the 'dealers' collection
        const snapshot = await dealersRef.get();
        // Initialize a batch
        const batch = db.batch();
        // For each document in the snapshot, add a delete operation to the batch
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        // Commit the batch
        await batch.commit();
    },

    // Method to update a dealer
    async updateDealer(id, updatedDealer) {
        // Update the document with the given ID with the updated dealer data
        await dealersRef.doc(id).update(updatedDealer);
    },
};