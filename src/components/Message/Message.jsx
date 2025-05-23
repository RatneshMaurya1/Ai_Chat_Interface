import React from 'react';
import styles from './Message.module.css';
import { WeatherCard, CalculatorCard, DictionaryCard } from '../PluginCards';

const Message = ({ message }) => {
  const { sender, content, type, pluginName, pluginData } = message;
  const messageClass = sender === 'user' ? styles.userMessage : styles.assistantMessage;

  const renderPluginContent = () => {
    if (type !== 'plugin') return null;

    switch (pluginName) {
      case 'weather':
        return <WeatherCard data={pluginData} />;
      case 'calculator':
        return <CalculatorCard data={pluginData} />;
      case 'dictionary':
        return <DictionaryCard data={pluginData} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.messageContainer} ${messageClass}`}>
      <div className={styles.messageContent}>
        {type === 'text' ? (
          <p>{content}</p>
        ) : (
          renderPluginContent()
        )}
      </div>
      <div className={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message; 