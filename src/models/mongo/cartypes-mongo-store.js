import { CarType } from "./cartypes.js";

export const carTypeMongoStore = {
    async findCarType() {
        const carTypes = await CarType.find();
        return carTypes;
    },

    async findByIdCarType(id) {
        const carType = await CarType.findById(id);
        return carType ? carType : null;
    },

    async getCarTypesByBrandId(brandId) {
        const carTypes = await CarType.find({ userId: brandId });
        return carTypes;
    },

    async getAllCarBodyTypes() {
        const carTypes = await CarType.find();
        const carBodyTypes = [...new Set(carTypes.map(carType => carType.carType))];
        return carBodyTypes;
    },

    async createCarType(carType) {
        const newCarType = new CarType(carType);
        const savedCarType = await newCarType.save();
        return savedCarType;
    },

    async updateCarType(id, updatedCarType) {
        const carType = await CarType.findById(id);
        if (!carType) {
            throw new Error("CarType not found");
        }
        const updated = await CarType.findByIdAndUpdate(id, updatedCarType, { new: true });
        return updated;
    },

    async deleteCarType(id) {
        await CarType.findByIdAndDelete(id);
    }
};