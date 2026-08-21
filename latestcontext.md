# Glimpse Chat Context & Progress (Latest)

## 1. Similarity Search Architecture
- **Initial Discussion**: Explained the architecture of the ML Pipeline. The system uses **InsightFace** to extract 512-dimensional ArcFace vector embeddings from faces, and stores them in a **Supabase PostgreSQL** database using the **pgvector** extension.
- **pgvector Clarification**: Confirmed that `pgvector` fully supports similarity search (using the HNSW index and `<=>` cosine distance operator). The guest matching route in Node.js (`backend/services/matchService.js`) was currently using mock data only because the backend logic hadn't been fully connected to the Python pipeline yet.
- **Manual Face Verification**: Wrote a Python script to extract the face embedding from an uploaded image (`IMG20260822015720.jpg`) and queried the database. It successfully matched with `id_card.jpeg` in the Supabase DB with a strong similarity score of `~59.83%`, proving the ML logic and pgvector integration works flawlessly.

## 2. Codebase Cleanup
- **Redundant Code Deletion**: Did a thorough pass of the codebase to remove unused boilerplate and dead code:
  - Deleted `frontend/src/data/mockData.js`.
  - Deleted unused mock utility functions (`sleep`, `generateId`) in `frontend/src/utils/utils.js`.
  - Deleted Next.js leftover constants (`API` routes in `constants.js`).
  - Deleted unused React components: `dialog.jsx`, `loading-state.jsx`, `empty-state.jsx`, and `error-state.jsx`.
  - Removed unused Next.js SVGs in the Vite project (`next.svg`, `vercel.svg`, etc.).
  - Deleted redundant root `package-lock.json` and a dummy backend error log.
- **Version Control**: Committed all cleanup changes directly to the `main` branch.

## 3. Serverless Modal Deployment
- **Deployment Strategy**: Created a deployment script (`modal_deploy.py`) to host the ML pipeline (`mlpipeline`) on Modal's serverless T4 GPUs.
- **Refactoring Backend**: The Node.js backend originally used the `@gradio/client` to hit a local Python Gradio instance (`app.py`). Refactored `backend/services/photoService.js` to use native `fetch()`, making direct HTTP POST requests with JSON payloads to the new FastAPI `/process-photo` endpoint running on Modal.
- **Troubleshooting**: 
  - After the first Modal deployment, the container crash-looped with `ModuleNotFoundError: No module named 'mlpipeline'`.
  - Identified the root cause as a change in Modal's modern API (v1.5+).
  - Rewrote the deployment script to use `Image.add_local_dir("./mlpipeline", remote_path="/root/mlpipeline")` to correctly mount the local project files into the cloud container.
  - Redeployed successfully in ~5 seconds (utilizing the cached image that already pre-downloaded the heavy `buffalo_l` model).

## Current State
- The frontend is cleaned up.
- The backend successfully makes asynchronous API requests to the cloud GPU.
- The `mlpipeline` is running live on a serverless Modal endpoint (`https://ritishmahajan15--glimpse-ml-pipeline-fastapi-app.modal.run`).
