function CallControls({
  connected,
  connectSocket,
  microphoneReady,
  microphoneError,
  requestMicrophone,
}) {
  const enterCall = async () => {
    await requestMicrophone();

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

      <p className="call-status">
        Micrófono: <strong>pendiente</strong>
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