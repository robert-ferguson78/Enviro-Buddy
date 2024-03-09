import { db } from "../models/firestore/connect.js";

const usersRef = db.collection("users");
const dealersRef = db.collection("dealers");
const countiesRef = db.collection("counties");
const carTypesRef = db.collection("carTypes");

export const userController = {
    index: {
        auth: {
            mode: "try"
          },
        handler: async function (request, h) {
            if (request.auth.isAuthenticated) {
                console.log("user is authenticated");
                // viewData.user = request.auth.credentials;
              } else {
                console.log("user is not authenticated");
              }
            function getDealerCountForCounty(countyId, dealers) {
                return dealers.filter(dealer => dealer.countyId === countyId).length;
            }

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
            const uniqueCountyNames = counties.filter(county => getDealerCountForCounty(county._id, dealers) > 0).map(county => county.county);


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
                    website: dealer.website,
                    _id: dealer._id,
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
    bodyType: {
        auth: {
            mode: "try"
          },
        handler: async function (request, h) {
            function getDealerCountForCounty(countyId, dealers) {
                return dealers.filter(dealer => dealer.countyId === countyId).length;
            }
            
            const { carBodyType } = request.query;
            console.log("Query parameters:", request.query);
            console.log("Body Type:", carBodyType);

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
            const uniqueCountyNames = counties.filter(county => getDealerCountForCounty(county._id, dealers) > 0).map(county => county.county);


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
                    website: dealer.website,
                    _id: dealer._id,
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
            
            const filteredDealerInfo = dealerInfo.filter(dealer => dealer.carTypes.some(carType => carType.carType === carBodyType));

            console.log("Filtered Dealer Info:", filteredDealerInfo);
    
            const viewData = {
                dealerInfo: filteredDealerInfo,
                counties: counties,
                carBodyTypes: uniqueCarBodyTypes,
                uniqueCountyNames: uniqueCountyNames,
                brandNames: brandNames
            };
    
            return h.view("envirobuddy-view", viewData);
        },
    },
    carBrand: {
        auth: {
            mode: "try"
          },
        handler: async function (request, h) {
            function getDealerCountForCounty(countyId, dealers) {
                return dealers.filter(dealer => dealer.countyId === countyId).length;
            }
        try {
            const { brandName } = request.query;
            // console.log("Query parameters:", request.query);
            // console.log("Brand Name:", brandName);
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
            const uniqueCountyNames = counties.filter(county => getDealerCountForCounty(county._id, dealers) > 0).map(county => county.county);
    
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
                    website: dealer.website,
                    _id: dealer._id,
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
    
            const filteredDealerInfo = dealerInfo.filter(dealer => dealer.brandName === brandName);
            console.log("Filtered Dealer Info:", filteredDealerInfo);
    
            const viewData = {
                dealerInfo: filteredDealerInfo,
                counties: counties,
                carBodyTypes: uniqueCarBodyTypes,
                uniqueCountyNames: uniqueCountyNames,
                brandNames: brandNames
            };
             console.log("View Data:", viewData);
    
            return h.view("envirobuddy-view", viewData);
        } catch (error) {
            console.error("An error occurred:", error);
            return h.response("An internal server error occurred").code(500);
        }
        },
    },
    carCounty: {
        auth: {
            mode: "try"
          },
        handler: async function (request, h) {
            function getDealerCountForCounty(countyId, dealers) {
                return dealers.filter(dealer => dealer.countyId === countyId).length;
            }
            const { countyName } = request.query;
            console.log("Query parameters:", request.query);
            console.log("county:", countyName);

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
            const uniqueCountyNames = counties.filter(county => getDealerCountForCounty(county._id, dealers) > 0).map(county => county.county);


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
                    userCounty = counties.find(county => county._id === dealer.countyId);
                    userDealers = dealer;
                    userCarTypes = carTypes.filter(carType => carType.userId === userForDealer._id);
                }

                return {
                    ...userForDealer,
                    name: dealer.name,
                    website: dealer.website,
                    _id: dealer._id,
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
            
            const filteredDealerInfo = dealerInfo.filter(dealer => dealer.county === countyName);

            console.log("Filtered Dealer Info:", filteredDealerInfo);
    
            const viewData = {
                dealerInfo: filteredDealerInfo,
                counties: counties,
                carBodyTypes: uniqueCarBodyTypes,
                uniqueCountyNames: uniqueCountyNames,
                brandNames: brandNames
            };
    
            return h.view("envirobuddy-view", viewData);
        },
    },
};