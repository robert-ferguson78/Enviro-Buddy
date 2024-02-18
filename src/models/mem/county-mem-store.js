import { v4 } from "uuid";
import { dealerMemStore } from "./dealer-mem-store.js";

let counties = [];

export const countyMemStore = {
  async getAllCounties() {
    return counties;
  },

  async addCounty(county) {
    county._id = v4();
    counties.push(county);
    return county;
  },

  async getCountyById(id) {
    const list = counties.find((county) => county._id === id);
    if (list) {
      list.counties = await dealerMemStore.getCountiesByCountyId(list._id);
      return list;
    }
    return null;
  },

  async getUserCounties(userid) {
    return counties.filter((county) => county.userid === userid);
  },

  async deleteCountyById(id) {
    const index = counties.findIndex((county) => county._id === id);
    if (index !== -1) counties.splice(index, 1);
  },

  async deleteAllCounties() {
    counties = [];
  },
};
