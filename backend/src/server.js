import "dotenv/config";
import express from "express";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);  // Added missing forward slash

app.listen(PORT, (req,res) => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB();
});