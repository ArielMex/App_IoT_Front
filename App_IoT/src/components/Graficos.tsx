import { FC } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/Graficos.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface GraficosProps {
  datos: {
    labels: string[];
    temperatura: number[];
    humedad: number[];
    lluvia: number[];
    sol: number[];
  };
  loading: boolean;
}

const Graficos: FC<GraficosProps> = ({ datos }) => {
  if (datos.labels.length === 0) {
    return <div className="no-data">No hay datos para mostrar</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 12
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  const dataLineal = {
    labels: datos.labels,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: datos.temperatura,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 1,
        tension: 0.3,
        pointRadius: 3
      },
      {
        label: "Humedad (%)",
        data: datos.humedad,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 1,
        tension: 0.3,
        pointRadius: 3
      },
    ],
  };

  const dataBarras = {
    labels: datos.labels,
    datasets: [
      {
        label: "Lluvia (%)",
        data: datos.lluvia,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
    ],
  };

  const dataPastel = {
    labels: ["Temperatura", "Humedad", "Lluvia", "Sol"],
    datasets: [
      {
        data: [
          Math.round(datos.temperatura.reduce((a, b) => a + b, 0) / datos.temperatura.length),
          Math.round(datos.humedad.reduce((a, b) => a + b, 0) / datos.humedad.length),
          Math.round(datos.lluvia.reduce((a, b) => a + b, 0) / datos.lluvia.length),
          Math.round(datos.sol.reduce((a, b) => a + b, 0) / datos.sol.length),
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="graficos-container">
      <h2 className="graficos-titulo">Análisis de Datos</h2>
      
      <div className="grafico-group">
        {/* Ahora el gráfico de pastel aparece primero */}
        <div className="grafico-card pie-card">
          <h3>Distribución Promedio</h3>
          <div className="chart-container pie-container">
            <Pie data={dataPastel} options={{
              ...options,
              plugins: {
                legend: {
                  position: 'right' as const,
                }
              }
            }} />
          </div>
        </div>

        {/* El gráfico lineal ahora aparece después */}
        <div className="grafico-card">
          <h3>Tendencias de Temperatura y Humedad</h3>
          <div className="chart-container">
            <Line data={dataLineal} options={options} />
          </div>
        </div>
      </div>
      
      {/* El gráfico de barras se mantiene en su posición */}
      <div className="grafico-card">
        <h3>Niveles de Lluvia</h3>
        <div className="chart-container">
          <Bar data={dataBarras} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Graficos;