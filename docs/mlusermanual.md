# ML Pipeline User Manual (for Express.js Backend)

This guide explains how to connect your Express.js backend to the **Glimpse ML Pipeline** running on Hugging Face Spaces using the ZeroGPU hardware.

---

## 1. Installation

You can no longer use standard REST `fetch()` calls to interact with the ML pipeline because it is now running in a Hugging Face Gradio Space (which uses WebSockets to bypass the GPU queues).

You must install the official Hugging Face `@gradio/client` in your backend:

```bash
cd backend
npm install @gradio/client
```

---

## 2. Setting up the Client

When you receive a photo upload from a photographer:
1. Upload the photo to Supabase Storage.
2. Insert a record into your Supabase `photos` table.
3. Call the Hugging Face Space using the `event_id` and the `photo_id`.

```javascript
import { Client } from "@gradio/client";
import { supabase } from "../config/supabase.js"; // Your Supabase client

export const processPhoto = async (req, res) => {
    try {
        const { eventId } = req.params;
        const file = req.file;

        // 1. Upload to Supabase Storage
        const storagePath = `events/${eventId}/${file.originalname}`;
        await supabase.storage.from('event-photos').upload(storagePath, file.buffer);

        // 2. Insert into the database to get a photo ID
        const { data: photo } = await supabase.from('photos').insert({
            event_id: eventId,
            storage_path: storagePath,
            status: 'processing'
        }).select().single();

        // 3. Connect to the Hugging Face Space
        const client = await Client.connect("Ritish15/glimpse");
        
        // 4. Trigger the ZeroGPU Pipeline
        const result = await client.predict("/process_photo_gpu", { 
            event_id: eventId, 
            photo_id: photo.id, 
        });

        // 5. Parse the result (The ML pipeline returns a JSON string)
        const mlPayload = JSON.parse(result.data[0]);
        
        if (mlPayload.error) {
            throw new Error(mlPayload.error);
        }

        // Return success to the frontend!
        res.status(200).json({
            success: true,
            data: mlPayload
        });

    } catch (err) {
        console.error("ML Pipeline failed:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};
```

---

## 3. How Batching Works Now

Previously, we exposed a `/process-batch` API endpoint. 
With Hugging Face ZeroGPU, the Gradio client handles concurrency internally! 

If a photographer uploads 50 photos, you can simply call `client.predict` 50 times in a loop (using `Promise.all`). 
Gradio will automatically put them in a queue, allocate the GPU, process them, and resolve the promises as they finish.

```javascript
export const processBatch = async (req, res) => {
    const { photos } = req.body; // Array of { eventId, photoId }
    
    try {
        const client = await Client.connect("Ritish15/glimpse");
        
        // Fire 50 predictions concurrently!
        const promises = photos.map(photo => 
            client.predict("/process_photo_gpu", { 
                event_id: photo.eventId, 
                photo_id: photo.photoId 
            })
        );

        // Wait for all of them to finish
        const results = await Promise.allSettled(promises);
        
        // Process results
        const successful = results.filter(r => r.status === 'fulfilled');
        
        res.json({
            success: true,
            processedCount: successful.length,
            totalCount: photos.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
```

## 4. Why this approach?

Because we are using the **free** ZeroGPU tier on Hugging Face, the Hugging Face hypervisor dynamically allocates an A100 GPU to our container only when a Gradio request is made. By using `@gradio/client`, we hook directly into their queue system, ensuring your Express backend doesn't timeout while waiting for GPU allocation.
