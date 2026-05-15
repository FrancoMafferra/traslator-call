import { useRef, useState } from "react";

const languageMap = {
  es: "es-ES",
  en: "en-US",
  it: "it-IT",
};

export function useSpeechRecognition({ socketRef, spokenLanguage }) {
  const recognitionRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [lastTranscript, setLastTranscript] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = languageMap[spokenLanguage] || "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript.trim();

      if (!text) return;

      setLastTranscript(text);

      socketRef.current?.send(
        JSON.stringify({
          type: "SPEECH_TEXT",
          text,
          fromLanguage: spokenLanguage,
        }),
      );

      onTranscript?.({
        id: Date.now(),
        type: "mine",
        text,
      });
      
      console.log("Speech detectado:", {
        spokenLanguage,
        text,
      });
    };

    recognition.onerror = (event) => {
      console.error("SpeechRecognition error:", event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return {
    listening,
    speechSupported,
    lastTranscript,
    startListening,
    stopListening,
  };
}
