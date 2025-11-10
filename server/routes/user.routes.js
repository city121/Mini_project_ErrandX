import express from "express";
import User from "../models/user.model.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.put("/:id", async (req, res) => {
  try {
    const { name, email, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, profilePic },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.post("/:id/upload-photo", upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    user.profilePic = fileUrl;
    await user.save();

    res.json({ message: "Profile picture updated", profilePic: fileUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
});

export default router;
