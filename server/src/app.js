import express from "express";
import cors from "cors";
import groupRoutes from "./routes/group.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);
export default app;