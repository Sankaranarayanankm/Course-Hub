/**
 * connect with mongo db first then
 * create endpoints
 * signup,login,logout
 * then create teacher end points
 * then student endpoints
 */
import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
};

export default connectDB;
