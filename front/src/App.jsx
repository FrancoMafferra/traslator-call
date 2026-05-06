import { useRef, useState } from 'react';
import './App.css';

function App() {
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [usersCount, setUsersCount] = useState(0);
  const [status, setStatus] = useState('Desconectado');

  const [spokenLanguage, setSpokenLanguage] = useState('es');
  const [listenLanguage, setListenLanguage] = useState('es');
  const [languageSaved, setLanguageSaved] = useState(false);

  const connectSocket = () => {
    const socket = new WebSocket('ws://localhost:3001');

    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setStatus('Conectado al servidor');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'ROOM_CREATED') {
        setRoomId(message.roomId);
        setUsersCount(1);
        setStatus(`Sala creada: ${message.roomId}`);
      }

      if (message.type === 'USER_JOINED') {
        setRoomId(message.roomId);
        setUsersCount(message.users);
        setStatus(`Usuario unido a la sala ${message.roomId}`);
      }

      if (message.type === 'ERROR') {
        setStatus(message.message);
      }

      if (message.type === 'LANGUAGE_CONFIG_SAVED') {
        setLanguageSaved(true);
        setStatus('Configuración de idioma guardada');
      }
    };

    socket.onclose = () => {
      setConnected(false);
      setStatus('Desconectado del servidor');
    };
  };

  const createRoom = () => {
    console.log('Creando sala...');
    console.log('Socket:', socketRef.current);
    console.log('ReadyState:', socketRef.current?.readyState);

    socketRef.current?.send(
      JSON.stringify({
        type: 'CREATE_ROOM',
      })
    );
  };

  const joinRoom = () => {
    console.log('Uniéndose a sala:', roomInput);

    socketRef.current?.send(
      JSON.stringify({
        type: 'JOIN_ROOM',
        roomId: roomInput.trim().toUpperCase(),
      })
    );
  };

  const saveLanguageConfig = () => {
    socketRef.current?.send(
      JSON.stringify({
        type: 'SET_LANGUAGE_CONFIG',
        spokenLanguage,
        listenLanguage,
      })
    );
  };

  return (
    <main className="container">
      <section className="card">
        <h1>Translator Call</h1>

        <p className="subtitle">
          Llamadas con traducción de audio en tiempo real
        </p>

        <div className="status">
          Estado: <strong>{status}</strong>
        </div>

        {!connected && (
          <button onClick={connectSocket}>
            Conectar al servidor
          </button>
        )}

        {connected && (
          <>
            <div className="language-box">
              <label>
                Yo hablo
                <select
                  value={spokenLanguage}
                  onChange={(e) => setSpokenLanguage(e.target.value)}
                >
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                  <option value="it">Italiano</option>
                </select>
              </label>

              <label>
                Quiero escuchar en
                <select
                  value={listenLanguage}
                  onChange={(e) => setListenLanguage(e.target.value)}
                >
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                  <option value="it">Italiano</option>
                </select>
              </label>

              <button onClick={saveLanguageConfig}>
                Guardar idiomas
              </button>

              {languageSaved && (
                <p className="saved-message">
                  Idiomas configurados
                </p>
              )}
            </div>

            <button onClick={createRoom}>
              Crear sala
            </button>

            <div className="join-box">
              <input
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="Código de sala"
              />

              <button onClick={joinRoom}>
                Unirse
              </button>
            </div>

            {roomId && (
              <div className="room-info">
                <p>
                  Sala: <strong>{roomId}</strong>
                </p>
                <p>
                  Usuarios conectados: <strong>{usersCount}/2</strong>
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