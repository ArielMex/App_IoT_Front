import mapboxgl, { type Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/Mapa.css";
import { Parcela } from "../types/api";

interface MapaProps {
  parcelas: Parcela[];
  loading: boolean;
  onDeleteParcel: (id: number) => void;
}

function Mapa({ parcelas, loading, onDeleteParcel }: MapaProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = "pk.eyJ1IjoibmFodWkiLCJhIjoiY20yOTBiNjltMDBhYjJzcHk5MDdmc2xxNCJ9.mV_b0a8Xd74QivUBZqmADg";

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-86.81622976235745, 21.091662297320077],
        zoom: 10,
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || loading) return;

    markers.forEach(marker => marker.remove());
    
    const newMarkers = parcelas.map(parcela => {
      const popupContent = `
        <div class="parcela-popup">
          <h3>${parcela.nombre}</h3>
          <div class="popup-details">
            <p><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
            <p><strong>Responsable:</strong> ${parcela.responsable}</p>
            <p><strong>Cultivo:</strong> ${parcela.tipo_cultivo}</p>
            <p><strong>Último riego:</strong> ${parcela.ultimo_riego}</p>
            <div class="sensor-data">
              <h4>Datos del sensor:</h4>
              <p>Temperatura: ${parcela.sensor.temperatura}°C</p>
              <p>Humedad: ${parcela.sensor.humedad}%</p>
              <p>Lluvia: ${parcela.sensor.lluvia}%</p>
              <p>Sol: ${parcela.sensor.sol}%</p>
            </div>
          </div>
          <div class="popup-actions">
            <button class="delete-btn" data-id="${parcela.id}">Eliminar Parcela</button>
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker()
        .setLngLat([parcela.longitud, parcela.latitud])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        setTimeout(() => {
          document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const id = parseInt(btn.getAttribute('data-id') || '0');
              onDeleteParcel(id);
            });
          });
        }, 100);
      });

      return marker;
    });

    setMarkers(newMarkers);

    if (parcelas.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      parcelas.forEach(parcela => {
        bounds.extend([parcela.longitud, parcela.latitud]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }
  }, [parcelas, loading]);

  return (
    <div className="map-container-wrapper">
      <h1 className="map-title">Cultivos del Sur | Mapa de Ubicaciones</h1>
      <div className="map-container" ref={mapContainer}>
        {loading && <div className="map-loading-overlay">Actualizando datos...</div>}
      </div>
    </div>
  );
}

export default Mapa;