import { useRef, useState } from 'react';

export function useTranslatorSocket() {
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [usersCount, setUsersCount] = useState(0);
  const [status, setStatus] = useState('Desconectado');

  const [spokenLanguage, setSpokenLanguage] = useState('es');
  const [listenLanguage, setListenLanguage] = useState('es');
  const [languageSaved, setLanguageSaved] = useState(false);

  const connectSocket = () => {
    const socket = new WebSocket('ws://localhost:3001');

    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setStatus('Conectado al servidor');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'ROOM_CREATED') {
        setRoomId(message.roomId);
        setUsersCount(1);
        setStatus(`Sala creada: ${message.roomId}`);
      }

      if (message.type === 'USER_JOINED') {
        setRoomId(message.roomId);
        setUsersCount(message.users);
        setStatus(`Usuario unido a la sala ${message.roomId}`);
      }

      if (message.type === 'LANGUAGE_CONFIG_SAVED') {
        setLanguageSaved(true);
        setStatus('Configuración de idioma guardada');
      }

      if (message.type === 'ERROR') {
        setStatus(message.message);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      setStatus('Desconectado');
    };
  };

  const createRoom = () => {
    socketRef.current?.send(
      JSON.stringify({
        type: 'CREATE_ROOM',
      })
    );
  };

  const joinRoom = () => {
    socketRef.current?.send(
      JSON.stringify({
        type: 'JOIN_ROOM',
        roomId: roomInput.trim().toUpperCase(),
      })
    );
  };

  const saveLanguageConfig = () => {
    socketRef.current?.send(
      JSON.stringify({
        type: 'SET_LANGUAGE_CONFIG',
        spokenLanguage,
        listenLanguage,
      })
    );
  };

  return {
    connected,
    roomId,
    roomInput,
    usersCount,
    status,

    spokenLanguage,
    listenLanguage,
    languageSaved,

    setRoomInput,
    setSpokenLanguage,
    setListenLanguage,

    connectSocket,
    createRoom,
    joinRoom,
    saveLanguageConfig,
  };
}