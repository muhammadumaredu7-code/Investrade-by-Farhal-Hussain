import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from "./controller/clerkWebhook.js";


const app = express()
app.use(cors()) // Enable Cross-Origin Resources Sharing

// API to listen to Stripe Webhooks


// API to listen to Clerk Webhooks
app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

// Middleware for all non-webhook API routes
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send("API is working"))



const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
