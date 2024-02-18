import { Dealer } from "./dealer.js";
import { County } from "./county.js";

export const dealerMongoStore = {
  async getAllCounties() {
    const counties = await Dealer.find().lean();
    return counties;
  },

  async addDealer(countyId, dealer) {
    dealer.countyid = countyId;
    const newDealer = new Dealer(dealer);
    const dealerObj = await newDealer.save();
    return this.getDealerById(dealerObj._id);
  },

  async getCountiesByCountyId(id) {
    const counties = await Dealer.find({ countyid: id }).lean();
    return counties;
  },

  async getDealerById(id) {
    if (id) {
      const dealer = await Dealer.findOne({ _id: id }).lean();
      return dealer;
    }
    return null;
  },

  async deleteDealer(id) {
    try {
      await Dealer.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllCounties() {
    await Dealer.deleteMany({});
  },

  async updateDealer(dealer, updatedDealer) {
    const dealerDoc = await Dealer.findOne({ _id: dealer._id });
    dealerDoc.title = updatedDealer.title;
    dealerDoc.artist = updatedDealer.artist;
    dealerDoc.duration = updatedDealer.duration;
    await dealerDoc.save();
  },
};
