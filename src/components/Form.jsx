// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import DatePicker from "react-datepicker";
import Button from "./Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "./Spinner";
import Message from "./Message";

import "react-datepicker/dist/react-datepicker.css";
import { useGeoLocation } from "../contexts/GeolocationProvider";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { addCity } = useGeoLocation();
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [emoji, setemoji] = useState("");
  const navigate = useNavigate();
  const [searchParam, setSearchParams] = useSearchParams();
  const lat = searchParam.get("lat");
  const lng = searchParam.get("lng");
  useEffect(() => {
    async function fetchCityDataa() {
      try {
        setFormLoading(true);
        setError("");
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();
        if (!data.countryCode)
          throw new Error("That doesn't seem to be a valid country");
        setCityName(data.city || data.countryName || "");
        setCountry(data.countryName || data.city || "");
        setemoji(data.countryCode);
      } catch (err) {
        setError(err.message);
      } finally {
        setFormLoading(false);
      }
    }
    fetchCityDataa();
  }, [lat, lng]);
  if (formLoading) return <Spinner />;
  if (error) return <Message message={error} />;

  async function handleSubmit(e) {
    e.preventDefault();
    const city = {
      cityName,
      country,
      date,
      emoji,
      notes,
      position: { lat, lng },
    };
    await addCity(city);
    navigate("/app/cities");
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
