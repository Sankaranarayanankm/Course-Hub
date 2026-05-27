import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
};

export default connectDB;
