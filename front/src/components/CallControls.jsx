function CallControls({
  connected,
  connectSocket,
  microphoneReady,
  microphoneError,
  requestMicrophone,
  textToSpeech,
}) {
  const enterCall = async () => {
    const stream = await requestMicrophone();

    textToSpeech?.warmupVoices();

    if (stream && !connected) {
      connectSocket();
    }
  };

  const enterAsViewer = () => {
    textToSpeech?.warmupVoices();

    if (!connected) {
      connectSocket();
    }
  };

  if (microphoneReady) {
    return (
      <div className="call-box ready">
        <p className="call-status">
          Micrófono: <strong>listo</strong>
        </p>

        <p className="call-hint">
          Ya podés configurar tus idiomas y entrar a una sala.
        </p>
      </div>
    );
  }

  return (
    <div className="call-box">
      <button onClick={enterCall}>
        Entrar a la llamada
      </button>

      <button onClick={enterAsViewer}>
        Entrar como espectador
      </button>

      <p className="call-status">
        Micrófono: <strong>pendiente</strong>
      </p>

      <p className="call-hint">
        Usá espectador si solo querés recibir subtítulos y voz traducida.
      </p>

      {microphoneError && (
        <p className="error-message">
          {microphoneError}
        </p>
      )}
    </div>
  );
}

export default CallControls;