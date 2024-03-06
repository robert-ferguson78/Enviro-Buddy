import { db } from "./connect.js";

const carTypesRef = db.collection("carTypes");

export const carTypeFirestoreStore = {
    async findCarType() {
        const snapshot = await carTypesRef.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async findByIdCarType(id) {
        const doc = await carTypesRef.doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },

    async getCarTypesByBrandId(brandId) {
        const snapshot = await carTypesRef.where("userId", "==", brandId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getAllCarBodyTypes() {
        const snapshot = await carTypesRef.get();
        const carTypes = snapshot.docs.map(doc => doc.data());
        const carBodyTypes = [...new Set(carTypes.map(carType => carType.carType))];
        return carBodyTypes;
    },

    async createCarType(carType) {
        const docRef = await carTypesRef.add(carType);
        return { id: docRef.id, ...carType };
    },

    async updateCarType(id, updatedCarType) {
        const doc = await carTypesRef.doc(id).get();
        if (!doc.exists) {
            throw new Error("CarType not found");
        }
        await carTypesRef.doc(id).update(updatedCarType);
        return { id, ...updatedCarType };
    },

    async deleteCarType(id) {
        await carTypesRef.doc(id).delete();
    }
};