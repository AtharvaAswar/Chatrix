import User from "../Models/user.js";
import bcrypt from "bcryptjs";
import { generateTokens } from "../Lib/util.js"
import cloudnary from "../Lib/cloudnary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) return res.status(400).json({ message: "All fields are required" });
        if (password.length < 6) return res.status(400).json({ message: "Minimum password length should be 6 characters" });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "user with given email already exist" });

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPass
        });

        if (newUser) {
            // jwt tokens
            generateTokens(newUser._id, res);
            await newUser.save();
            res.status(200).json(({
                _id: newUser._id,
                userName: newUser.fullName,
                email: newUser.email,
                profieImg: newUser.profileImg
            }));
        } else {
            res.status(500).json({ message: "Invalid Data" });
        }
    } catch (e) {
        console.log("Signup Error: " + e.message);
        res.status(500).json({ message: "Server Error: " });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const correctPass = await bcrypt.compare(password, user.password);

        if (!correctPass) return res.status(400).json({ message: "Invalid Credentials" });

        generateTokens(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImg: user.profileImg
        });
    } catch (e) {
        console.log("Login Error: " + e.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logged out successfully" });
    } catch (e) {
        console.log("Logout Error: " + e.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { profileImg } = req.body;
        if (!profileImg) return res.status(400).json({ message: "Upload profile picture" });

        const uploadResponse = await cloudnary.uploader.upload(profileImg);
        const updatedUser = await User.findByIdAndUpdate(userId, { profileImg: uploadResponse.secure_url }, { new: true });

        res.json(200).json(updatedUser);

    } catch (e) {
        console.log("Update Profile Error: " + e.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (e) {
        console.log("Authentication Error: " + e.message);
        res.status(500).json({ message: "Server Error" });
    }
};