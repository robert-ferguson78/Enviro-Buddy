// Import the memory store modules
import { userMemStore } from "./mem/user-mem-store.js";
import { countyMemStore } from "./mem/county-mem-store.js";
import { dealerMemStore } from "./mem/dealer-mem-store.js";

// Import the JSON store modules
import { userJsonStore } from "./json/user-json-store.js";
import { countyJsonStore } from "./json/county-json-store.js";
import { dealerJsonStore } from "./json/dealer-json-store.js";
import { carTypeJsonStore } from "./json/car-type-json-store.js";

// Import the MongoDB store modules
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { countyMongoStore } from "./mongo/county-mongo-store.js";
import { dealerMongoStore } from "./mongo/dealer-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

// Import the Firestore store modules
import { userFirestoreStore } from "./firestore/user-firestore-store.js";
import { countyFirestoreStore } from "./firestore/county-firestore-store.js";
import { dealerFirestoreStore } from "./firestore/dealer-firestore-store.js";
import { carTypeFirestoreStore } from "./firestore/car-type-firestore-store.js";

// Define the database object
export const db = {
  // Define the store properties
  userStore: null,
  countyStore: null,
  dealerStore: null,
  carTypeStore: null,

  // Define the initialization method
  init(storeType) {
    // Switch on the store type
    switch (storeType) {
      // If the store type is "json"
      case "json" :
        // Set the store properties to the JSON stores
        this.userStore = userJsonStore;
        this.countyStore = countyJsonStore;
        this.dealerStore = dealerJsonStore;
        this.carTypeStore = carTypeJsonStore;
        break;
      // If the store type is "mongo"
      case "mongo" :
        // Set the store properties to the MongoDB stores
        this.userStore = userMongoStore;
        this.countyStore = countyMongoStore;
        this.dealerStore = dealerMongoStore;
        this.carTypeStore = carTypeMongoStore;
        // Connect to the MongoDB database
        connectMongo();
        break;
      // If the store type is "firestore"
      case "firestore" :
        // Set the store properties to the Firestore stores
        this.userStore = userFirestoreStore;
        this.countyStore = countyFirestoreStore;
        this.dealerStore = dealerFirestoreStore;
        this.carTypeStore = carTypeFirestoreStore;
        break;
      // If the store type is not specified or not recognized
      default :
        // Set the store properties to the memory stores
        this.userStore = userMemStore;
        this.countyStore = countyMemStore;
        this.dealerStore = dealerMemStore;
    }
  }
};