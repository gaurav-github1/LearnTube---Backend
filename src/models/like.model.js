import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        video : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video",
        },
        comment : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment",
        },
        tweet : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Tweet",
        },
        likedBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        }
    },
    {
        timestamps : true,
    }
)

// likeSchema.index({video : 1, comment : 1, tweet : 1, likedBy : 1}, {unique : true});

export const Like = mongoose.model("Like", likeSchema);
