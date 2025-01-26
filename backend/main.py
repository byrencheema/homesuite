from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import os
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
# Ensure images directory exists
os.makedirs("images", exist_ok=True)

class ImageData(BaseModel):
    image: str

@app.post("/upload")
async def upload_image(data: ImageData):
    try:
        # Decode the Base64 image
        image_data = data.image.replace("data:image/jpeg;base64,", "")
        image_bytes = base64.b64decode(image_data)
        
        # Save the image to the 'images' directory with a timestamp
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        file_name = f"images/frame-{timestamp}.jpg"
        with open(file_name, "wb") as file:
            file.write(image_bytes)
        
        return {"message": f"Image saved successfully as {file_name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

