import { createContext, useContext, useEffect, useState } from "react";

const GeoLocationContext = createContext(null);
const BASE_URL = "http://localhost:8000";
function GeolocationProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsloading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        throw new Error("Error in Fetch Cities");
      } finally {
        setIsloading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    setIsloading(true);
    const res = await fetch(`${BASE_URL}/cities/${id}`);
    const data = await res.json();
    setCurrentCity(data);
    setIsloading(false);
  }
  async function addCity(newCity) {
    const res = await fetch(`${BASE_URL}/cities/`, {
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setCities((cities) => [...cities, data]);
  }
  async function deleteCity(id) {
    await fetch(`${BASE_URL}/cities/${id}`, {
      method: "DELETE",
    });
    setCities((cities) => cities.filter((city) => city.id != id));
  }

  return (
    <GeoLocationContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity, deleteCity }}
    >
      {children}
    </GeoLocationContext.Provider>
  );
}

export function useGeoLocation() {
  const context = useContext(GeoLocationContext);
  if (context === undefined) throw new Error("Context Provider Error");
  return context;
}
export default GeolocationProvider;
