import { db } from "../models/db.js";

export async function getAnalyticsByBrand() {
    try {
        console.log("getAnalyticsByBrand");
        const allUsers = await db.userStore.getAllUsers();
        const brandUsers = allUsers.filter(user => user.type === "brand");
        console.log("getAnalyticsByBrand");

        const analytics = await Promise.all(brandUsers.map(async (user) => {
            let maxDealerCounty = { countyId: null, countyName: null, dealerCount: 0 }; // Initialize maxDealerCounty for each brand user

            try {
                const counties = await db.countyStore.getUserCounties(user._id);
                const countsPerCounty = await Promise.all(counties.map(async (county) => {
                    const dealers = await db.dealerStore.getDealersByCountyId(county._id);
                    if (dealers.length > maxDealerCounty.dealerCount) { // Update maxDealerCounty if current county has more dealers
                        maxDealerCounty = { countyId: county._id, countyName: county.county, dealerCount: dealers.length };
                    }
                    return dealers.length;
                }));
                const totalDealerCount = countsPerCounty.reduce((a, b) => a + b, 0);

                const carTypes = await db.carTypeStore.getCarTypesByBrandId(user._id);

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