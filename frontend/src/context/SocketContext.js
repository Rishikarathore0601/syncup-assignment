'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const token = Cookies.get('accessToken');
      
      const socketUrl = process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') 
        : 'http://localhost:5000';

      const newSocket = io(socketUrl, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('notification', (data) => {
        setNotifications((prev) => [data, ...prev]);
        // Also could use toast here
        alert(`New Notification: ${data.message || 'You have an update!'}`);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
