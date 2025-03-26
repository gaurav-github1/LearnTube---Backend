import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req,res,next) =>{
    try {
        const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    
        if(!accessToken){
            throw new ApiError("Please login to access this is authorized request", 401);
        }
    
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
        if(!decodedToken){
            throw new ApiError("Invalid access token", 401);
        }
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError("Invalid access token", 401);
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError("Something went wrong while verifying JWT", 500);
    }
})

