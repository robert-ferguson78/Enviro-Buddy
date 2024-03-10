import { db } from "../models/firestore/connect.js";

const usersRef = db.collection("users");
const dealersRef = db.collection("dealers");
const countiesRef = db.collection("counties");
const carTypesRef = db.collection("carTypes");

export const userController = {
    // Passing all delaer info and menu options to the font end so non logged in user can view
    index: {
        auth: {
            mode: "try"
          },
        handler: async function (request, h) {
            if (request.auth.isAuthenticated) {
                // console.log("user is authenticated");
                // viewData.user = request.auth.credentials;
              } else {
                // console.log("user is not authenticated");
              }
            function getDealerCountForCounty(countyId, dealers) {
                return dealers.filter(dealer => dealer.countyId === countyId).length;
            }

            // Get a snapshot of users of type "brand" from Firestore
            const usersSnapshot = await usersRef.where("type", "==", "brand").get();
            // Map the snapshot documents to an array of user objects
            const users = usersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })); 
            // Map the user objects to an array of brand names
            const brandNames = users.map(user => user.brandName);
    
            // Get a snapshot of all dealers from Firestore
            const dealersSnapshot = await dealersRef.get();
            // Map the snapshot documents to an array of dealer objects
            const dealers = dealersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    
            // Get a snapshot of all counties from Firestore
            const countiesSnapshot = await countiesRef.get();
            // Map the snapshot documents to an array of county objects
            const counties = countiesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    
            // Filter the counties to those with at least one dealer and map to an array of county names
            const countyNamesWithDealers = counties.filter(county => getDealerCountForCounty(county._id, dealers) > 0).map(county => county.county); 
            // Remove duplicates from the array of county names
            const uniqueCountyNames = [...new Set(countyNamesWithDealers)];
    
            // Get a snapshot of all car types from Firestore
            const carTypesSnapshot = await carTypesRef.get();
            // Map the snapshot documents to an array of car type objects
            const carTypes = carTypesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })); 
            // Map the car type objects to an array of car body types
            const carBodyTypes = carTypes.map(carType => carType.carType);
            // Remove duplicates from the array of car body types
            const uniqueCarBodyTypes = carBodyTypes.filter((carType, index) => carBodyTypes.indexOf(carType) === index);
    
            // Map the dealers to an array of dealer info objects, waiting for all promises to resolve
            const dealerInfo = await Promise.all(dealers.map(async dealer => { 
                let userCounty = null;
                let userDealers = null;
                let userCarTypes = null;
                // Find the user associated with the current dealer
                const userForDealer = users.find(currentUser => currentUser._id === dealer.userid);
    
                // If the user exists and is of type "brand"
                if (userForDealer && userForDealer.type === "brand") { 
                    // Find the county associated with the user
                    userCounty = counties.find(county => county.userid === userForDealer._id); 
                    // Store the current dealer
                    userDealers = dealer;
                    // Filter the car types to those associated with the user
                    userCarTypes = carTypes.filter(carType => carType.userId === userForDealer._id);
                }

                return {
                    // Spread the properties of the user associated with the dealer
                    ...userForDealer,
                    name: dealer.name,
                    website: dealer.website,
                    _id: dealer._id,
                    // County of the user associated with the dealer, or "N/A" if not available
                    county: userCounty ? userCounty.county : "N/A",
                    // Map over the car types associated with the user
                    carTypes: userCarTypes ? userCarTypes.map(carType => ({ 
                        carName: carType.carName, 
                        carRange: carType.carRange, 
                        carType: carType.carType, 
                        imageUrl: carType.imageUrl 
                    })) : [{ carName: "N/A", carRange: "N/A", carType: "N/A", imageUrl: "N/A" }], // Default car type if not available
                    latitude: userDealers ? userDealers.latitude : "N/A", // Dealer's latitude, or "N/A" if not available
                    longitude: userDealers ? userDealers.longitude : "N/A", // Dealer's longitude, or "N/A" if not available
                    address: userDealers ? userDealers.address : "N/A", // Dealer's address, or "N/A" if not available
                    phone: userDealers ? userDealers.phone : "N/A", // Dealer's phone, or "N/A" if not available
                };
                // This object is pushed into the dealerInfo array for each dealer
            }));
    
                const viewData = {
                    dealerInfo: dealerInfo, // Array of dealer information
                    counties: counties, // Array of all counties
                    carBodyTypes: uniqueCarBodyTypes.sort(), // Array of unique car body types
                    uniqueCountyNames: uniqueCountyNames.sort(), // Array of unique county names
                    brandNames: brandNames.sort() // Array of brand names
                };
    
            return h.view("envirobuddy-view", viewData);
        },
    },
    // Comments on logic same as index (see index at start)
    bodyType: {
        auth: {
            mode: "try"
          },
        handler: async function (request, h) {
            function getDealerCountForCounty(countyId, dealers) {
                return dealers.filter(dealer => dealer.countyId === countyId).length;
            }
            
            const { carBodyType } = request.query;
                // console.log("Query parameters:", request.query);
                // console.log("Body Type:", carBodyType);

            const usersSnapshot = await usersRef.where("type", "==", "brand").get();
            const users = usersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Users of type brand:", users);
            const brandNames = users.map(user => user.brandName);

            const dealersSnapshot = await dealersRef.get();
            const dealers = dealersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Dealers:", dealers);

            const countiesSnapshot = await countiesRef.get();
            const counties = countiesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Counties:", counties);

            const countyNames = counties.map(county => county.county);
            const countyNamesWithDealers = counties.filter(county => getDealerCountForCounty(county._id, dealers) > 0).map(county => county.county);
            // Remove duplicates
            const uniqueCountyNames = [...new Set(countyNamesWithDealers)];
                // console.log ("Unique County Names:", uniqueCountyNames); 

            const carTypesSnapshot = await carTypesRef.get();
            const carTypes = carTypesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Car Types:", carTypes);
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

                // console.log("Filtered Dealer Info:", filteredDealerInfo);
    
            const viewData = {
                dealerInfo: filteredDealerInfo,
                counties: counties,
                carBodyTypes: uniqueCarBodyTypes.sort(),
                uniqueCountyNames: uniqueCountyNames.sort(),
                brandNames: brandNames.sort()
            };
    
            return h.view("envirobuddy-view", viewData);
        },
    },
    // Comments on logic same as index (see index at start)
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
                // console.log("Users of type brand:", users);
            const brandNames = users.map(user => user.brandName);

            const dealersSnapshot = await dealersRef.get();
            const dealers = dealersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Dealers:", dealers);
    
            const countiesSnapshot = await countiesRef.get();
            const counties = countiesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Counties:", counties);
    
            const countyNames = counties.map(county => county.county);
            const countyNamesWithDealers = counties.filter(county => getDealerCountForCounty(county._id, dealers) > 0).map(county => county.county);
            // Remove duplicates
            const uniqueCountyNames = [...new Set(countyNamesWithDealers)];
                // console.log ("Unique County Names:", uniqueCountyNames); 

            const carTypesSnapshot = await carTypesRef.get();
            const carTypes = carTypesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Car Types:", carTypes);
    
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
                // console.log("Filtered Dealer Info:", filteredDealerInfo);
    
            const viewData = {
                dealerInfo: filteredDealerInfo,
                counties: counties,
                carBodyTypes: uniqueCarBodyTypes.sort(),
                uniqueCountyNames: uniqueCountyNames.sort(),
                brandNames: brandNames.sort()
            };
                // console.log("View Data:", viewData);
    
            return h.view("envirobuddy-view", viewData);
        } catch (error) {
                // console.error("An error occurred:", error);
            return h.response("An internal server error occurred").code(500);
        }
        },
    },
    // Comments on logic same as index (see index at start)
    carCounty: {
        auth: {
            mode: "try"
          },
        handler: async function (request, h) {
            function getDealerCountForCounty(countyId, dealers) {
                return dealers.filter(dealer => dealer.countyId === countyId).length;
            }
            const { countyName } = request.query;
                // console.log("Query parameters:", request.query);
                // console.log("county:", countyName);

            const usersSnapshot = await usersRef.where("type", "==", "brand").get();
            const users = usersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Users of type brand:", users);
            const brandNames = users.map(user => user.brandName);

            const dealersSnapshot = await dealersRef.get();
            const dealers = dealersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Dealers:", dealers);

            const countiesSnapshot = await countiesRef.get();
            const counties = countiesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Counties:", counties);

            const countyNames = counties.map(county => county.county);
            const countyNamesWithDealers = counties.filter(county => getDealerCountForCounty(county._id, dealers) > 0).map(county => county.county);
            // Remove duplicates
            const uniqueCountyNames = [...new Set(countyNamesWithDealers)];
                // console.log ("Unique County Names:", uniqueCountyNames); 

            const carTypesSnapshot = await carTypesRef.get();
            const carTypes = carTypesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
                // console.log("Car Types:", carTypes);
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

                // console.log("Filtered Dealer Info:", filteredDealerInfo);
    
            const viewData = {
                dealerInfo: filteredDealerInfo,
                counties: counties,
                carBodyTypes: uniqueCarBodyTypes.sort(),
                uniqueCountyNames: uniqueCountyNames.sort(),
                brandNames: brandNames.sort()
            };
    
            return h.view("envirobuddy-view", viewData);
        },
    },
};