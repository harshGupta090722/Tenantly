import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    createComplaint,
    getMyComplaints,
    getReceivedComplaints,
    getNotifications,
    updateComplaintStatus
} from "../controllers/complaintController.js";

const complaintRouter = express.Router();

// All complaint routes require authentication but no specific role
complaintRouter.use(authMiddleware as any);

// Create a complaint with up to 5 image attachments
complaintRouter.post("/", upload.array("images", 5), createComplaint);

// Get complaints filed by the logged-in user
complaintRouter.get("/sent", getMyComplaints);

// Get complaints received by / targeted at the logged-in user
complaintRouter.get("/received", getReceivedComplaints);

// Get admin notifications for tenant/landlord
complaintRouter.get("/notifications", getNotifications);

// Update complaint status (in_progress / resolved)
complaintRouter.patch("/:id/status", updateComplaintStatus);

export default complaintRouter;
