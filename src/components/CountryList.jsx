import { useCities } from '../Contexts/ProviderCities';
import CountryItem from './CountryItem'
import styles from './CountryList.module.css'
import Spinner from './Spinner'

function CountryList() {
    const { cities, isLoading } = useCities();

    if (isLoading) <Spinner />

    const countries = cities.reduce((arr, city) => {
        if (!arr.map((el) => el.country).includes(city.country))
            return [...arr, { country: city.country, emoji: city.emoji }];
        else return arr;
    }, []);
    return (
        <ul className={styles.countryList}>
            {countries.map((country) =>
                <CountryItem country={country} key={cities.cityName} />
            )
            }
        </ul>
    )
}

export default CountryList
