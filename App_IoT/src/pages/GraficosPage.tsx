import { FC, useEffect, useState } from "react";
import Graficos from "../components/Graficos";
import { fetchData } from "../services/api";
//import "../styles/GraficosPage.css";

const GraficosPage: FC = () => {
  const [datos, setDatos] = useState({
    labels: [] as string[],
    temperatura: [] as number[],
    humedad: [] as number[],
    lluvia: [] as number[],
    sol: [] as number[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiData = await fetchData();
        setDatos({
          labels: apiData.parcelas.map((p: { nombre: any; }) => p.nombre),
          temperatura: apiData.parcelas.map((p: { sensor: { temperatura: any; }; }) => p.sensor.temperatura),
          humedad: apiData.parcelas.map((p: { sensor: { humedad: any; }; }) => p.sensor.humedad),
          lluvia: apiData.parcelas.map((p: { sensor: { lluvia: any; }; }) => p.sensor.lluvia),
          sol: apiData.parcelas.map((p: { sensor: { sol: any; }; }) => p.sensor.sol),
        });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Cargando gráficos...</div>;
  }

  return (
    <div className="graficos-page">
      <Graficos datos={datos} loading={false} />
    </div>
  );
};

export default GraficosPage;