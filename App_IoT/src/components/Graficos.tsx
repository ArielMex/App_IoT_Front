import { FC } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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

  // Función para calcular la frecuencia de los datos de lluvia
  const calcularFrecuenciaLluvia = (datosLluvia: number[], bins: number = 5) => {
    const max = Math.max(...datosLluvia);
    const min = Math.min(...datosLluvia);
    const range = max - min;
    const binSize = range / bins;
    
    const binsArray = Array(bins).fill(0).map((_, i) => ({
      min: min + (i * binSize),
      max: min + ((i + 1) * binSize),
      count: 0
    }));
    
    datosLluvia.forEach(valor => {
      for (let i = 0; i < binsArray.length; i++) {
        if (valor >= binsArray[i].min && (i === binsArray.length - 1 ? valor <= binsArray[i].max : valor < binsArray[i].max)) {
          binsArray[i].count++;
          break;
        }
      }
    });
    
    return {
      labels: binsArray.map(bin => `${bin.min.toFixed(1)}-${bin.max.toFixed(1)}%`),
      data: binsArray.map(bin => bin.count)
    };
  };

  const frecuenciaLluvia = calcularFrecuenciaLluvia(datos.lluvia);

  // Datos para el gráfico de frecuencia de lluvia
  const dataFrecuenciaLluvia = {
    labels: frecuenciaLluvia.labels,
    datasets: [
      {
        label: "Frecuencia de Lluvia",
        data: frecuenciaLluvia.data,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      },
    ],
  };

  // Datos para el histograma de promedios
  const dataHistograma = {
    labels: ["Temperatura", "Humedad", "Lluvia", "Sol"],
    datasets: [
      {
        label: "Promedio de valores",
        data: [
          Math.round(datos.temperatura.reduce((a: any, b: any) => a + b, 0) / datos.temperatura.length),
          Math.round(datos.humedad.reduce((a: any, b: any) => a + b, 0) / datos.humedad.length),
          Math.round(datos.lluvia.reduce((a: any, b: any) => a + b, 0) / datos.lluvia.length),
          Math.round(datos.sol.reduce((a: any, b: any) => a + b, 0) / datos.sol.length),
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
        {/* Histograma de promedios */}
        <div className="grafico-card histogram-card">
          <h3>Distribución Promedio</h3>
          <div className="chart-container histogram-container">
            <Bar 
              data={dataHistograma} 
              options={{
                ...options,
                indexAxis: 'x',
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Gráfico lineal */}
        <div className="grafico-card">
          <h3>Tendencias de Temperatura y Humedad</h3>
          <div className="chart-container">
            <Line data={dataLineal} options={options} />
          </div>
        </div>
      </div>
      
      {/* Gráfico de frecuencia de lluvia */}
      <div className="grafico-card">
        <h3>Frecuencia de Niveles de Lluvia</h3>
        <div className="chart-container">
          <Bar 
            data={dataFrecuenciaLluvia} 
            options={{
              ...options,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Frecuencia'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Rango de lluvia (%)'
                  }
                }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Graficos;