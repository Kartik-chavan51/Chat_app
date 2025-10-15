import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn=await mongoose.connect(process.env.MONOGO_URI);
    console.log(`Mongodb Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting Mongodb",error);
    process.exit(1); //1 means failure
  }
}

export default connectDB;