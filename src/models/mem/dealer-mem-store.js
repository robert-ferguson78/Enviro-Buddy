import { v4 } from "uuid";

let dealers = [];

export const dealerMemStore = {
  async getAllDealers() {
    return dealers;
  },

  async addDealer(countyId, dealer) {
    dealer._id = v4();
    dealer.countyid = countyId;
    dealers.push(dealer);
    return dealer;
  },

  async getDealersByCountyId(id) {
    return dealers.filter((dealer) => dealer.countyid === id);
  },

  async getDealerById(id) {
    let foundDealer = dealers.find((dealer) => dealer._id === id);
    if (!foundDealer) {
      foundDealer = null;
    }
    return foundDealer;
  },

  async getCountyDealers(countyId) {
    let foundDealers = dealers.filter((dealer) => dealer.countyid === countyId);
    if (!foundDealers) {
      foundDealers = null;
    }
    return foundDealers;
  },

  async deleteDealer(id) {
    const index = dealers.findIndex((dealer) => dealer._id === id);
    if (index !== -1) dealers.splice(index, 1);
  },

  async deleteAllDealers() {
    dealers = [];
  },

  async updateDealer(dealer, updatedDealer) {
    dealer.title = updatedDealer.title;
    dealer.artist = updatedDealer.artist;
    dealer.duration = updatedDealer.duration;
  },
};
