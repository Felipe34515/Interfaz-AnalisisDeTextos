from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import io

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Cargar el pipeline desde el archivo joblib
pipe = joblib.load('pipeline.joblib')

# Definir el modelo de datos
class Resena(BaseModel):
    res: str

# Ruta /a para predecir un solo valor
@app.post("/a")
async def predict_single_value(resena: Resena):
    # Obtener la reseña del objeto recibido
    res = resena.res
    
    # Usar el pipeline para hacer la predicción
    pred = pipe.predict([res])

    pred_python = pred[0].tolist()
    
    # Retornar la predicción como respuesta JSON
    return {"pred": pred_python}

# Ruta /b para predecir un archivo completo de valores
async def predict_file(file: UploadFile = File(...)):
    # Leer el contenido del archivo CSV
    csv_content = await file.read()
    
    # Convertir el contenido en un DataFrame de pandas
    df = pd.read_csv(io.BytesIO(csv_content))
    
    # Usar el pipeline para hacer predicciones en el DataFrame
    predictions = pipe.predict(df)
    
    # Añadir las predicciones como una nueva columna en el DataFrame
    df['pred'] = predictions
    
    # Convertir el DataFrame a un archivo CSV sin índice
    processed_csv = df.to_csv(index=False)
    
    # Devolver el archivo CSV con las predicciones
    return StreamingResponse(
        io.BytesIO(processed_csv.encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=predictions.csv"}
    )