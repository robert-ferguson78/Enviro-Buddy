import Mongoose from "mongoose";

const { Schema } = Mongoose;

const countySchema = new Schema({
  title: String,
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    countyId: String,
  },
});

countySchema.virtual("dealers", {
  ref: "Dealer", // The model to use
  localField: "_id", // Find dealers where `localField`
  foreignField: "countyId", // is equal to `foreignField`
  justOne: false // And only get the first one found
});

export const County = Mongoose.model("County", countySchema);