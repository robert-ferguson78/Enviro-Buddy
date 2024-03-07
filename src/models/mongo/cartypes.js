import Mongoose from "mongoose";

const { Schema } = Mongoose;

const carTypeSchema = new Schema({
  carName: String,
  carRange: String,
  carType: String,
  imageUrl: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const CarType = Mongoose.model("CarType", carTypeSchema);