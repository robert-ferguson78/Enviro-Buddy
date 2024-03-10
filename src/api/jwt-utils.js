import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { use } from "chai";
import { db } from "../models/db.js";

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
}

// This function creates a JWT token for a given user
export function createToken(user) {
  const payload = {
    userId: user._id,
    email: user.email,
  };
  const options = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  return jwt.sign(payload, process.env.COOKIE_PASSWORD, options);
}

// This function decodes a JWT token and extracts user information
export function decodeToken(token) {
  const userInfo = {};
  try {
    const decoded = jwt.verify(token, process.env.COOKIE_PASSWORD);    
     userInfo.userId = decoded.userId;    
     userInfo.email = decoded.email;

    if (decoded.userId) {
      userInfo.userId = decoded.userId;
    }
  } catch (e) {
    console.log(e.message);
  }
  return userInfo;
}

// This function validates a decoded JWT token by checking if the user exists in the database
export async function validate(decoded, request) {
  const user = await db.userStore.getUserById(decoded.userId);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}