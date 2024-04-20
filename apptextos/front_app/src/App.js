import React from 'react';
import './App.css';
import { Form, Row, Button } from 'react-bootstrap';
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
        <div className='centrar'>
          <h1 className='title'>PROYECTO 1 - ANALÍTICA DE TEXTOS</h1>
          <h1>INTELIGENCIA DE NEGOCIOS</h1>
          <h3>Grupo 15</h3>
          <h3>Santiago Pardo, Felipe Rueda y Luis Plazas</h3>
        </div>
      </Row>


      <Row>
        <h3 className='context-title'>Contexto del Problema</h3>
        <p className='context'>
        El Ministerio de Comercio, Industria y Turismo de Colombia, la Asociación Hotelera y Turística de Colombia – COTELCO, cadenas hoteleras de la talla de Hilton, Hoteles Estelar, Holiday Inn y hoteles pequeños ubicados en diferentes municipios de Colombia están interesados en analizar las características de sitios turísticos que los hacen atractivos para turistas locales o de otros países, ya sea para ir a conocerlos o recomendarlos. De igual manera, quieren comparar las características de dichos sitios, con aquellos que han obtenido bajas recomendaciones y que están afectando el número de turistas que llegan a ellos. Adicionalmente, quieren tener un mecanismo para determinar la calificación que tendrá un sitio por parte de los turistas y así, por ejemplo, aplicar estrategias para identificar oportunidades de mejora que permitan aumentar la popularidad de los sitios y fomentar el turismo.
        </p>

      </Row>

      <Row>
        <div className='greeting'>
          <h3> Bienvenido, señor usuario! </h3>
        </div>
      </Row>

      <Row>
        <div className='option1'>
          <h1>Si desea agregar una reseña, por favor ingrésela aquí</h1>
        </div>
      </Row>
      <Row>
        <div className='formpadd'>
        <Form>
          <Form.Group>
            <Form.Control  id="Review"  as="textarea" rows={5} placeholder='Ingrese su reseña en este cuadro'  value={review} onChange={handleReview}/>
          </Form.Group>
        </Form>
        </div>
      </Row>

      <Row>
        <div className='centrarbot'>
        <Button className='bot' variant="primary" type="submit" onClick={handlePredictions}>
          Hacer predicción
        </Button>
        </div>
      </Row>




      <Row>
        <div className='centres'>
          {!finished && <h3> Por favor espere, su predicción se está cargando... </h3>}
          <h3> La reseña pertenece a la clase: {prediction} </h3>
        </div>
      </Row>

      <Row>
        <div className='option2'>
          <h1>Si desea agregar muchas reseñas, por favor ingrese el archivo aquí</h1>
        </div>
      </Row>

      <Row>
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
          Generar archivo de predicción
        </Button>
        </div>
      </Row>

      <Row>
        <div className='centres'>
          {!finishedFile && <h3> Por favor espere, la predicción de su archivo se está cargando... </h3>}
        </div>
      </Row>

      <Row>
        <div style={{padding:'50px'}}></div>
      </Row>
    </div>
    </div>
  );
}

export default App;
