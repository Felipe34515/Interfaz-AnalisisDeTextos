from fastapi import FastAPI, Request
from pydantic import BaseModel
from joblib import load
from fastapi.middleware.cors import CORSMiddleware

class ReviewModel(BaseModel):
    review: str

class Model:
    def __init__(self):
        self.model = load("pipeline.joblib")

    def predict_rating(self, review):
        return int(self.model.predict([review])[0])

app = FastAPI()
model = Model()

# Configuración de CORS
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict_review(review: ReviewModel):
    prediction = model.predict_rating(review.review)
    return {"review": review.review, "prediction": prediction}
