import React, { useState } from 'react';
import { Form, Row, Button, Col } from 'react-bootstrap';
import './App.css';
import * as Papa from 'papaparse';

function App() {
  const [review, setReview] = useState('');
  const [prediction, setPrediction] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  // Maneja cambios en la reseña del usuario
  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  // Realiza predicciones con la reseña ingresada por el usuario
  const handlePredict = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review }),
      });

      if (!response.ok) {
        console.error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  // Maneja cambios en el archivo CSV seleccionado por el usuario
  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  // Realiza predicciones con el archivo CSV seleccionado y genera un archivo CSV con predicciones
  const handleCsvPredict = async () => {
    if (!csvFile) {
      console.error("No se ha seleccionado ningún archivo CSV.");
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        const predictions = [];

        // Itera sobre cada fila en el archivo CSV
        for (let row of results.data) {
          // Verifica si la columna Review está presente y no vacía
          if (!row.Review || row.Review.trim() === "") {
            console.warn("Fila omitida debido a la ausencia o vacío de la columna 'Review'");
            continue;
          }

          const reviewData = { review: row.Review };

          try {
            const response = await fetch('http://127.0.0.1:8000/predict', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
              console.error(`Error en la solicitud: ${response.status} ${response.statusText}`);
              continue;
            }

            const data = await response.json();

            if (!data.prediction) {
              console.error("La respuesta no contiene predicción:", data);
              continue;
            }

            // Añade la predicción a la fila
            row.Class = data.prediction;
            predictions.push(row);
          } catch (error) {
            console.error("Error al realizar la solicitud:", error);
          }
        }

        // Convierte las predicciones a CSV
        const csv = Papa.unparse(predictions);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'predictions.csv';
        link.click();
      },
      error: (error) => {
        console.error("Error al procesar el archivo CSV:", error);
      }
    });
  };

  return (
    <div className='fondo'>
      <div className="container">
        <Row>
          <div className='Banner'>
            <h1 className="title">Proyecto analítica de Textos</h1>
            <p className="subtitle">Grupo 15: Santiago Pardo, Felipe Rueda y Luis Plazas</p>
          </div>
        </Row>
        <Row>
          <Col className='columnaderecha'>
            <div className='archivo-reseña-container'>
              <div className='archivo'>
                <Row>
                  <div className='option1'>
                    <h1>Agregar Reseñas</h1>
                  </div>
                  <div className='formpadd'>
                    <Form>
                      <Form.Group>
                        <Form.Control
                          type="file"
                          onChange={handleFileChange}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                </Row>
                <Row>
                  <div className='centrarbot'>
                    <Button className='bot' variant="primary" type="submit" onClick={handleCsvPredict}>
                      Cargar archivo
                    </Button>
                  </div>
                </Row>
              </div>
              <div className='reseña'>
                <Row>
                  <div className='option1'>
                    <h1>Nueva Reseña</h1>
                  </div>
                </Row>
                <Row>
                  <div className='formpadd'>
                    <Form.Control
                      type="text"
                      id="Review"
                      as="textarea"
                      placeholder='Escribe tu reseña aquí...'
                      value={review}
                      onChange={handleReviewChange}
                    />
                  </div>
                </Row>
                <Row>
                  <div className='centrarbot'>
                    <Button className='bot' variant="primary" type="submit" onClick={handlePredict}>
                      Ver resultados
                    </Button>
                  </div>
                </Row>
                {/* Muestra la predicción de la reseña */}
                {prediction && (
                  <Row>
                    <div className='prediction-result'>
                      <p>La reseña ha recibido una calificación de: {prediction}/5</p>
                    </div>
                  </Row>
                )}
              </div>
            </div>
          </Col>
          <Col className='contexto'>
            <div>
              <Row>
                <h3 className='context-title'>Contexto del Problema</h3>
                <p className='context'>
                  El Ministerio de Comercio, Industria y Turismo de Colombia, junto con COTELCO y varias cadenas hoteleras, están interesados en evaluar y comparar las características de los sitios turísticos para entender qué los hace atractivos. Esta app sirve para analizar tanto los sitios populares como aquellos con bajas recomendaciones para identificar áreas de mejora. Además, de implementar un sistema de calificación que permita medir la popularidad de los sitios y desarrollar estrategias para incrementar su atractivo y promover el turismo.
                </p>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
