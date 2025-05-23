import React, { useEffect, useRef } from 'react';
import styles from './ScrollToBottom.module.css';

const ScrollToBottom = ({ children, className }) => {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const shouldScroll = containerRef.current && 
      containerRef.current.scrollHeight - containerRef.current.scrollTop <= containerRef.current.clientHeight + 150;
    
    if (shouldScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [children]);

  return (
    <div ref={containerRef} className={`${styles.container} ${className || ''}`}>
      {children}
      <div ref={bottomRef} />
    </div>
  );
};

export default ScrollToBottom; 