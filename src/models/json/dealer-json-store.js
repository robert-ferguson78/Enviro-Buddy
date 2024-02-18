import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const dealerJsonStore = {
  async getAllDealers() {
    await db.read();
    return db.data.dealers;
  },

  async addDealer(countyId, dealer) {
      // console.log("addDealer");
    await db.read();
      // console.log("read Db");
    dealer._id = v4();
    dealer.countyId = countyId;
      // console.log(dealer.countyId);
    db.data.dealers.push(dealer);
      // console.log(dealer);
    await db.write();
    return dealer;
  },

  async getDealersByCountyId(id) {
    await db.read();
    return db.data.dealers.filter((dealer) => dealer.countyId === id);
  },

  async getDealerById(id) {
    await db.read();
    return db.data.dealers.find((dealer) => dealer._id === id);
  },

  async deleteDealer(id) {
    await db.read();
    console.log(`id ${id}`);
    const index = db.data.dealers.findIndex((dealer) => dealer._id === id);
    db.data.dealers.splice(index, 1);
    await db.write();
  },

  async deleteAllDealers() {
    db.data.dealers = [];
    await db.write();
  },

  async updateDealer(dealer, updatedDealer) {
    dealer.name = updatedDealer.name;
    dealer.address = updatedDealer.address;
    dealer.phone = updatedDealer.phone;
    dealer.email = updatedDealer.email;
    dealer.website = updatedDealer.website;
    dealer.latitude = updatedDealer.latitude;
    dealer.longitude = updatedDealer.longitude;
    await db.write();
  },
};