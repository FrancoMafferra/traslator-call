import { useRef } from "react";

const languageMap = {
  es: "es-ES",
  en: "en-US",
};

export function useTextToSpeech() {
  const queueRef = useRef([]);
  const speakingRef = useRef(false);

  const playNext = () => {
    if (!window.speechSynthesis) return;

    if (speakingRef.current) return;

    const nextItem = queueRef.current.shift();

    if (!nextItem) return;

    speakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(nextItem.text);

    utterance.lang = languageMap[nextItem.language] || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      speakingRef.current = false;
      playNext();
    };

    utterance.onerror = (error) => {
      console.error("[TTS_ERROR]", error);

      speakingRef.current = false;
      playNext();
    };

    console.log("[TTS_PLAY]", {
      text: nextItem.text,
      language: nextItem.language,
    });

    window.speechSynthesis.speak(utterance);
  };

  const speak = ({ text, language }) => {
    if (!window.speechSynthesis || !text) return;

    queueRef.current.push({
      text,
      language,
    });

    console.log("[TTS_QUEUED]", {
      text,
      language,
      queueLength: queueRef.current.length,
    });

    playNext();
  };

  const stop = () => {
    queueRef.current = [];
    speakingRef.current = false;
    window.speechSynthesis?.cancel();
  };

  const warmupVoices = () => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.getVoices();

    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0;
    utterance.lang = "en-US";

    window.speechSynthesis.speak(utterance);
  };

  return {
    speak,
    stop,
    warmupVoices,
  };
}