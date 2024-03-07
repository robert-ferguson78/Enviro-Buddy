import { v4 } from "uuid";
import { db } from "./connect.js";
import { dealerFirestoreStore } from "./dealer-fireStore-store.js";

const countiesRef = db.collection("counties");

export const countyFirestoreStore = {
    async getAllCounties() {
        const snapshot = await countiesRef.get();
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    },

    async addCounty(county) {
        console.log("Starting addCounty with county: ", county);
        const uniqueId = v4();
        console.log("Generated uniqueId: ", uniqueId);
        const data = {
            _id: uniqueId,
            ...county
        };
        console.log("Data to be added: ", data);
        try {
            await countiesRef.doc(uniqueId).set(data);
            console.log("Document written with ID: ", uniqueId);
        } catch (error) {
            console.error("Error writing document: ", error);
        }
        return data;
    },

    async getCountyById(id) {
        const doc = await countiesRef.doc(id).get();
        const county = doc.exists ? { _id: doc.id, ...doc.data() } : null;
        if (county) {
            county.dealers = await dealerFirestoreStore.getDealersByCountyId(county._id);
        }
        return county;
    },

    async getCheckForCounty(newCounty) {
        const snapshot = await countiesRef
            .where("userid", "==", newCounty.userid)
            .where("county", "==", newCounty.county)
            .get();
        return snapshot.empty ? null : { _id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    async getCountiesByUserId(id) {
        console.log("getCountiesByUserId ran");
        const snapshot = await countiesRef.where("userid", "==", id).get();
        if (snapshot.empty) {
          console.log("No matching documents.");
          return [];
        }  
      
        const counties = [];
        snapshot.forEach(doc => {
          counties.push({ _id: doc.id, ...doc.data() });
        });
      
        return counties;
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