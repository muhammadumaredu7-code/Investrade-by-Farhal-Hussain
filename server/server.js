import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from "./controller/clerkWebhook.js";




connectDB()


const app = express()
app.use(cors()) // Enable Cross-Origin Resources Sharing

// API to listen to Stripe Webhooks


// Middleware
app.use(express.json())
app.use(clerkMiddleware())

// API to listen to Clerk Webhooks
app.use('/api/clerk', clerkWebhooks);

app.get('/', (req, res) => res.send("API is working"))



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
