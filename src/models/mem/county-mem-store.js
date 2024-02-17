import { v4 } from "uuid";
import { dealerMemStore } from "./dealer-mem-store.js";

let countys = [];

export const countyMemStore = {
  async getAllCountys() {
    return countys;
  },

  async addCounty(county) {
    county._id = v4();
    countys.push(county);
    return county;
  },

  async getCountyById(id) {
    const list = countys.find((county) => county._id === id);
    if (list) {
      list.countys = await dealerMemStore.getCountysByCountyId(list._id);
      return list;
    }
    return null;
  },

  async getUserCountys(userid) {
    return countys.filter((county) => county.userid === userid);
  },

  async deleteCountyById(id) {
    const index = countys.findIndex((county) => county._id === id);
    if (index !== -1) countys.splice(index, 1);
  },

  async deleteAllCountys() {
    countys = [];
  },
};
