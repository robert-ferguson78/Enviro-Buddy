import { userMemStore } from "./mem/user-mem-store.js";
import { countyMemStore } from "./mem/county-mem-store.js";
import { dealerMemStore } from "./mem/dealer-mem-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { countyJsonStore } from "./json/county-json-store.js";
import { dealerJsonStore } from "./json/dealer-json-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { countyMongoStore } from "./mongo/county-mongo-store.js";
import { dealerMongoStore } from "./mongo/dealer-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,
  countyStore: null,
  dealerStore: null,

  init(storeType) {
    switch (storeType) {
      case "json" :
        this.userStore = userJsonStore;
        this.countyStore = countyJsonStore;
        this.dealerStore = dealerJsonStore;
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        this.countyStore = countyMongoStore;
        this.dealerStore = dealerMongoStore;
        connectMongo();
        break;
      default :
        this.userStore = userMemStore;
        this.countyStore = countyMemStore;
        this.dealerStore = dealerMemStore;
    }
  }
};
