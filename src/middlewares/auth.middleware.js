import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];        

        // console.log("Access token:", !!accessToken);
        
        if(!accessToken){
            throw new ApiError("Unauthorized access - Please login", 401);
        }
        
        try {
            // Verify the token
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            console.log("JWT Verification - Token decoded:", !!decodedToken);
            
            if(!decodedToken?.id){
                throw new ApiError("Invalid access token - Missing user ID", 401);
            }
            
            // Find the user - using the id property from the token
            const user = await User.findById(decodedToken.id).select("-password -refreshToken");
            // console.log("JWT Verification - User found:", !!user);
            
            if(!user){
                throw new ApiError("Invalid access token - User not found", 401);
            }
            
            // Attach user to request
            req.user = user;
            next();
        } catch (jwtError) {
            console.error("JWT Verification Error:", jwtError.message);
            
            // Provide specific error based on the JWT error
            if (jwtError.name === 'TokenExpiredError') {
                throw new ApiError("Access token has expired", 401);
            } else if (jwtError.name === 'JsonWebTokenError') {
                throw new ApiError("Invalid access token", 401);
            } else {
                throw new ApiError(jwtError.message || "Invalid token", 401);
            }
        }
    } catch (error) {
        throw new ApiError("Authentication error - Please login", 500);
    }
});

