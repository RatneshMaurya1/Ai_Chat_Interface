import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './App.module.css';
import ChatInput from './components/ChatInput';
import Message from './components/Message';
import ScrollToBottom from './components/ScrollToBottom';
import { usePlugins } from './hooks/usePlugins';
import { storageService } from './services/storage';

function App() {
  const [messages, setMessages] = useState([]);
  const { executePlugin, isLoading, getAvailablePlugins } = usePlugins();

  useEffect(() => {
    const savedMessages = storageService.loadMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    storageService.saveMessages(messages);
  }, [messages]);

  const handleHelp = () => {
    const plugins = getAvailablePlugins();
    const helpMessage = {
      id: uuidv4(),
      sender: 'assistant',
      type: 'text',
      content: `Available commands:\n\n${plugins.map(p => 
        `/${p.name} - ${p.description}`
      ).join('\n')}\n\nYou can also use natural language, for example:\n` +
      '- "What\'s the weather in London?"\n' +
      '- "Calculate 5 * 10"\n' +
      '- "What does serendipity mean?"',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, helpMessage]);
  };

  const handleClearHistory = () => {
    setMessages([]);
    storageService.clearHistory();
  };

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: uuidv4(),
      sender: 'user',
      content,
      type: 'text',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    if (content.toLowerCase() === '/help') {
      handleHelp();
      return;
    }
    if (content.toLowerCase() === '/clear') {
      handleClearHistory();
      return;
    }

    const response = await executePlugin(content);
    if (response) {
      const assistantMessage = {
        id: uuidv4(),
        sender: 'assistant',
        content: response.content,
        type: response.type,
        pluginName: response.pluginName,
        pluginData: response.pluginData,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <h1>AI Chat with Plugins</h1>
          <div className={styles.actions}>
            <button onClick={handleHelp} className={styles.actionButton}>
              Help
            </button>
            <button onClick={handleClearHistory} className={styles.actionButton}>
              Clear History
            </button>
          </div>
        </div>
        <ScrollToBottom className={styles.messageList}>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className={styles.typingIndicator}>
              Assistant is typing...
            </div>
          )}
        </ScrollToBottom>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default App; 