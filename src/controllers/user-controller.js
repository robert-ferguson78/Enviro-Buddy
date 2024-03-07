import { User } from "../models/mongo/user.js";
import { Dealer } from "../models/mongo/dealer.js";
import { County } from "../models/mongo/county.js";
import { CarType } from "../models/mongo/cartypes.js";

export const userController = {
    index: {
        handler: async function (request, h) {
            const users = await User.find();
            const dealers = await Dealer.find();
            const counties = await County.find();
            const carTypes = await CarType.find();

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
                    ...user._doc,
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