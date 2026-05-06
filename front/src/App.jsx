import './App.css';

import ConnectionStatus from './components/ConnectionStatus';
import LanguageSelector from './components/LanguageSelector';
import RoomControls from './components/RoomControls';
import CallControls from './components/CallControls';

import { useTranslatorSocket } from './hooks/useTranslatorSocket';
import { useMicrophone } from './hooks/useMicrophone';
import { useAudioSender } from './hooks/useAudioSender';

function App() {
  const translatorSocket = useTranslatorSocket();
  const microphone = useMicrophone();

  const audioSender = useAudioSender({
    streamRef: microphone.streamRef,
    socketRef: translatorSocket.socketRef,
  });

  return (
    <main className="container">
      <section className="card">
        <h1>Translator Call</h1>

        <p className="subtitle">
          Llamadas con traducción de audio en tiempo real
        </p>

        <ConnectionStatus
          status={translatorSocket.status}
        />

        <CallControls
          connected={translatorSocket.connected}
          connectSocket={translatorSocket.connectSocket}
          microphoneReady={microphone.microphoneReady}
          microphoneError={microphone.microphoneError}
          requestMicrophone={microphone.requestMicrophone}
        />

        {translatorSocket.connected && (
          <>
            <LanguageSelector
              {...translatorSocket}
            />

            <RoomControls
              {...translatorSocket}
            />

            {translatorSocket.roomId && microphone.microphoneReady && (
              <div className="audio-box">
                {!audioSender.audioSending ? (
                  <button onClick={audioSender.startSendingAudio}>
                    Iniciar audio
                  </button>
                ) : (
                  <button onClick={audioSender.stopSendingAudio}>
                    Pausar audio
                  </button>
                )}

                <p className="call-status">
                  Audio: <strong>{audioSender.audioSending ? 'activo' : 'pausado'}</strong>
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default App;