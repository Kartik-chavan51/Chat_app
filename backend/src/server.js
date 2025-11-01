import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();
const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);

app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.listen(PORT, (req,res) => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB();
});