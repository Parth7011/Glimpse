import spaces
import gradio as gr
import json
from mlpipeline.pipeline.photographer_pipeline import PhotographerPipeline

# Initialize the pipeline
pipeline = PhotographerPipeline()

from mlpipeline.db.repository import PhotoRepository

@spaces.GPU
def process_photo_gpu(event_id: str, photo_id: str):
    """
    ZeroGPU accelerated function.
    Reads the photo from Supabase, extracts faces using the GPU, and saves them.
    """
    try:
        photo = PhotoRepository.get_photo(photo_id)
        if not photo:
            return json.dumps({"error": f"Photo with id {photo_id} not found"})
        
        storage_path = photo.get("storage_path")
        if not storage_path:
            return json.dumps({"error": "Photo has no storage_path"})

        results = pipeline.process_single_photo(
            event_id=event_id,
            storage_path=storage_path,
            photo_id=photo_id,
            filename=photo.get("filename")
        )
        return json.dumps(results)
    except Exception as e:
        return json.dumps({"error": str(e)})

# Expose it via Gradio for ZeroGPU interception
demo = gr.Interface(
    fn=process_photo_gpu,
    inputs=[gr.Textbox(label="Event ID"), gr.Textbox(label="Photo ID")],
    outputs=gr.JSON(label="Processing Results"),
    title="Glimpse ZeroGPU Pipeline",
    description="This endpoint runs on Hugging Face ZeroGPU. Use the @gradio/client in Node.js to trigger this."
)

if __name__ == "__main__":
    demo.launch()
