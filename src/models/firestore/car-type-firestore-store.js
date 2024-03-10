// Import the Firestore database connection
import { db } from "./connect.js";

// Reference to the 'carTypes' collection in Firestore
const carTypesRef = db.collection("carTypes");

// Define the Firestore store for car types
export const carTypeFirestoreStore = {
    // Method to find all car types
    async findCarType() {
        // Get a snapshot of the 'carTypes' collection
        const snapshot = await carTypesRef.get();
        // Map over the documents in the snapshot and return an array of car types
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Method to find a car type by ID
    async findByIdCarType(id) {
        // Get the document with the given ID
        const doc = await carTypesRef.doc(id).get();
        // If the document exists, return the car type, otherwise return null
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },

    // Method to get car types by brand ID
    async getCarTypesByBrandId(brandId) {
        // Get a snapshot of the documents where 'userId' is equal to 'brandId'
        const snapshot = await carTypesRef.where("userId", "==", brandId).get();
        // Map over the documents in the snapshot and return an array of car types
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Method to get all car body types
    async getAllCarBodyTypes() {
        // Get a snapshot of the 'carTypes' collection
        const snapshot = await carTypesRef.get();
        // Map over the documents in the snapshot to get an array of car types
        const carTypes = snapshot.docs.map(doc => doc.data());
        // Create a Set from the 'carType' property of each car type to remove duplicates, then convert back to an array
        const carBodyTypes = [...new Set(carTypes.map(carType => carType.carType))];
        // Return the array of unique car body types
        return carBodyTypes;
    },

    // Method to create a new car type
    async createCarType(carType) {
        // Add a new document to the 'carTypes' collection with the given car type
        const docRef = await carTypesRef.add(carType);
        // Return the new car type with its ID
        return { id: docRef.id, ...carType };
    },

    // Method to update a car type
    async updateCarType(id, updatedCarType) {
        // Get the document with the given ID
        const doc = await carTypesRef.doc(id).get();
        // If the document does not exist, throw an error
        if (!doc.exists) {
            throw new Error("CarType not found");
        }
        // Update the document with the given ID
        await carTypesRef.doc(id).update(updatedCarType);
        // Return the updated car type with its ID
        return { id, ...updatedCarType };
    },

    // Method to delete a car type
    async deleteCarType(id) {
        // Delete the document with the given ID
        await carTypesRef.doc(id).delete();
    }
};