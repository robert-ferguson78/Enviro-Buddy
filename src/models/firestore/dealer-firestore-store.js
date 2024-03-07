import { db } from "./connect.js";

const dealersRef = db.collection("dealers");

export const dealerFirestoreStore = {
    async getAllDealers() {
        const snapshot = await dealersRef.get();
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    async addDealer(countyId, dealer) {
        dealer.countyId = countyId;
        console.log("Dealer to be added: ", dealer);
        const docRef = await dealersRef.add(dealer);
        return { _id: docRef.id, ...dealer };
    },

    async addImageToDealer(id, imageUrl) {
        const doc = await dealersRef.doc(id).get();
        if (!doc.exists) {
                throw new Error("Dealer not found");
        }
        const dealer = doc.data();
        if (!dealer.images) {
                dealer.images = [];
        }
        dealer.images.push(imageUrl);
        await dealersRef.doc(id).update(dealer);
    },

    async getDealersByCountyId(id) {
        const snapshot = await dealersRef.where("countyId", "==", id).get();
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    async getDealerById(id) {
        const doc = await dealersRef.doc(id).get();
        return doc.exists ? { _id: doc.id, ...doc.data() } : null;
    },

    async deleteDealer(id) {
        await dealersRef.doc(id).delete();
    },

    async deleteAllDealers() {
        const snapshot = await dealersRef.get();
        const batch = fireStore.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    },

    async updateDealer(id, updatedDealer) {
        await dealersRef.doc(id).update(updatedDealer);
    },
};