function CallControls({
  connected,
  connectSocket,
  microphoneReady,
  microphoneError,
  requestMicrophone,
  textToSpeech,
  hasLanguages,
  onOpenLanguageModal,
  t,
}) {
  const validateLanguages = () => {
    if (!hasLanguages) {
      onOpenLanguageModal();
      return false;
    }

    return true;
  };

  const enterCall = async () => {
    if (!validateLanguages()) return;

    const stream = await requestMicrophone();

    textToSpeech?.warmupVoices();

    if (stream && !connected) {
      connectSocket();
    }
  };

  const enterAsViewer = () => {
    if (!validateLanguages()) return;

    textToSpeech?.warmupVoices();

    if (!connected) {
      connectSocket();
    }
  };

  if (microphoneReady) {
    return (
      <div className="call-box ready">
        <p className="call-status">
          {t.microphone}: <strong>{t.ready}</strong>
        </p>

        <p className="call-hint">
          {t.readyHint}
        </p>
      </div>
    );
  }

  return (
    <div className="call-box">
      <button onClick={enterCall}>
        {t.enterCall}
      </button>

      <button onClick={enterAsViewer}>
        {t.enterViewer}
      </button>

      <p className="call-status">
        {t.microphone}: <strong>{t.pending}</strong>
      </p>

      <p className="call-hint">
        {t.viewerHint}
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