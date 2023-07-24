
import { useNavigate } from 'react-router-dom'
import styles from './Map.module.css'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../Contexts/ProviderCities';
import { useGeolocation } from '../hooks/useGeoLocation';
import { usePosition } from '../hooks/usePosition';
import Button from './Button';
function Map() {
    const { cities } = useCities();

    const [mapPosition, setMapPosition] = useState([10, 18]);
    const { isLoading: isGeoLoding, position: isGeoPosition, getPosition } = useGeolocation();
    const [maplat, maplng] = usePosition();

    useEffect(() => {
        if (maplat && maplng) setMapPosition([maplat, maplng]);
    }, [maplat, maplng])

    useEffect(() => {
        if (isGeoPosition) setMapPosition([isGeoPosition.lat, isGeoPosition.lng]);
    }, [isGeoPosition]);

    return (
        <div className={styles.mapContainer} >
            {!isGeoPosition && <Button type='position' onClick={getPosition}>{isGeoLoding ? "Loading" : "Get Your Position"}</Button>}
            <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) =>
                    <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                        <Popup>
                            {<p>{city.cityName}</p>}
                        </Popup>
                    </Marker>
                )
                }
                <CenterPosition Position={mapPosition} />
                <DetectClick />
            </MapContainer>
            {/* <button onClick={() => setSearchParams({ maplat: maplat, maplng: maplng })}>Get loc</button> */}
        </div>
    )
}

function CenterPosition({ Position }) {
    const position = useMap();
    position.setView(Position);
    return null;
}
function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    })
}
export default Map
