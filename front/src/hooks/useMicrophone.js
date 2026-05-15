import { useRef, useState } from "react";

export function useMicrophone() {
  const streamRef = useRef(null);

  const [microphoneReady, setMicrophoneReady] = useState(false);
  const [microphoneError, setMicrophoneError] = useState("");

  const requestMicrophone = async () => {
    try {
      setMicrophoneError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setMicrophoneReady(false);
        setMicrophoneError(
          "Este dispositivo no permite usar micrófono desde esta conexión. Probá con HTTPS o localhost."
        );

        return null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      streamRef.current = stream;
      setMicrophoneReady(true);

      return stream;
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);

      setMicrophoneReady(false);
      setMicrophoneError(
        "No se pudo acceder al micrófono. Revisá los permisos del navegador."
      );

      return null;
    }
  };

  const stopMicrophone = () => {
    if (!streamRef.current) return;

    streamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
    setMicrophoneReady(false);
  };

  return {
    streamRef,
    microphoneReady,
    microphoneError,
    requestMicrophone,
    stopMicrophone,
  };
}