import { useCities } from '../Contexts/ProviderCities'
import CityItem from './CityItem'
import styles from './CityList.module.css'
import Spinner from './Spinner'
import Message from "./Message";

function CityList() {
    const { cities, isLoading } = useCities();
    if (isLoading) return <Spinner />
    if (!cities.length) return <Message message="Add you cities" />;

    return (
        <ul className={styles.cityList}>
            {cities.map((city) =>
                <CityItem city={city} key={city.id} />
            )
            }
        </ul>
    )
}

export default CityList