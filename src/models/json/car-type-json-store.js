import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const carTypeJsonStore = {
  async findCarType() {
    await db.read();
    return db.data.carTypes;
  },

  async findByIdCarType(id) {
    await db.read();
    return db.data.carTypes.find(carType => carType.id === id);
  },

  async getCarTypesByBrandId(brandId) {
    // console.log("brand ID:", brandId);
    await db.read();
    const carTypes = db.data.carTypes.filter(carType => carType.userId === brandId);
    // console.log("carTypes in getCarTypesByBrandId:", carTypes);
    return carTypes;
  },

  async getAllCarBodyTypes() {
    await db.read();
    const carBodyTypes = [...new Set(db.data.carTypes.map(carType => carType.carType))];
    return carBodyTypes;
  },

  async createCarType(carType) {
    await db.read();
    carType.id = v4();
    db.data.carTypes.push(carType);
    await db.write();
    return carType;
  },

  async updateCarType(id, updatedCarType) {
    await db.read();
    const foundCarType = db.data.carTypes.find(ct => ct.id === id);
    // console.log("foundCarType:", foundCarType);
    if (!foundCarType) {
      throw new Error("CarType not found");
    }
    Object.assign(foundCarType, updatedCarType);
    await db.write();
    return foundCarType;
  },

  async deleteCarType(id) {
    await db.read();
    const index = db.data.carTypes.findIndex(carType => carType.id === id);
    if (index === -1) {
      throw new Error("CarType not found");
    }
    db.data.carTypes.splice(index, 1);
    await db.write();
  }
};