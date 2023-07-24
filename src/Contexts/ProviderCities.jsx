/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from "react"

const BASE_URL = "http://localhost:8000";

const ContextCities = createContext();



const initialItems = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ""
};
function reducer(state, action) {
    switch (action.type) {
        case "Loading":
            return {
                ...state, isLoading: true,
            };
        case "cities/Loaded":
            return {
                ...state, cities: action.payload,
                isLoading: false
            };
        case "currentCity/Loaded":
            return {
                ...state, currentCity: action.payload,
                isLoading: false
            };
        case "city/Added":
            return {
                ...state, cities: [...state.cities, action.payload], currentCity: action.payload,
                isLoading: false
            };

        case "city/Deleted":
            return {
                ...state, cities: state.cities.filter((city) => city.id !== action.payload), isLoading: false

            };
        case 'rejected':
            return {
                ...state, error: action.payload, isLoading: false
            };

        default:
            throw new Error("Unknown Error");
    }
}
function ProviderCities({ children }) {
    const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialItems);


    useEffect(function () {
        async function fetchCity() {
            dispatch({ type: "Loading" });
            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                dispatch({ type: "cities/Loaded", payload: data });
            } catch {
                dispatch({ type: "rejected", payload: "Error Fetching Cities" });
            }
        }
        fetchCity();
    }, [])
    async function fetchCities(id) {
        dispatch({ type: "Loading" });
        try {

            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            dispatch({ type: "currentCity/Loaded", payload: data });
        } catch {
            dispatch({ type: "rejected", payload: "Error setting currentCity" });
        }
    }
    async function createCities(newCity) {
        dispatch({ type: "Loading" });
        try {

            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json()
            dispatch({ type: "city/Added", payload: data })
        } catch {
            dispatch({ type: "rejected", payload: "Error  Adding City" });
        }
    }
    async function deleteCity(id) {
        dispatch({ type: "Loading" });
        try {
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });
            dispatch({ type: "city/Deleted", payload: id });
        } catch {
            dispatch({ type: "rejected", payload: "Error  Adding City" });
        }
    }

    return (
        <ContextCities.Provider
            value={{
                cities, isLoading, fetchCities, currentCity, createCities, deleteCity
            }}>
            {children}
        </ContextCities.Provider>
    )
}

function useCities() {
    const context = useContext(ContextCities);
    if (context === undefined) throw new Error("Use Cities Error");
    return context;
}
export { ProviderCities, useCities };
