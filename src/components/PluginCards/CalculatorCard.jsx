import React from 'react';
import styles from './PluginCards.module.css';

const CalculatorCard = ({ data }) => {
  const { expression, result } = data;

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Calculator</h3>
      <div className={styles.calculatorResult}>
        <div className={styles.expression}>{expression}</div>
        <div className={styles.result}>{result}</div>
      </div>
    </div>
  );
};

export default CalculatorCard; 