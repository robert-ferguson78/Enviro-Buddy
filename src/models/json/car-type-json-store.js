import { db } from "./store-utils.js";

export const carTypeJsonStore = {
  async find() {
    return db.get("carTypes").value();
  },

  async findById(id) {
    return db.get("carTypes").find({ id }).value();
  },

  async create(carType) {
    const carTypes = db.get("carTypes");
    carTypes.push(carType).write();
    return carType;
  },

  async update(id, carType) {
    return db.get("carTypes").find({ id }).assign(carType).write();
  },

  async delete(id) {
    return db.get("carTypes").remove({ id }).write();
  }
};