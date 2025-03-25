import { FC } from "react";
import "../styles/ParcelasEliminadas.css";

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
  latitud: number;
  longitud: number;
  estado?: string;
  deletedAt?: string;
}

interface ParcelasEliminadasProps {
  parcelas: Parcela[];
  loading: boolean;
}

const ParcelasEliminadasPage: FC<ParcelasEliminadasProps> = ({ parcelas, loading }) => {
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="parcelas-eliminadas-container">
      <h2>Parcelas Eliminadas</h2>
      {parcelas.length === 0 ? (
        <p className="no-data">No hay parcelas eliminadas</p>
      ) : (
        <div className="parcelas-grid">
          {parcelas.map((parcela) => (
            <div key={`${parcela.id}-${parcela.deletedAt}`} className="parcela-card">
              <h3>{parcela.nombre}</h3>
              <div className="parcela-info">
                <p><strong>Ubicación:</strong> {parcela.ubicacion}</p>
                <p><strong>Responsable:</strong> {parcela.responsable}</p>
                <p><strong>Cultivo:</strong> {parcela.tipo_cultivo}</p>
                <p><strong>Eliminada el:</strong> {new Date(parcela.deletedAt || '').toLocaleString()}</p>
                <div className="sensor-data">
                  <h4>Últimos datos registrados:</h4>
                  <p>🌡️ {parcela.sensor.temperatura}°C</p>
                  <p>💧 {parcela.sensor.humedad}%</p>
                  <p>🌧️ {parcela.sensor.lluvia}%</p>
                  <p>☀️ {parcela.sensor.sol}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParcelasEliminadasPage;