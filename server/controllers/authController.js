import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const fallbackUsers = new Map();
const fallbackAdminEmail = "admin@fleetdash.com";
const fallbackAdminPassword = process.env.FALLBACK_ADMIN_PASSWORD || "admin123";

const createToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET || "fallback-secret",
        {
            expiresIn: "7d",
        }
    );
};

const sendAuthSuccess = (res, user, message = "Login Successful") => {
    const token = createToken(user);

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    return res.status(200).json({
        success: true,
        message,
        token,
        user: userData,
    });
};

const getFallbackUser = async (email, password) => {
    const normalizedEmail = email.toLowerCase();

    if (
        normalizedEmail === fallbackAdminEmail &&
        password === fallbackAdminPassword
    ) {
        return {
            _id: "fallback-admin",
            name: "System Admin",
            email: normalizedEmail,
            role: "admin",
            password: await bcrypt.hash(fallbackAdminPassword, 10),
        };
    }

    const storedUser = fallbackUsers.get(normalizedEmail);

    if (!storedUser) {
        return null;
    }

    const isMatch = await bcrypt.compare(password, storedUser.password);
    if (!isMatch) {
        return null;
    }

    return storedUser;
};

const createFallbackUser = async ({ name, email, password, role }) => {
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        _id: `fallback-${Date.now()}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
    };

    fallbackUsers.set(normalizedEmail, user);
    return user;
};

// =======================
// Register User
// =======================
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (mongoose.connection.readyState !== 1) {
            const existingUser = fallbackUsers.get(email.toLowerCase());

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }

            const user = await createFallbackUser({
                name,
                email,
                password,
                role: role || "manager",
            });

            return res.status(201).json({
                success: true,
                message: "User Registered Successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
        });

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: userData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =======================
// Login User
// =======================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (mongoose.connection.readyState !== 1) {
            const fallbackUser = await getFallbackUser(email, password);

            if (!fallbackUser) {
                return res.status(503).json({
                    success: false,
                    message:
                        "Database is unavailable. Please use admin@fleetdash.com / admin123 for development access.",
                });
            }

            return sendAuthSuccess(
                res,
                fallbackUser,
                "Login Successful (fallback mode)"
            );
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password",
            });
        }

        return sendAuthSuccess(res, user, "Login Successful");
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};