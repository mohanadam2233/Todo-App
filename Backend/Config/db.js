import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn= await mongoose.connect(process.env.MOngoose_url);
        console.log("MongoDB Connected successfully at port 3000..!!");
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}