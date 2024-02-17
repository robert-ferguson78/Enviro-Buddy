import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { dealerJsonStore } from "./dealer-json-store.js";

export const countyJsonStore = {
  async getAllCountys() {
    await db.read();
    return db.data.countys;
  },

  async addCounty(county) {
    await db.read();
    county._id = v4();
    db.data.countys.push(county);
    await db.write();
    return county;
  },

  // async getcountyById(id) {
  //   await db.read();
  //   const list = db.data.countys.find((county) => county._id === id);
  //   list.dealers = await dealerJsonStore.getdealersBycountyId(list._id);
  //   return list;
  // },

  async getCountyById(id) {
    await db.read();
    let list = db.data.countys.find((county) => county._id === id);
    if (list) {
      list.dealers = await dealerJsonStore.getDealersByCountyId(list._id);
    } else {
      list = null;
    }
    return list;
  },

  async getUserCountys(userid) {
    await db.read();
    return db.data.countys.filter((county) => county.userid === userid);
  },

  // async deletecountyById(id) {
  //   await db.read();
  //   const index = db.data.countys.findIndex((county) => county._id === id);
  //   db.data.countys.splice(index, 1);
  //   await db.write();
  // },

  async deleteCountyById(id) {
    await db.read();
    const index = db.data.countys.findIndex((county) => county._id === id);
    if (index !== -1) db.data.countys.splice(index, 1);
    await db.write();
  },
  
  async deleteAllCountys() {
    db.data.countys = [];
    await db.write();
  },
};