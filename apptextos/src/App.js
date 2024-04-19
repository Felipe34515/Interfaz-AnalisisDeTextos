import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div class="fondo">
      <header class="App-header">
        <h1 >Interfaz Análisis de Reseñas</h1>
      </header>

      <h2>Bienvenido señor usuario</h2>
      
      
      <p>El Ministerio de Comercio, Industria y Turismo de Colombia, la Asociación Hotelera y Turística de Colombia – COTELCO, cadenas hoteleras de la talla de Hilton, Hoteles Estelar, Holiday Inn y hoteles pequeños ubicados en diferentes municipios de Colombia están interesados en analizar las características de sitios turísticos que los hacen atractivos para turistas locales o de otros países, ya sea para ir a conocerlos o recomendarlos. De igual manera, quieren comparar las características de dichos sitios, con aquellos que han obtenido bajas recomendaciones y que están afectando el número de turistas que llegan a ellos. Adicionalmente, quieren tener un mecanismo para determinar la calificación que tendrá un sitio por parte de los turistas y así, por ejemplo, aplicar estrategias para identificar oportunidades de mejora que permitan aumentar la popularidad de los sitios y fomentar el turismo. </p>
      <h4> Porfavor cargue aquí su archivo a analizar</h4>
      <input style={{width: "100%"}} type="file" id="myFile"/>
      <h4> Porfavor cargue aquí si quieres agregar una nueva reseña</h4>
      
      <button onclick="loadFile()">Vizualizar resultados</button>

    </div>
  );
}

export default App;
