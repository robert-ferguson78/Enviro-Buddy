import { User } from "../models/mongo/user.js";
import { County } from "../models/mongo/county.js";
import { Dealer } from "../models/mongo/dealer.js";
import { CarType } from "../models/mongo/cartypes.js";

export async function getAnalyticsByBrand() {
    try {
        console.log("getAnalyticsByBrand");
        const brandUsers = await User.find({ type: "brand" });

        const analytics = await Promise.all(brandUsers.map(async (user) => {
            let maxDealerCounty = { countyId: null, countyName: null, dealerCount: 0 }; // Initialize maxDealerCounty for each brand user

            try {
                const counties = await County.find({ userId: user._id });

                const countsPerCounty = await Promise.all(counties.map(async (county) => {
                    const dealers = await Dealer.find({ countyId: county._id });

                    if (dealers.length > maxDealerCounty.dealerCount) { // Update maxDealerCounty if current county has more dealers
                        maxDealerCounty = { countyId: county._id, countyName: county.county, dealerCount: dealers.length };
                    }
                    return dealers.length;
                }));
                const totalDealerCount = countsPerCounty.reduce((a, b) => a + b, 0);

                const carTypes = await CarType.find({ brandId: user._id });

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