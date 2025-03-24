import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { isValidEmail, isStrongPassword, areRequiredFieldsProvided } from "../utils/validator.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullName } = req.body;

    // if (
    //     [fullName, email, username, password].some((field) => field?.trim() === "")
    // ) {
    //     throw new ApiError(400, "All fields are required")
    // }
    if(!areRequiredFieldsProvided([username, email, password, fullName])){
        throw new ApiError(400, "All fields are required");
    }

    if(!isValidEmail(email)){
        throw new ApiError(400, "Invalid email address");
    }

    if(!isStrongPassword(password)){
        throw new ApiError(400, "Password is not strong enough. It should contain at least 8 characters with lowercase, uppercase, number and symbol");
    }

    const existingUser = await User.findOne({ $or: [{username}, {email}]});

    if(existingUser){
        throw new ApiError(409, "User already exists with this username or email");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Cloudinary response for avatar:", avatar);
    
    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar on cloudinary");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, true, "User registered successfully", createdUser)
    )
    
});

export { registerUser };
