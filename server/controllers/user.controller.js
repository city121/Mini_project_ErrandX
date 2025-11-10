import User from "../models/user.model.js";

// Helper function to structure user response (optional, but good practice)
const createAuthResponse = (user) => {
    // Convert Mongoose document to plain object
    const userObject = user.toObject ? user.toObject() : user; 
    const { password, ...rest } = userObject;
    return { user: rest };
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (user) {
            res.json(createAuthResponse(user)); 
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update user profile (name, email, etc.)
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (req, res) => {
    
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.profilePic = req.body.profilePic || user.profilePic;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json(createAuthResponse(updatedUser));
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ message: "Server error during profile update." });
    }
};

// @desc    Dedicated Upload Profile Picture
// @route   POST /api/users/:id/upload-photo
// @access  Private 
export const uploadProfilePicture = async (req, res) => {

    if (!req.file || !req.file.filename) { // Check for filename instead of path
        return res.status(400).json({ message: "No file uploaded or file data missing." });
    }
    
    // CRITICAL FIX: Construct the public path using req.file.filename.
    // This matches the static route /uploads and Multer's destination: 'uploads/profile_pics'.
    const publicPath = `/uploads/profile_pics/${req.file.filename}`;

    res.json({ 
        message: "File uploaded successfully.",
        profilePic: publicPath // Now returns the public-facing URL path
    });
};