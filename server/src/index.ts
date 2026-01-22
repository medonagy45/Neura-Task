import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/tasks";
import authRoutes from "./routes/auth";
import { errorHandler } from "./utils/errors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/neura-task";

// Middleware
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL || "http://localhost:5173"
      : "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Error handling middleware (must be after all routes)
app.use(errorHandler);

// Database Connection
mongoose
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
