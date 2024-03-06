import { db } from "./connect.js";
import { dealerFirestoreStore } from "./dealer-fireStore-store.js";

const countiesRef = db.collection("counties");

export const countyFirestoreStore = {
    async getAllCounties() {
        const snapshot = await countiesRef.get();
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    async addCounty(county) {
        const docRef = await countiesRef.add(county);
        return { _id: docRef.id, ...county };
    },

    async getCountyById(id) {
        const doc = await countiesRef.doc(id).get();
        const county = doc.exists ? { _id: doc.id, ...doc.data() } : null;
        if (county) {
            county.dealers = await dealerFirestoreStore.getDealersByCountyId(county._id);
        }
        return county;
    },

    async getAllUniqueCounties() {
        const snapshot = await countiesRef.get();
        const counties = snapshot.docs.map(doc => doc.data());
        const uniqueCounties = counties
            .filter((county, index, self) =>
                index === self.findIndex((c) => c.county === county.county)
            )
            .sort((a, b) => a.county.localeCompare(b.county));
        return uniqueCounties;
    },

    async findCounty({ userid, county }) {
        const snapshot = await countiesRef.where("userid", "==", userid).where("county", "==", county).get();
        return snapshot.empty ? null : { _id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    async getUserCounties(userid) {
        const snapshot = await countiesRef.where("userid", "==", userid).get();
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    async getUserIdByCountyId(countyId) {
        const doc = await countiesRef.doc(countyId).get();
        return doc.exists ? doc.data().userid : null;
    },

    async deleteCountyById(id) {
        await countiesRef.doc(id).delete();
    },
    
    async deleteAllCounties() {
        const snapshot = await countiesRef.get();
        const batch = fireStore.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    },
};