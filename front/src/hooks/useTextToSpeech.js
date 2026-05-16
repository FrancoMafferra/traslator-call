export function useTextToSpeech() {
  const speak = ({ text, language }) => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const languageMap = {
      es: "es-ES",
      en: "en-US",
      it: "it-IT",
    };

    utterance.lang = languageMap[language] || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
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
