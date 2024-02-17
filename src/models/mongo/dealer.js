import Mongoose from "mongoose";

const { Schema } = Mongoose;

const trackSchema = new Schema({
  title: String,
  artist: String,
  duration: Number,
  countyid: {
    type: Schema.Types.ObjectId,
    ref: "County",
  },
});

export const Dealer = Mongoose.model("Dealer", trackSchema);
