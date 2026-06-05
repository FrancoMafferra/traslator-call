import { useRef, useState } from "react";
import { playReceivedAudio } from "./useAudioReceiver";

export function useTranslatorSocket() {
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [usersCount, setUsersCount] = useState(0);
  const [status, setStatus] = useState("Desconectado");

  const [spokenLanguage, setSpokenLanguage] = useState("");
  const [listenLanguage, setListenLanguage] = useState("");
  const [languageSaved, setLanguageSaved] = useState(false);
  const [receivedText, setReceivedText] = useState("");
  const [messages, setMessages] = useState([]);

  const webrtcHandlersRef = useRef(null);

  const registerWebRTCHandlers = (handlers) => {
    webrtcHandlersRef.current = handlers;
  };

  const sendLanguageConfig = (socket = socketRef.current) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (!spokenLanguage || !listenLanguage) return;

    socket.send(
      JSON.stringify({
        type: "SET_LANGUAGE_CONFIG",
        spokenLanguage,
        listenLanguage,
      }),
    );
  };

  const connectSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3001";

    const socket = new WebSocket(WS_URL);

    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setStatus("Conectado al servidor");
      sendLanguageConfig(socket);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "ROOM_CREATED") {
        setRoomId(message.roomId);
        setUsersCount(1);
        setStatus(`Sala creada: ${message.roomId}`);
      }

      if (message.type === "USER_JOINED") {
        setRoomId(message.roomId);
        setUsersCount(message.users);
        setStatus(`Usuario unido a la sala ${message.roomId}`);
      }

      if (message.type === "LANGUAGE_CONFIG_SAVED") {
        setLanguageSaved(true);
        setStatus("Configuración de idioma guardada");
      }

      if (message.type === "ERROR") {
        setStatus(message.message);
      }

      if (message.type === "AUDIO_CHUNK") {
        playReceivedAudio(message.audio);
      }

      if (message.type === "TRANSLATED_TEXT") {
        setMessages((prev) => [
          ...prev,
          {
            id: message.messageId || Date.now(),
            type: "received",
            originalText: message.originalText,
            translatedText: message.translatedText,
            fromLanguage: message.fromLanguage,
            targetLanguage: message.targetLanguage,
          },
        ]);
      }

      if (message.type === "WEBRTC_OFFER") {
        webrtcHandlersRef.current?.handleOffer(message.offer);
      }

      if (message.type === "WEBRTC_ANSWER") {
        webrtcHandlersRef.current?.handleAnswer(message.answer);
      }

      if (message.type === "WEBRTC_ICE_CANDIDATE") {
        webrtcHandlersRef.current?.handleIceCandidate(message.candidate);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      setStatus("Desconectado");
    };

    socket.onerror = () => {
      setStatus("Error de conexión");
    };
  };

  const createRoom = () => {
    sendLanguageConfig();

    socketRef.current?.send(
      JSON.stringify({
        type: "CREATE_ROOM",
      }),
    );
  };

  const joinRoom = () => {
    sendLanguageConfig();

    socketRef.current?.send(
      JSON.stringify({
        type: "JOIN_ROOM",
        roomId: roomInput.trim().toUpperCase(),
      }),
    );
  };

  const saveLanguageConfig = () => {
    sendLanguageConfig();
  };

  const addOwnMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return {
    socketRef,

    connected,
    roomId,
    roomInput,
    usersCount,
    status,

    spokenLanguage,
    listenLanguage,
    languageSaved,
    receivedText,
    messages,

    setRoomInput,
    setSpokenLanguage,
    setListenLanguage,

    connectSocket,
    createRoom,
    joinRoom,
    saveLanguageConfig,
    registerWebRTCHandlers,
    addOwnMessage,
  };
}