import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../constants';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [liveAlert, setLiveAlert] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected to server:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      setConnected(false);
    });

    newSocket.on('notification:new', (notification) => {
      console.log('[Socket] New live notification received:', notification);
      setLiveAlert(notification);
      // Automatically dismiss popup banner after 7 seconds
      setTimeout(() => {
        setLiveAlert((curr) => (curr?._id === notification._id ? null : curr));
      }, 7000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join user's personal room when logged in
  useEffect(() => {
    if (socket && user && user._id) {
      socket.emit('join:user', user._id);
    }
  }, [socket, user]);

  const joinRequestRoom = (requestId) => {
    if (socket && requestId) {
      socket.emit('join:request', requestId);
    }
  };

  const clearAlert = () => setLiveAlert(null);

  return (
    <SocketContext.Provider value={{ socket, connected, liveAlert, clearAlert, joinRequestRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
