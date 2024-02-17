import Mongoose from "mongoose";

const { Schema } = Mongoose;

const countySchema = new Schema({
  title: String,
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const County = Mongoose.model("County", countySchema);
