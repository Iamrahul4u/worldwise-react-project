import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import Button from "./Button";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useGeoLocation } from "../contexts/GeolocationProvider";
import useGeolocation from "../hooks/useGeoLocation";

function Map() {
  const [searchParam, setSearchParams] = useSearchParams();
  const { cities } = useGeoLocation();
  const [position, setPosition] = useState([10, 20]);
  const {
    isLoading: isLoadingPosition,
    position: geoPosition,
    getPosition: getGeoPosition,
  } = useGeolocation();
  const lat = searchParam.get("lat");
  const lng = searchParam.get("lng");
  useEffect(() => {
    if (lat && lng) setPosition([lat, lng]);
  }, [lat, lng]);
  useEffect(() => {
    if (!geoPosition) setPosition([geoPosition.lat, geoPosition.lng]);
  }, [geoPosition]);
  return (
    <div className={styles.mapContainer}>
      {geoPosition && (
        <Button type="position" onClick={() => getGeoPosition}>
          {!isLoadingPosition ? "Use My Location" : "Loading..."}
        </Button>
      )}
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        ))}
        <GetPosition position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function GetPosition({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}
function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
export default Map;
