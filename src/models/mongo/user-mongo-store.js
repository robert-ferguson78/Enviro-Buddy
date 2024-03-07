import { v4 as uuidv4 } from "uuid";
import { User } from "./user.js";

export const userMongoStore = {
  async getAllUsers() {
    return User.find({});
  },

  async addUser(user, userType) {
    user.userId = uuidv4();
    console.log("Generated userId: ", user.userId); // Check the generated userId
    user.type = userType;
    console.log("user: ", user);
    const newUser = new User(user);
    try {
        const savedUser = await newUser.save();
        console.log("Document written with ID: ", user.userId);
        return savedUser;
    } catch (error) {
        console.error("Error saving user: ", error); // Log any errors
        return null;
    }
},

async getUserById(userId) {
  const user = await User.findOne({ userId: userId });
  console.log(user);
  return user;
},

  async getUserByEmail(email) {
    return User.findOne({ email: email });
  },

  async getAllBrandNames() {
    const users = await User.find({ type: "brand" });
    return users.map(user => user.brandName);
  },

  async deleteUserById(id) {
    return User.findOneAndDelete({ userId: userId });
  },

  async deleteAll() {
    return User.deleteMany({});
  },
};