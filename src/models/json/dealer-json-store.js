import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const dealerJsonStore = {
  async getAllDealers() {
    await db.read();
    return db.data.s;
  },

  async addDealer(countyId, dealer) {
    await db.read();
    dealer._id = v4();
    dealer.countyId = countyId;
    db.data.dealer.push(dealer);
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
    const index = db.data.dealers.findIndex((dealer) => dealer._id === id);
    db.data.dealers.splice(index, 1);
    await db.write();
  },

  async deleteAllDealers() {
    db.data.dealers = [];
    await db.write();
  },

  async updateDealer(dealer, updatedDealer) {
    dealer.title = updatedDealer.title;
    dealer.artist = updatedDealer.artist;
    dealer.duration = updatedDealer.duration;
    await db.write();
  },
};