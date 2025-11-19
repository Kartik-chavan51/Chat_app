import express from "express";
import { getFriendRequests, getMyFriends, getOutgoingFriendRequests, getRecommendedUsers } from "../controlllers/user.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router =express.Router();


router.use(protectRoute);
router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFreindRequest);
router.post("/friend-request/:id/accept",acceptFreindRequest);


router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-friend-requests",getOutgoingFriendRequests);

export default router;