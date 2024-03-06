import { db } from "../models/firestore/connect.js";

const usersRef = db.collection("users");
const countiesRef = db.collection("counties");
const dealersRef = db.collection("dealers");
const carTypesRef = db.collection("carTypes");

export async function getAnalyticsByBrand() {
    try {
        console.log("getAnalyticsByBrand");
        const allUsersSnapshot = await usersRef.where("type", "==", "brand").get();
        const brandUsers = allUsersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        console.log("getAnalyticsByBrand");

        const analytics = await Promise.all(brandUsers.map(async (user) => {
            let maxDealerCounty = { countyId: null, countyName: null, dealerCount: 0 }; // Initialize maxDealerCounty for each brand user

            try {
                const countiesSnapshot = await countiesRef.where("userId", "==", user._id).get();
                const counties = countiesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

                const countsPerCounty = await Promise.all(counties.map(async (county) => {
                    const dealersSnapshot = await dealersRef.where("countyId", "==", county._id).get();
                    const dealers = dealersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

                    if (dealers.length > maxDealerCounty.dealerCount) { // Update maxDealerCounty if current county has more dealers
                        maxDealerCounty = { countyId: county._id, countyName: county.county, dealerCount: dealers.length };
                    }
                    return dealers.length;
                }));
                const totalDealerCount = countsPerCounty.reduce((a, b) => a + b, 0);

                const carTypesSnapshot = await carTypesRef.where("brandId", "==", user._id).get();
                const carTypes = carTypesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

                return {
                    userId: user._id,
                    brandName: user.brandName,
                    dealerCount: totalDealerCount,
                    carTypeCount: carTypes.length,
                    countyCount: counties.length,
                    maxDealerCounty // Include maxDealerCounty in the return object
                };
            } catch (error) {
                console.error("Error processing user:", user._id, error);
                return null;
            }
        }));

        return analytics; // Return the analytics array directly
    } catch (error) {
        console.error("Error in getAnalyticsByBrand:", error);
        return null;
    }
}