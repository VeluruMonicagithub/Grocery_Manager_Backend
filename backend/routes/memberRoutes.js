import express from "express";
import { generateLink, getMyMembers, getGeneratedLinks, acceptInvite, removeMember } from "../controllers/memberController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-link", authenticateUser, generateLink);
router.get("/", authenticateUser, getMyMembers);
router.get("/links", authenticateUser, getGeneratedLinks);
router.post("/accept", authenticateUser, acceptInvite);
router.delete("/:email", authenticateUser, removeMember);

export default router;
