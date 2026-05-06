import './App.css';

import ConnectionStatus from './components/ConnectionStatus';
import LanguageSelector from './components/LanguageSelector';
import RoomControls from './components/RoomControls';
import CallControls from './components/CallControls';

import { useTranslatorSocket } from './hooks/useTranslatorSocket';
import { useMicrophone } from './hooks/useMicrophone';

function App() {
  const translatorSocket = useTranslatorSocket();
  const microphone = useMicrophone();

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
          </>
        )}
      </section>
    </main>
  );
}

export default App;