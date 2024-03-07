import { v4 } from "uuid";
import { db } from "./connect.js";

// const uniqueId = v4();

const usersRef = db.collection("users");

export const userFirestoreStore = {
    async getAllUsers() {
        const snapshot = await usersRef.get();
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    async addUser(user, userType) {
        const uniquId = v4();
        console.log("userType: ", userType);
        let data;
        if (userType === "brand") {
        data = {
            name: user.name,
            brandName: user.brandName,
            email: user.email,
            password: user.password,
            type: userType,
            _id: uniquId,
        };
        } else {
        data = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            type: userType,
            _id: uniquId,
        };
        }
        // console.log("what is data: ", data);
      
        const docRef = await usersRef.doc(uniquId).set(data)
        console.log("Document written with ID: ", uniquId);
        return { _id: uniquId, ...user };
      },

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