import React from 'react';
import styles from './PluginCards.module.css';

const WeatherCard = ({ data }) => {
  const { location, temperature, description, humidity } = data;

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Weather in {location}</h3>
      <div className={styles.weatherInfo}>
        <div className={styles.temperature}>
          {temperature}°C
        </div>
        <div className={styles.details}>
          <p>{description}</p>
          <p>Humidity: {humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 