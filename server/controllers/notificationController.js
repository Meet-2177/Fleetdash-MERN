import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==========================
// Create Notification
// ==========================
export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create(req.body);

  res.status(201).json({
    success: true,
    message: "Notification Created Successfully",
    notification,
  });
});

// ==========================
// Get All Notifications
// ==========================
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find()
    .populate("createdFor", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notifications.length,
    notifications,
  });
});

// ==========================
// Mark Notification as Read
// ==========================
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    notification,
  });
});

// ==========================
// Delete Notification
// ==========================
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});