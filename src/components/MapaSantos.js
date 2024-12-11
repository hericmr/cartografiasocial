import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GPXComponent from "./GPXComponent"; // Importa o novo componente GPX

const pontos = [
  { lat: -23.9851111, lng: -46.3088611, desc: "Câmera perto da estátua da Iemanjá" },
  { lat: -23.986537968087983, lng: -46.313389755692555, desc: "Farolzin do Canal 6" },
  { lat: -23.991274504274266, lng: -46.31691750701601, desc: "Boia Verde" },
];

const SetMapCenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15); // Define a nova posição do centro
    }
  }, [lat, lng, map]);

  return null;
};

const MapaSantos = () => {
  const mapRef = useRef(null);
  const [gpxData, setGpxData] = useState([]);
  const [hericLocation, setHericLocation] = useState({ lat: -23.9876543, lng: -46.3051234 }); // Defina a localização do Héric

  // Função para atualizar os pontos do GPX (diretamente chamada do GPXComponent)
  const updateGpxData = (points) => {
    setGpxData(points);
    if (points.length > 0) {
      // A localização do Héric pode ser extraída do GPX, aqui estamos assumindo um valor fixo
      setHericLocation({
        lat: points[0].lat, // O primeiro ponto é a localização do Héric (pode ser alterado conforme o seu arquivo GPX)
        lng: points[0].lon,
      });
    }
  };

  return (
    <MapContainer
      center={hericLocation} // Usa as coordenadas de hericLocation
      zoom={16}
      style={{ width: "100%", height: "90vh" }}
      whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Exibe os pontos fixos */}
      {pontos.map((ponto, index) => (
        <Marker
          key={index}
          position={[ponto.lat, ponto.lng]}
          icon={new L.Icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // Ícone padrão para pontos fixos
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })}
        >
          <Popup>{ponto.desc}</Popup>
        </Marker>
      ))}

      {/* Exibe os pontos do GPX carregados */}
      {gpxData.map((point, index) => (
        <Marker
          key={index}
          position={[point.lat, point.lon]}
          icon={new L.Icon({
            iconUrl: "https://hericmr.github.io/me/imagens/heric.png", // Ícone do Heric
            iconSize: [40, 40],
            iconAnchor: [20, 40], // Centraliza a âncora
            popupAnchor: [1, -34],
          })}
        >
          <Popup>{`Localização do Héric: ${index + 1}: (${point.lat}, ${point.lon})`}</Popup>
        </Marker>
      ))}

      {/* Componente GPX, passando a função para atualizar os dados */}
      <GPXComponent
        gpxUrl="https://corsproxy.io/https://www.openstreetmap.org/trace/11704581/data"
        updateGpxData={updateGpxData}
      />

      {/* Componente para ajustar o centro do mapa conforme a localização do Héric */}
      <SetMapCenter lat={hericLocation.lat} lng={hericLocation.lng} />
    </MapContainer>
  );
};

export default MapaSantos;
