import { County } from "./county.js";
import { dealerMongoStore } from "./dealer-mongo-store.js";

export const countyMongoStore = {
  async getAllCounties() {
    return County.find({});
  },

  async addCounty(county, userId) {
    county.userId = userId;
    const newCounty = new County(county);
    const savedCounty = await newCounty.save();
    return savedCounty;
  },

  async getCountyById(userId) { // Changed parameter name from id to userId
    const county = await County.findOne({ userId }); // Changed findById to findOne and used userId
    if (county) {
      county.dealers = await dealerMongoStore.getDealersByCountyId(county.userId);
    }
    return county;
  },

  async getAllUniqueCounties() {
    const counties = await County.find({});
    const uniqueCounties = [...new Set(counties.map(county => county.title))];
    return uniqueCounties;
  },

  async findCounty({ userId, title }) {
    return County.findOne({ userId, title });
  },

  async getUserCounties(userId) {
    return County.find({ userId });
  },

  async getUserIdByCountyId(userId) { // Changed parameter name from countyId to userId
    const county = await County.findOne({ userId }); // Changed findById to findOne and used userId
    return county ? county.userId : null;
  },

  async deleteCountyById(userId) { // Changed parameter name from id to userId
    return County.findOneAndDelete({ userId }); // Changed findByIdAndDelete to findOneAndDelete and used userId
  },

  async deleteAllCounties() {
    return County.deleteMany({});
  },
};