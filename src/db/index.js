import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        // Remove trailing slash from MONGO_URI if present
        const mongoUri = process.env.MONGO_URI.endsWith('/') 
            ? process.env.MONGO_URI.slice(0, -1) 
            : process.env.MONGO_URI;
            
        const connectionInstance = await mongoose.connect(`${mongoUri}/${DB_NAME}`);
        console.log(`\nMongoDB connected!! : DB_HOST :: ${connectionInstance.connection.host} : DB_NAME :: ${connectionInstance.connection.name}`);      
    } catch (error) {
        console.log("there was an error connecting to the database", error);
        process.exit(1);
    }
}

export default connectDB;