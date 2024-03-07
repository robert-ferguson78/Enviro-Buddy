import { db } from "../models/firestore/connect.js";

const usersRef = db.collection("users");
const countiesRef = db.collection("counties");
const dealersRef = db.collection("dealers");
const carTypesRef = db.collection("carTypes");
const analyticsRef = db.collection("analytics");

export async function getAnalyticsByBrand(userId) {
    try {
        const userSnapshot = await usersRef.doc(userId).get();
        if (!userSnapshot.exists) {
            console.error("User not found:", userId);
            return null;
        }

        const user = { _id: userSnapshot.id, ...userSnapshot.data() };
        if (user.type !== "brand") {
            console.error("User is not a brand:", userId);
            return null;
        }

        let maxDealerCounty = { countyId: null, countyName: null, dealerCount: 0 };

        try {
            const countiesSnapshot = await countiesRef.where("userid", "==", user._id).get();
            const counties = countiesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
            const countsPerCounty = await Promise.all(counties.map(async (county) => {
                const dealersSnapshot = await dealersRef.where("countyId", "==", county._id).get();
                const dealers = dealersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

                if (dealers.length > maxDealerCounty.dealerCount) {
                    maxDealerCounty = { countyId: county._id, countyName: county.county, dealerCount: dealers.length };
                }
                return dealers.length;
            }));
            const totalDealerCount = countsPerCounty.reduce((a, b) => a + b, 0);

            const carTypesSnapshot = await carTypesRef.where("userId", "==", user._id).get();
            const carTypes = carTypesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

            const analyticsData = {
                userId: user._id,
                brandName: user.brandName,
                dealerCount: totalDealerCount,
                carTypeCount: carTypes.length,
                countyCount: counties.length,
                maxDealerCounty
            };

            await analyticsRef.doc(user._id).set(analyticsData);

            return analyticsData;
        } catch (error) {
            console.error("Error processing user:", user._id, error);
            return null;
        }
    } catch (error) {
        console.error("Error in getAnalyticsByBrand:", error);
        return null;
    }
}