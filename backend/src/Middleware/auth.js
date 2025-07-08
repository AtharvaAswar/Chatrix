import jwt from "jsonwebtoken";
import User from "../Models/user.js";

export const protectRoute = async ( req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(400).json({ message: "Login first 'Unauthorized!'"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(! decoded) return res.status(400).json({ message: "Unauthroized User"});
        
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (e) {
        console.log("Login Error: " + e.message);
        res.status(500).json({ message: "Server Error" });
    }
};