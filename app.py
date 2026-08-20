import spaces
import gradio as gr
import json
from mlpipeline.pipeline.photographer_pipeline import PhotographerPipeline

# Initialize the pipeline
pipeline = PhotographerPipeline()

@spaces.GPU
def process_photo_gpu(event_id: str, photo_id: str):
    """
    ZeroGPU accelerated function.
    Reads the photo from Supabase, extracts faces using the GPU, and saves them.
    """
    try:
        results = pipeline.process_event_photo(event_id, photo_id)
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
