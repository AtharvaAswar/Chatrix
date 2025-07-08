import mongoose from "mongoose";

export const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (e) {
        console.log("Error :" + e);
    }
}