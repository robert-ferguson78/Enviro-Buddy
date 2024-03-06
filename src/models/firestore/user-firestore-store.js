import { db } from "./connect.js";

const usersRef = db.collection("users");

export const userFirestoreStore = {
    async getAllUsers() {
        const snapshot = await usersRef.get();
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    async addUser(user, userType) {
        user.type = userType;
        console.log("user: ", user);
        const docRef = await usersRef.set(user);
        console.log("Document written with ID: ", docRef.id);
        return { _id: docRef.id, ...user };
    },

    // async addUser(){
    //     const data = {
    //         name: "Los Angeles",
    //         state: "CA",
    //         country: "USA"
    //       };
          
    //       // Add a new document in collection "cities" with ID 'LA'
    //       const res = await db.collection("users").doc("6557766887").set(data);
    //       console.log("Document written with ID: ", res);
    // },

    async getUserById(id) {
        const doc = await usersRef.doc(id).get();
        return doc.exists ? { _id: doc.id, ...doc.data() } : null;
    },

    async getUserByEmail(email) {
        const snapshot = await usersRef.where("email", "==", email).get();
        return snapshot.empty ? null : { _id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    async getAllBrandNames() {
        const snapshot = await usersRef.where("type", "==", "brand").get();
        const brandNames = snapshot.docs.map(doc => doc.data().brandName);
        return brandNames;
    },

    async deleteUserById(id) {
        await usersRef.doc(id).delete();
    },

    async deleteAll() {
        const snapshot = await usersRef.get();
        const batch = fireStore.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    },
};