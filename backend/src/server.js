import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.route.js";

const app=express();
const PORT = process.env.PORT;


app.use("api/auth",authRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});