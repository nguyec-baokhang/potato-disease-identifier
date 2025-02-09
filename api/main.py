from fastapi import FastAPI,File,UploadFile
import uvicorn
import numpy as np 
from io import BytesIO
from PIL import Image
import tensorflow as tf
import keras
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI() 

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://3.26.102.143",
    "http://3.26.102.143:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)


MODEL = keras.models.load_model("api/saved_models/1/model.keras")
CLASS_NAMES = ["Early Blight","Late Blight","Healthy"]

@app.get('/ping')
async def ping(): 
    return "I am alive"

def read_file_as_image(data) -> np.ndarray: 
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post('/predict')
async def predict(
    file: UploadFile = File(...)
): 
    bytes = (await file.read() )
    image = read_file_as_image(bytes)
    img_batch = np.expand_dims(image,axis=0)
    prediction = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(prediction[0])]
    confidence = float(np.max(prediction[0]))
    return{
        'class': predicted_class,
        'confidence': confidence
    }


if __name__ == "__main__":
    uvicorn.run(app,host="localhost",port=8000)
