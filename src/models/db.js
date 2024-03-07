import { userMemStore } from "./mem/user-mem-store.js";
import { countyMemStore } from "./mem/county-mem-store.js";
import { dealerMemStore } from "./mem/dealer-mem-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { countyJsonStore } from "./json/county-json-store.js";
import { dealerJsonStore } from "./json/dealer-json-store.js";
import { carTypeJsonStore } from "./json/car-type-json-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { countyMongoStore } from "./mongo/county-mongo-store.js";
import { dealerMongoStore } from "./mongo/dealer-mongo-store.js";
import { carTypeMongoStore } from "./mongo/cartypes-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";
// import { userFirestoreStore } from "./firestore/user-firestore-store.js";
// import { countyFirestoreStore } from "./firestore/county-firestore-store.js";
// import { dealerFirestoreStore } from "./firestore/dealer-firestore-store.js";
// import { carTypeFirestoreStore } from "./firestore/car-type-firestore-store.js";

export const db = {
  userStore: null,
  countyStore: null,
  dealerStore: null,
  carTypeStore: null,

  init(storeType) {
    switch (storeType) {
      case "json" :
        this.userStore = userJsonStore;
        this.countyStore = countyJsonStore;
        this.dealerStore = dealerJsonStore;
        this.carTypeStore = carTypeJsonStore;
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        this.countyStore = countyMongoStore;
        this.dealerStore = dealerMongoStore;
        this.carTypeStore = carTypeMongoStore;
        connectMongo();
        break;
      // case "firestore" :
      //     this.userStore = userFirestoreStore;
      //     this.countyStore = countyFirestoreStore;
      //     this.dealerStore = dealerFirestoreStore;
      //     this.carTypeStore = carTypeFirestoreStore;
      //     break;
      default :
        this.userStore = userMemStore;
        this.countyStore = countyMemStore;
        this.dealerStore = dealerMemStore;
    }
  }
};
