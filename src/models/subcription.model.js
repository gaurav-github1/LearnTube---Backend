import mongoose, { mongo } from "mongoose";

const subcriptionSchema = new mongoose.Schema({
    subcriber : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    channel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }
},{
    timestamps: true,
})

export const Subcription = mongoose.model("Subcription", subcriptionSchema);
