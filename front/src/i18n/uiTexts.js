export const uiTexts = {
  es: {
    appSubtitle: "Llamadas con traducción de audio en tiempo real",
    status: "Estado",
    room: "Sala",
    createRoom: "Crear sala",
    roomCode: "Código de sala",
    join: "Unirse",
    connectedUsers: "Usuarios conectados",

    loadingSpeech: "Cargando reconocimiento de voz...",
    webRTCError: "Error: la llamada no fue inicializada.",
    leave: "Salir",

    microphone: "Micrófono",
    ready: "listo",
    unavailable: "no disponible",

    callStatus: "Estado de llamada",
    translatedVoice: "Voz traducida",
    active: "activa",

    call: "Llamada",
    connectCall: "Conectar llamada",
    callConnected: "Llamada conectada",
    endCall: "Finalizar llamada",

    subtitles: "Subtítulos",
    subtitlesActive: "activos",
    subtitlesInactive: "inactivos",

    speechNotSupported:
      "Tu navegador no soporta reconocimiento de voz. Probá con Chrome o Edge.",

    connectionStatuses: {
      Desconectado: "Desconectado",
      "Conectado al servidor": "Conectado al servidor",
      "Configuración de idioma guardada": "Configuración de idioma guardada",
      "Error de conexión": "Error de conexión",
    },

    callStatuses: {
      "Sin iniciar": "Sin iniciar",
      "offer-sent": "Conectando...",
      "answer-sent": "Conectando...",
      "answer-received": "Conectando...",
      connecting: "Conectando...",
      connected: "Conectada",
      disconnected: "Desconectada",
      failed: "Falló",
      closed: "Finalizada",
    },
  },

  en: {
    appSubtitle: "Real-time audio translation calls",
    status: "Status",
    room: "Room",
    createRoom: "Create room",
    roomCode: "Room code",
    join: "Join",
    connectedUsers: "Connected users",

    loadingSpeech: "Loading speech recognition...",
    webRTCError: "Error: call was not initialized.",
    leave: "Leave",

    microphone: "Microphone",
    ready: "ready",
    unavailable: "unavailable",

    callStatus: "Call status",
    translatedVoice: "Translated voice",
    active: "active",

    call: "Call",
    connectCall: "Connect call",
    callConnected: "Call connected",
    endCall: "End call",

    subtitles: "Subtitles",
    subtitlesActive: "active",
    subtitlesInactive: "inactive",

    speechNotSupported:
      "Your browser does not support speech recognition. Try Chrome or Edge.",

    connectionStatuses: {
      Desconectado: "Disconnected",
      "Conectado al servidor": "Connected to server",
      "Configuración de idioma guardada": "Language settings saved",
      "Error de conexión": "Connection error",
    },

    callStatuses: {
      "Sin iniciar": "Not started",
      "offer-sent": "Connecting...",
      "answer-sent": "Connecting...",
      "answer-received": "Connecting...",
      connecting: "Connecting...",
      connected: "Connected",
      disconnected: "Disconnected",
      failed: "Failed",
      closed: "Ended",
    },
  },
};

export function getUiTexts(language) {
  return uiTexts[language] || uiTexts.es;
} 