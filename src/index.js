import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: "./.env"
});

connectDB().then(() => {
    console.log("Database connected successfully");
    const Port = process.env.PORT || 5000;
    app.on("error", (err) => {
        console.log("Error in server setup", err);
        throw err;
    })
    app.listen(Port,()=>{
        console.log(`Server is running on port ${Port}`);
    })
}).catch((error) => {
    console.error("Error connecting to the Mongo database:", error);
    process.exit(1);
});