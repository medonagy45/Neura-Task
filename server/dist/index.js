"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const auth_1 = __importDefault(require("./routes/auth"));
const errors_1 = require("./utils/errors");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/neura-task";
// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL || "http://localhost:5173"
        : "*",
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/tasks", tasks_1.default);
// Error handling middleware (must be after all routes)
app.use(errors_1.errorHandler);
// Database Connection
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
});
