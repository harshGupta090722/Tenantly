import mongoose from "mongoose";
import config from "../config/config.js";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.MONGO_URL);
        console.log("You are now Connected to mongoDB");
    } catch (err) {
        console.error("Error in connecting to mongoDB", err);
    }
};

export default connectDB;
