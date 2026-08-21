import { Client } from "@gradio/client";
import dotenv from "dotenv";
dotenv.config();

async function testConnection() {
  try {
    console.log("Connecting to Ritish15/glimpse with token...");
    const client = await Client.connect("Ritish15/glimpse", {
        hf_token: process.env.HF_TOKEN
    });
    console.log("Successfully connected!");
    
    // We can also see the available API endpoints
    console.log("Making a test prediction...");
    // Let's pass dummy IDs just to see if the ML pipeline responds (it might fail to find the photo in DB, which proves it's working)
    const result = await client.predict("/process_photo_gpu", { 
        event_id: "test-event-id", 
        photo_id: "test-photo-id" 
    });
    
    console.log("Result received:", result.data);
  } catch (err) {
    console.error("Failed to connect or predict:", err);
  }
}

testConnection();
