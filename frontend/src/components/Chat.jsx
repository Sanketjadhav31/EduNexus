import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Chat({ courseId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const { API_URL } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    const token = localStorage.getItem('token');
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      newSocket.emit('join-course', courseId);
    });

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/messages/course/${courseId}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send-message', {
      courseId,
      content: newMessage
    });

    setNewMessage('');
  };

  return (
    <div className="card">
      <h3>Course Chat</h3>
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ddd', 
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '5px'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <strong>{msg.sender.name}</strong> 
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>
              ({msg.sender.role})
            </span>
            <p style={{ margin: '5px 0' }}>{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}

export default Chat;
