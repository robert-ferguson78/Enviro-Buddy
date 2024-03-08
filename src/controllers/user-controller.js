import { db } from "../models/firestore/connect.js";

const usersRef = db.collection("users");
const dealersRef = db.collection("dealers");
const countiesRef = db.collection("counties");
const carTypesRef = db.collection("carTypes");

export const userController = {
    index: {
        handler: async function (request, h) {
            const usersSnapshot = await usersRef.where("type", "==", "brand").get();
            const users = usersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
            console.log("Users of type brand:", users);
            const brandNames = users.map(user => user.brandName);

            const dealersSnapshot = await dealersRef.get();
            const dealers = dealersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
            console.log("Dealers:", dealers);

            const countiesSnapshot = await countiesRef.get();
            const counties = countiesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
            console.log("Counties:", counties);

            const countyNames = counties.map(county => county.county);
            // Remove duplicates
            const uniqueCountyNames = countyNames.filter((county, index) => countyNames.indexOf(county) === index);


            const carTypesSnapshot = await carTypesRef.get();
            const carTypes = carTypesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
            console.log("Car Types:", carTypes);
            const carBodyTypes = carTypes.map(carType => carType.carType);
            const uniqueCarBodyTypes = carBodyTypes.filter((carType, index) => carBodyTypes.indexOf(carType) === index);

            const dealerInfo = await Promise.all(dealers.map(async dealer => {
                let userCounty = null;
                let userDealers = null;
                let userCarTypes = null;
                const userForDealer = users.find(currentUser => currentUser._id === dealer.userid);

                if (userForDealer && userForDealer.type === "brand") {
                    userCounty = counties.find(county => county.userid === userForDealer._id);
                    userDealers = dealer;
                    userCarTypes = carTypes.filter(carType => carType.userId === userForDealer._id);
                }

                return {
                    ...userForDealer,
                    name: dealer.name,
                    county: userCounty ? userCounty.county : "N/A",
                    carTypes: userCarTypes ? userCarTypes.map(carType => ({
                        carName: carType.carName,
                        carRange: carType.carRange,
                        carType: carType.carType,
                        imageUrl: carType.imageUrl
                    })) : [{ carName: "N/A", carRange: "N/A", carType: "N/A", imageUrl: "N/A" }],
                    latitude: userDealers ? userDealers.latitude : "N/A",
                    longitude: userDealers ? userDealers.longitude : "N/A",
                    address: userDealers ? userDealers.address : "N/A",
                    phone: userDealers ? userDealers.phone : "N/A",
                };
            }));
            console.log("Dealer Info:", dealerInfo);
    
            const viewData = {
                dealerInfo: dealerInfo,
                counties: counties,
                carBodyTypes: uniqueCarBodyTypes,
                uniqueCountyNames: uniqueCountyNames,
                brandNames: brandNames
            };
    
            return h.view("envirobuddy-view", viewData);
        },
    },
};