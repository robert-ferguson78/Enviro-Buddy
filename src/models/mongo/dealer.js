import Mongoose from "mongoose";

const { Schema } = Mongoose;

const dealerSchema = new Schema({
  name: String,
  email: String,
  type: String,
  brandName: String,
  countyId: {
    type: Schema.Types.ObjectId,
    ref: "County",
  },
  images: [String], // assuming images are stored as an array of URLs
});

export const Dealer = Mongoose.model("Dealer", dealerSchema);