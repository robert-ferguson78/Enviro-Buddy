// Import the JSONFilePreset function from the lowdb library
// This function is used to create a lowdb instance with a JSON file as the database
import { JSONFilePreset } from "lowdb/node";

// Create a lowdb instance with the JSON file located at "src/models/json/db.json"
// The second argument to JSONFilePreset is the default state of the database
// In this case, the default state is an object with empty arrays for users, counties, dealers, and carTypes
export const db = await JSONFilePreset("src/models/json/db.json", {
  users: [],
  counties: [],
  dealers: [],
  carTypes: [],
});