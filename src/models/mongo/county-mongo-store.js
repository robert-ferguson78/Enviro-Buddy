import { County } from "./county.js";
import { dealerMongoStore } from "./dealer-mongo-store.js";

export const countyMongoStore = {
  async getAllCountys() {
    const countys = await County.find().lean();
    return countys;
  },

  async getCountyById(id) {
    if (id) {
      const county = await County.findOne({ _id: id }).lean();
      if (county) {
        county.dealers = await dealerMongoStore.getDealersByCountyId(county._id);
      }
      return county;
    }
    return null;
  },

  async addCounty(county) {
    const newCounty = new County(county);
    const countyObj = await newCounty.save();
    return this.getCountyById(countyObj._id);
  },

  async getUserCountys(id) {
    const county = await County.find({ userid: id }).lean();
    return county;
  },

  async deleteCountyById(id) {
    try {
      await County.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllCountys() {
    await County.deleteMany({});
  }
};
