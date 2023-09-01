import { useGeoLocation } from "../contexts/GeolocationProvider";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
function CityList() {
  const { cities, isLoading } = useGeoLocation();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Start Adding Your cities By clicking on the Map" />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
