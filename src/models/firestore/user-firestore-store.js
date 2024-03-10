// Import the UUID library
import { v4 } from "uuid";

// Import the Firestore database connection
import { db } from "./connect.js";

// Reference to the 'users' collection in Firestore
const usersRef = db.collection("users");

// Define the Firestore store for users
export const userFirestoreStore = {
    // Method to get all users
    async getAllUsers() {
        // Get a snapshot of the 'users' collection
        const snapshot = await usersRef.get();
        // Map over the documents in the snapshot and return an array of users
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    // Method to add a user
    async addUser(user, userType) {
        // Generate a unique ID for the user if it doesn't have one
        const uniquId = user._id || v4();

        // Define the data to be stored in the database
        let data;
        if (userType === "brand") {
            // If the user is a brand, store the brand name
            data = {
                name: user.name,
                brandName: user.brandName,
                email: user.email,
                password: user.password,
                type: userType,
                _id: uniquId,
            };
        } else {
            // If the user is not a brand, store the first and last name
            data = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                type: userType,
                _id: uniquId,
            };
        }

        // Add the user to the 'users' collection with the unique ID as the document ID
        await usersRef.doc(uniquId).set(data)

        // Return the stored data
        return { ...data };
    },

    // Method to get a user by its ID
    async getUserById(_id) {
        // Get a snapshot of the documents where '_id' is equal to the given ID
        const users = await usersRef.where("_id", "==", _id).get();

        // If the snapshot is empty, return null
        if (users.empty) {
            return null;
        }

        // If there is more than one user with the given ID, throw an error
        if (users.size > 1) {
            throw new Error(`Multiple users found with _id: ${_id}`);
        }

        // Return the data of the first user in the snapshot
        return users.docs[0].data();
    },

    // Method to get a user by its email
    async getUserByEmail(email) {
        // Get a snapshot of the documents where 'email' is equal to the given email
        const snapshot = await usersRef.where("email", "==", email).get();

        // If the snapshot is empty, return null, otherwise return the first user in the snapshot
        return snapshot.empty ? null : { _id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    // Method to get all brand names
    async getAllBrandNames() {
        // Get a snapshot of the documents where 'type' is equal to 'brand'
        const snapshot = await usersRef.where("type", "==", "brand").get();

        // Map over the documents in the snapshot and return an array of brand names
        const brandNames = snapshot.docs.map(doc => doc.data().brandName);
        return brandNames;
    },

    // Method to delete a user by its ID
    async deleteUserById(id) {
        // Delete the document with the given ID from the 'users' collection
        await usersRef.doc(id).delete();
    },

    // Method to delete all users
    async deleteAll() {
        // Get a snapshot of the 'users' collection
        const snapshot = await usersRef.get();

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