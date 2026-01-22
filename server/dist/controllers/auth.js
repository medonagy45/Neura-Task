"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username and password are required" });
        }
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const passwordHash = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.default({
            username,
            passwordHash,
        });
        const savedUser = yield newUser.save();
        res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username and password are required" });
        }
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
