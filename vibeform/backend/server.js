import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import formRoutes from "./routes/formRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000 ; 

app.use(cors({ 
  origin: ['https://vibe-form-one.vercel.app'], 
  credentials: true
}));  // ,  http://localhost:5173
 
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/responses", responseRoutes);

app.get("/", (req, res) => {
  res.send("VibeForm API running");
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
