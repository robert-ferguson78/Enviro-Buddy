import { db } from "../models/firestore/connect.js";

const usersRef = db.collection("users");
const dealersRef = db.collection("dealers");
const countiesRef = db.collection("counties");
const carTypesRef = db.collection("carTypes");

export const userController = {
    index: {
        handler: async function (request, h) {
            const usersSnapshot = await usersRef.get();
            const users = usersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

            const dealersSnapshot = await dealersRef.get();
            const dealers = dealersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

            const countiesSnapshot = await countiesRef.get();
            const counties = countiesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

            const carTypesSnapshot = await carTypesRef.get();
            const carTypes = carTypesSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

            const dealerInfo = await Promise.all(users.map(async user => {
                let userCounty = null;
                let userDealer = null;
                let userCarType = null;
            
                if (user.type === "brand") {
                    userCounty = counties.find(county => county.userid === user._id);
                    userDealer = dealers.find(dealer => dealer.countyId === (userCounty ? userCounty._id : null));
                    userCarType = carTypes.find(carType => carType.userId === user._id);
                }
            
                return {
                    ...user,
                    county: userCounty ? userCounty.county : "N/A",
                    carType: userCarType ? {
                        carName: userCarType.carName,
                        carRange: userCarType.carRange,
                        carType: userCarType.carType,
                        imageUrl: userCarType.imageUrl
                    } : { carName: "N/A", carRange: "N/A", carType: "N/A", imageUrl: 'N/A' },
                    latitude: userDealer ? userDealer.latitude : "N/A",
                    longitude: userDealer ? userDealer.longitude : "N/A",
                    address: userDealer ? userDealer.address : "N/A",
                    phone: userDealer ? userDealer.phone : "N/A",
                };
            }));

            console.log(dealerInfo); // Log dealerInfo
    
            const viewData = {
                dealerInfo: dealerInfo,
                counties: counties,
                carBodyTypes: carTypes
            };
    
            return h.view("envirobuddy-view", viewData);
        },
    },
};