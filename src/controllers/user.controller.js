import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { isValidEmail, isStrongPassword, areRequiredFieldsProvided } from "../utils/validator.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new ApiError("Something went wrong while generating tokens", 500);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  if (!areRequiredFieldsProvided([username, email, password, fullName])) {
    throw new ApiError("All fields are required", 400);
  }

  if (!isValidEmail(email)) {
    throw new ApiError("Invalid email address", 400);
  }

  if (!isStrongPassword(password)) {
    throw new ApiError(
      "Password is not strong enough. It should contain at least 8 characters with lowercase, uppercase, number and symbol",
      400,
    );
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    throw new ApiError("User already exists with this username or email", 409);
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError("Avatar is required", 400);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("Cloudinary response for avatar:", avatar);

  if (!avatar) {
    throw new ApiError("Failed to upload avatar on cloudinary", 500);
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError("Something went wrong while registering the user", 500);
  }

  return res
    .status(201)
    .json(new ApiResponse(200, true, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  // 1. Extract email and password from request body
  // 2. check if email and password are provided
  // 3. validate email
  // 4. find user with email
  // 5. if user not found, throw error
  // 6. if user found, check if password is correct
  // 7. if password is correct, generate access token and refresh token
  // 8. if password is incorrect, throw error
  // 9. return success response and user details

  const { email, username, password } = req.body;

  // Check if either email OR username is provided, AND password is provided
  if ((!email && !username) || !password) {
    throw new ApiError("Please provide either email or username, and password", 400);
  }

  // If email is provided, validate it
  if (email && !isValidEmail(email)) {
    throw new ApiError("Please provide a valid email address", 400);
  }

  if(username && !username.trim()){
    throw new ApiError("Please provide a valid username", 400);
  }

  // Find user by either email or username
  const user = await User.findOne({
    $or: [
      { email: email || "" },  // Use empty string if email is not provided
      { username: username || "" }  // Use empty string if username is not provided
    ]
  });

  if (!user) {
    throw new ApiError("Invalid credentials", 401);
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError("Invalid credentials", 401);
  }

  try {
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);
    
    console.log("Tokens generated successfully:", { accessToken: !!accessToken, refreshToken: !!refreshToken });

    // Fetch the updated user without sensitive information
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    if (!loggedInUser) {
      throw new ApiError("Something went wrong while logging in", 500);
    }

    // Set cookies for tokens
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, true, "User logged in successfully", {
          user: loggedInUser,
          accessToken,
          refreshToken,
        }),
      );
  } catch (error) {
    console.error("Login error:", error);
    throw new ApiError(error.message || "Something went wrong during login", error.statusCode || 500);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      refreshToken: null,
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, true, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const {incomingRefreshToken} = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError("Unauthorized refresh token", 401);
    }

    try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
      if(!decodedToken){
          throw new ApiError("Unauthorized refresh token", 401);
      }
  
      const user = await User.findById(decodedToken._id);
  
      if(!user){
          throw new ApiError("Unauthorized refresh token", 401);
      }
  
      if(user?.refreshToken !== incomingRefreshToken){
        throw new ApiError("Refresh token is expired or used before and  not valid", 401);
      }
  
      const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user);
  
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
  
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, true, "Access token refreshed successfully", {accessToken, refreshToken}));
        
    } catch (error) {
      throw new ApiError("Something went wrong while refreshing access token", 500);
    }
});

const changePassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body;

  if(!oldPassword || !newPassword){
    throw new ApiError("All fields are required", 400);
  }

  const user = await User.findById(req.user?._id);

  if(!user){
    throw new ApiError("User not found", 404);
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if(!isPasswordCorrect){
    throw new ApiError("Old password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save({validateBeforeSave: false});

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      true,
      "Password changed successfully",
      {}
    ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id)

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Current user fetched successfully", user));
})

const updateAccountDetails = asyncHandler(async (req, res) => {
  const {fullName, email} = req.body;

  if(!fullName || !email){
    throw new ApiError("All fields are required", 400);
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      fullName,
      email,
    },
    {
      new : true,
    }
  ).select("-password -refreshToken");

  if(!user){
    throw new ApiError("Something went wrong while updating account details", 500);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Account details updated successfully", user));

})

const updateUserAvatar = asyncHandler(async (req, res) => {
  
  const avatarLocalPath = req.file?.path;
  
  if(!avatarLocalPath){
    throw new ApiError("Avatar is required", 400);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if(!avatar){
    throw new ApiError("Failed to upload avatar on cloudinary", 500);
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      avatar : avatar.url,
    },
    {
      new : true
    }
  ).select("-password -refreshToken");

  if(!user){
    throw new ApiError("Something went wrong while updating avatar", 500);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Avatar updated successfully", user));

})

const updateUserCoverImage = asyncHandler(async (req, res) => {
  
  const coverImageLocalPath = req.file?.path;
  
  if(!coverImageLocalPath){
    throw new ApiError("Cover image is required", 400);
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!coverImage){
    throw new ApiError("Failed to upload cover image on cloudinary", 500);
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      coverImage : coverImage.url,
    },
    {
      new : true
    }
  ).select("-password -refreshToken");

  if(!user){
    throw new ApiError("Something went wrong while updating cover image", 500);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Cover image updated successfully", user));

})


export { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  changePassword, 
  getCurrentUser, 
  updateAccountDetails, 
  updateUserAvatar, 
  updateUserCoverImage 
};
