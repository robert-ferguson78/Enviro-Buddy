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
        // console.log("user._id: ", user._id); // Add this line
        // console.log("user is: ", user); // Add this line
        const uniquId = user._id || v4();
        // console.log("uniquId: ", uniquId); // Add this line
        // console.log("userType: ", userType);
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
        console.log("what is data: ", data);
      
        const docRef = await usersRef.doc(uniquId).set(data)
        console.log("uniquId: ", uniquId);
        return { ...data };
      },

    async getUserById(_id) {
    // console.log("this.userCollection in getUserById: ", usersRef); // Add this line
    const users = await usersRef.where("_id", "==", _id).get();
    if (users.empty) {
        return null;
    }
    if (users.size > 1) {
        throw new Error(`Multiple users found with _id: ${_id}`);
    }
    return users.docs[0].data();
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
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    },
};