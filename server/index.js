import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";


dotenv.config();
// * Setup
const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;

// ! Middlewares: follow this order for the middlewares

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth/", authRoutes);
app.use("/api/contacts", contactsRoutes);

// # Starting the server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


setupSocket(server);
mongoose
  .connect(databaseURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
