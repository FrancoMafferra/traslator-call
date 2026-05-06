import './App.css';

import ConnectionStatus from './components/ConnectionStatus';
import LanguageSelector from './components/LanguageSelector';
import RoomControls from './components/RoomControls';

import { useTranslatorSocket } from './hooks/useTranslatorSocket';

function App() {
  const translatorSocket = useTranslatorSocket();

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

        {!translatorSocket.connected && (
          <button
            onClick={translatorSocket.connectSocket}
          >
            Conectar al servidor
          </button>
        )}

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