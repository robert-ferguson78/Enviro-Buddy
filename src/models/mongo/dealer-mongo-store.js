import { Dealer } from "./dealer.js";

export const dealerMongoStore = {
  async getAllDealers() {
    return Dealer.find({});
  },

  async addDealer(countyId, dealer) {
    dealer.countyId = countyId;
    const newDealer = new Dealer(dealer);
    const savedDealer = await newDealer.save();
    return savedDealer;
  },

  async addImageToDealer(id, imageUrl) {
    const dealer = await Dealer.findById(id);
    if (!dealer) {
      throw new Error("Dealer not found");
    }
    if (!dealer.images) {
      dealer.images = [];
    }
    dealer.images.push(imageUrl);
    await dealer.save();
  },

  async getDealersByCountyId(id) {
    return Dealer.find({ countyId: id });
  },

  async getDealerById(id) {
    return Dealer.findById(id);
  },

  async deleteDealer(id) {
    return Dealer.findByIdAndDelete(id);
  },

  async deleteAllDealers() {
    return Dealer.deleteMany({});
  },

  async updateDealer(id, updatedDealer) {
    return Dealer.findByIdAndUpdate(id, updatedDealer, { new: true });
  },
};