import os
import uvicorn
from mlpipeline.api.app import app

# Hugging Face ZeroGPU / Gradio spaces run on port 7860 by default
PORT = int(os.getenv("PORT", 7860))

if __name__ == "__main__":
    print(f"Starting Glimpse ML Pipeline on Hugging Face Space (Port {PORT})...")
    uvicorn.run("mlpipeline.api.app:app", host="0.0.0.0", port=PORT, workers=1)
