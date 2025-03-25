import { FC } from "react";
//import "../styles/ParcelasEliminadas.css";

interface Parcela {
  id: number;
  nombre: string;
  ubicacion: string;
  responsable: string;
  tipo_cultivo: string;
  ultimo_riego: string;
  sensor: {
    humedad: number;
    temperatura: number;
    lluvia: number;
    sol: number;
  };
}

interface ParcelasEliminadasProps {
  parcelas: Parcela[];
}

const ParcelasEliminadas: FC<ParcelasEliminadasProps> = ({ parcelas }) => {
  if (parcelas.length === 0) {
    return <div className="no-data">No hay parcelas eliminadas</div>;
  }

  return (
    <div className="parcelas-eliminadas-container">
      <h2>Parcelas Eliminadas</h2>
      <div className="parcelas-grid">
        {parcelas.map((parcela) => (
          <div key={parcela.id} className="parcela-card">
            <h3>{parcela.nombre}</h3>
            <div className="parcela-info">
              <p><strong>Ubicación:</strong> {parcela.ubicacion}</p>
              <p><strong>Responsable:</strong> {parcela.responsable}</p>
              <p><strong>Cultivo:</strong> {parcela.tipo_cultivo}</p>
              <p><strong>Último riego:</strong> {parcela.ultimo_riego}</p>
              <div className="sensor-data">
                <h4>Datos del sensor:</h4>
                <p>🌡️ {parcela.sensor.temperatura}°C</p>
                <p>💧 {parcela.sensor.humedad}%</p>
                <p>🌧️ {parcela.sensor.lluvia}%</p>
                <p>☀️ {parcela.sensor.sol}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParcelasEliminadas;