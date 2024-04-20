import React from 'react';
import './App.css';
import { Form, Row, Button, Col } from 'react-bootstrap';
import { useState } from "react";


function App() {

  const [review, setReview] = useState("");
  const[finished, setFinished] = useState(true);
  const[prediction, setPrediction] = useState(null);
  const[file, setFile] = useState(null);
  const[finishedFile, setFinishedFile] = useState(true);


  const handleReview = (e) =>{
    const res = e.target.value;
    setReview(res)
  }

  const handleFileChange = (e)=>{

    setFile(e.target.files[0]);

  }

  const handlePredictions = async (e)=>{

    setFinished(false);

    const requestBody = {
      // Example data fields
      res: review
    };


    try {
      const response = await fetch('http://127.0.0.1:8000/a', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
      });

      if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          setFinished(true);
          setPrediction(responseData.pred)
      } else {
          console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  const handlePredictions2 = async (e) => {

    setFinishedFile(false);
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/b', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Predicciones"
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setFinishedFile(true);

    } catch (error) {
      console.error('Error:', error);
    }
  }



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
                    <Form.Control type="file" onChange={handleFileChange}/>
                  </Form.Group>
                </Form>
              </div>
            </Row>
            <Row>
              <div className='centrarbot'>
                <Button className='bot' variant="primary" type="submit" onClick={handlePredictions2}>
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
                <Form>
                  <Form.Group>
                    <Form.Control id="Review" as="textarea"  placeholder='Ingrese su reseña en este cuadro' value={review} onChange={handleReview}/>
                  </Form.Group>
                </Form>
              </div>
            </Row>
            <Row>
              <div className='centrarbot'>
                <Button className='bot' variant="primary" type="submit" onClick={handlePredictions}>
                  Ver resultados
                </Button>
              </div>
            </Row>
          </div>
        </div>
      </Col>
      <Col className='contexto'>
        <div >
          <Row>
            <h3 className='context-title'>Contexto del Problema</h3>
            <p className='context'>
              El Ministerio de Comercio, Industria y Turismo de Colombia, la Asociación Hotelera y Turística de Colombia – COTELCO, cadenas hoteleras de la talla de Hilton, Hoteles Estelar, Holiday Inn y hoteles pequeños ubicados en diferentes municipios de Colombia están interesados en analizar las características de sitios turísticos que los hacen atractivos para turistas locales o de otros países, ya sea para ir a conocerlos o recomendarlos. De igual manera, quieren comparar las características de dichos sitios, con aquellos que han obtenido bajas recomendaciones y que están afectando el número de turistas que llegan a ellos. Adicionalmente, quieren tener un mecanismo para determinar la calificación que tendrá un sitio por parte de los turistas y así, por ejemplo, aplicar estrategias para identificar oportunidades de mejora que permitan aumentar la popularidad de los sitios y fomentar el turismo.
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
