# ML Pipeline User Manual (for Express.js Backend)

This guide explains how to connect your Express.js backend to the **Glimpse ML Pipeline** running on **Modal Serverless GPUs**.

---

## 1. Overview

We have migrated away from Hugging Face ZeroGPU and Gradio. The ML Pipeline is now a blazing-fast **FastAPI** application deployed on Modal. 

Because it exposes standard REST endpoints, you do **not** need any specialized SDKs like `@gradio/client`. You can simply use standard `fetch()` or `axios`.

---

## 2. Setting up the Client

When a photographer uploads a photo, your backend should:
1. Upload the photo to Supabase Storage.
2. Insert a record into your Supabase `photos` table.
3. Send a `POST` request to the Modal FastAPI endpoint.

```javascript
import { adminSupabase } from "../config/supabase.js";

const ML_PIPELINE_URL = "https://ritishmahajan15--glimpse-ml-pipeline-fastapi-app.modal.run";

export const triggerProcessing = async (eventId, photos) => {
  // 1. Mark photos as processing in DB
  await adminSupabase.from('photos').update({ status: 'processing' }).in('id', photos.map(p => p.id));

  // 2. Fire requests to Modal concurrently (Fire-and-forget!)
  Promise.allSettled(photos.map(async (photo) => {
    try {
      const response = await fetch(`${ML_PIPELINE_URL}/process-photo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              event_id: eventId,
              photo_id: photo.id,
              storage_path: photo.storage_path,
              filename: photo.filename
          })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      console.log(`Successfully triggered ML for photo ${photo.id}`);
      
    } catch (err) {
      console.error(`Failed to process photo ${photo.id}:`, err);
      // Fallback: Mark failed if the server is completely unreachable
      await adminSupabase.from('photos').update({ status: 'failed' }).eq('id', photo.id);
    }
  }));
};
```

---

## 3. How Batching Works Now

Because Modal provides serverless GPU auto-scaling, you don't need to implement complex queueing in your Express backend.

If a photographer uploads 50 photos, you can simply map over them and fire 50 concurrent `fetch()` POST requests. Modal will instantly spin up multiple GPU containers in the cloud to process them in parallel. 

The ML Pipeline natively connects to Supabase and updates the status to `ready` itself once finished. Therefore, your Express backend should simply fire the requests and return a success response to the client immediately, while the frontend polls the database for updates!
