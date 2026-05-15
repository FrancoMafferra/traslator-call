import './App.css';

import HomeScreen from './components/HomeScreen';
import CallRoom from './components/CallRoom';

import { useTranslatorSocket } from './hooks/useTranslatorSocket';
import { useMicrophone } from './hooks/useMicrophone';
import { useAudioSender } from './hooks/useAudioSender';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useEffect } from 'react';
import { useWebRTC } from './hooks/useWebRTC';
import { useTextToSpeech } from './hooks/useTextToSpeech';

function App() {
  const translatorSocket = useTranslatorSocket();

  const microphone = useMicrophone();

  const audioSender = useAudioSender({
    streamRef: microphone.streamRef,
    socketRef: translatorSocket.socketRef,
  });

  const speechRecognition = useSpeechRecognition({
    socketRef: translatorSocket.socketRef,
    spokenLanguage: translatorSocket.spokenLanguage,
    onTranscript: translatorSocket.addOwnMessage,
  });

  const webRTC = useWebRTC({
    socketRef: translatorSocket.socketRef,
    streamRef: microphone.streamRef,
  });

  const textToSpeech = useTextToSpeech();

  useEffect(() => {
    translatorSocket.registerWebRTCHandlers({
      handleOffer: webRTC.handleOffer,
      handleAnswer: webRTC.handleAnswer,
      handleIceCandidate: webRTC.handleIceCandidate,
    });
  }, [translatorSocket, webRTC]);

  return (
    <main className="container">
      <section className={translatorSocket.roomId ? 'call-layout' : 'card'}>
        <h1>Translator Call</h1>

        <p className="subtitle">
          Llamadas con traducción de audio en
          tiempo real
        </p>

        {!translatorSocket.roomId ? (
          <HomeScreen
            translatorSocket={translatorSocket}
            microphone={microphone}
          />
        ) : (
          <CallRoom
            translatorSocket={translatorSocket}
            microphone={microphone}
            audioSender={audioSender}
            speechRecognition={speechRecognition}
            webRTC={webRTC}
            textToSpeech={textToSpeech}
          />
        )}
      </section>
    </main>
  );
}

export default App;