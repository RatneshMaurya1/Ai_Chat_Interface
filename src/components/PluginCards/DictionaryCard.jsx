import React from 'react';
import styles from './PluginCards.module.css';

const DictionaryCard = ({ data }) => {
  const { word, phonetic, definitions } = data;

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>
        {word}
        {phonetic && <span className={styles.phonetic}>{phonetic}</span>}
      </h3>
      <div className={styles.definitions}>
        {definitions.map((def, index) => (
          <div key={index} className={styles.definition}>
            <span className={styles.partOfSpeech}>{def.partOfSpeech}</span>
            <p>{def.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DictionaryCard; 