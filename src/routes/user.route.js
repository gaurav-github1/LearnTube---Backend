import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, getCurrentUser,updateAccountDetails ,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getUserWatchHistory} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1,
        },{
            name : "coverImage",
            maxCount : 1,
        }
    ]),
    registerUser
); // tested

router.route("/login").post(loginUser);// tested

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);// tested

router.route("/refresh-token").post(refreshAccessToken);// tested

router.route("/change-password").post(verifyJWT, changePassword);// tested

router.route("/current-user").get(verifyJWT, getCurrentUser);// tested

router.route("/update-account").patch(verifyJWT, updateAccountDetails);// tested

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar);// test

router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"),updateUserCoverImage);// tested

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile); // tested

router.route("/watch-history").get(verifyJWT, getUserWatchHistory); // tested

export default router;
