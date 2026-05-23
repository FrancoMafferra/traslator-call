import { useRef, useState } from "react";

const languageMap = {
  es: "es-ES",
  en: "en-US",
  it: "it-IT",
};

export function useSpeechRecognition({
  socketRef,
  spokenLanguage,
  onTranscript,
}) {
  const recognitionRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [lastTranscript, setLastTranscript] = useState("");

  const startListening = () => {
    if (recognitionRef.current) return;

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

    recognition.onstart = () => {
      console.log("[SR_ONSTART]", {
        spokenLanguage,
        lang: recognition.lang,
      });

      setListening(true);
    };

    recognition.onresult = (event) => {
      if (!recognitionRef.current) return;

      const result = event.results[event.results.length - 1];
      const text = result[0].transcript.trim();

      console.log("[SR_RESULT]", {
        text,
        spokenLanguage,
        confidence: result[0].confidence,
        socketReadyState: socketRef.current?.readyState,
      });

      if (!text) return;

      setLastTranscript(text);

      const payload = {
        type: "SPEECH_TEXT",
        text,
        fromLanguage: spokenLanguage,
      };

      console.log("[WS_SEND_SPEECH_TEXT]", payload);

      socketRef.current?.send(JSON.stringify(payload));

      onTranscript?.({
        id: Date.now(),
        type: "mine",
        text,
      });
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        console.log("[SR_NO_SPEECH]");
        return;
      }

      console.error("[SR_ERROR]", event.error);
    };

    recognition.onend = () => {
      console.log("[SR_END]");

      recognitionRef.current = null;
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = null;
    recognitionRef.current.onerror = null;
    recognitionRef.current.onend = null;

    recognitionRef.current.stop();
    recognitionRef.current = null;

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
