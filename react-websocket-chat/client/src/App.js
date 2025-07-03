import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const WEBSOCKET_URL = 'ws://localhost:8080';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const ws = useRef(null);
  // 1. Create a ref for the scroll target
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 2. Create a useEffect to scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Dependency array ensures this runs every time a new message is added

  useEffect(() => {
    if (!isLoggedIn) return;

    // Initialize WebSocket connection
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, message]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [isLoggedIn]); // This effect runs when the user logs in

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() && ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        user: username,
        text: currentMessage,
        timestamp: new Date().toISOString(),
      };
      ws.current.send(JSON.stringify(message));
      setCurrentMessage('');
    }
  };

  // Login View
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h1>Enter Chat</h1>
          <input
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  // Chat View
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>React WebSocket Chat</h2>
        <p>Welcome, {username}!</p>
      </div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user === username ? 'my-message' : 'other-message'}`}>
            <div className="message-bubble">
              <div className="message-user">{msg.user}</div>
              <div className="message-text">{msg.text}</div>
            </div>
          </div>
        ))}
        {/* 3. Attach the ref to this empty div at the end of the list */}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;