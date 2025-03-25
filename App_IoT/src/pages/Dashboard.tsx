import { FC, useState, useEffect } from "react";
import { Cloud, Sun, Thermometer } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Mapa from "../components/Mapa";
import WeatherCard from "../components/WeatherCard";
import Graficos from "../components/Graficos";
import ParcelasEliminadas from "../components/ParcelasEliminadas";
import { fetchData, deleteParcel } from "../services/api";
import "../styles/Dashboard.css";

interface SensorData {
  humedad: number;
  temperatura: number;
  lluvia: number;
  sol: number;
}

interface Parcela {
  id: number;
  nombre: string;
  ubicacion: string;
  responsable: string;
  tipo_cultivo: string;
  ultimo_riego: string;
  sensor: SensorData;
  latitud: number;
  longitud: number;
  estado?: string;
  deletedAt?: string;
}

interface ApiResponse {
  sensores: SensorData;
  parcelas: Parcela[];
}

const Dashboard: FC = () => {
  const [view, setView] = useState("dashboard");
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [deletedParcels, setDeletedParcels] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      setApiData(data);
      localStorage.setItem('apiData', JSON.stringify(data));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error loading data:", error);
      const savedData = localStorage.getItem('apiData');
      if (savedData) setApiData(JSON.parse(savedData));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParcel = async (id: number) => {
    if (!apiData) return;
    
    const parcelToDelete = apiData.parcelas.find(p => p.id === id);
    if (!parcelToDelete) return;

    try {
      await deleteParcel(id);
      setApiData({
        ...apiData,
        parcelas: apiData.parcelas.filter(p => p.id !== id)
      });

      setDeletedParcels([...deletedParcels, {
        ...parcelToDelete,
        estado: "eliminada",
        deletedAt: new Date().toISOString()
      }]);
    } catch (error) {
      console.error("Error deleting parcel:", error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  const handleSelect = (selectedView: string) => {
    setView(selectedView);
  };

  if (!apiData) {
    return <div className="loading">Cargando datos iniciales...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar onSelect={handleSelect} currentView={view} />
      <div className="main-content">
        <Header 
          onRefresh={handleRefresh} 
          loading={loading}
          lastUpdated={lastUpdated}
        />
        <div className="dashboard-content">
          {view === "dashboard" && (
            <>
              <div className="weather-dashboard">
                <div className="map-weather-container">
                  <div className="map-container">
                    <Mapa 
                      parcelas={apiData.parcelas} 
                      loading={loading}
                      onDeleteParcel={handleDeleteParcel}
                    />
                  </div>
                  <div className="weather-cards-container">
                    <WeatherCard 
                      title="Temperatura" 
                      value={`${apiData.sensores.temperatura} °C`} 
                      icon={<Thermometer className="text-gray-600" />}
                      loading={loading}
                    />
                    <WeatherCard 
                      title="Humedad" 
                      value={`${apiData.sensores.humedad}%`}
                      loading={loading}
                    />
                    <WeatherCard 
                      title="Lluvia" 
                      icon={<Cloud className="text-gray-600" />} 
                      value={`${apiData.sensores.lluvia}%`}
                      loading={loading}
                    />
                    <WeatherCard 
                      title="Intensidad del sol" 
                      icon={<Sun className="text-gray-600" />} 
                      value={`${apiData.sensores.sol}%`}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              <div className="graficos-section">
                <Graficos 
                  datos={{
                    labels: apiData.parcelas.map(p => p.nombre),
                    temperatura: apiData.parcelas.map(p => p.sensor.temperatura),
                    humedad: apiData.parcelas.map(p => p.sensor.humedad),
                    lluvia: apiData.parcelas.map(p => p.sensor.lluvia),
                    sol: apiData.parcelas.map(p => p.sensor.sol)
                  }}
                  loading={loading}
                />
              </div>
            </>
          )}
          {view === "parcelas-eliminadas" && (
            <ParcelasEliminadas 
              parcelas={deletedParcels}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;