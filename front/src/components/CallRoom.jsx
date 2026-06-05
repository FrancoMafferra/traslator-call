import { useEffect, useRef } from "react";
import { getUiTexts } from "../i18n/uiTexts";

function CallRoom({
  translatorSocket,
  microphone,
  audioSender,
  speechRecognition,
  webRTC,
  textToSpeech,
}) {
  const messagesEndRef = useRef(null);
  const t = getUiTexts(translatorSocket.listenLanguage);

  const callStatus =
    t.callStatuses[webRTC.webrtcStatus] || webRTC.webrtcStatus;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    const lastMessage =
      translatorSocket.messages[
        translatorSocket.messages.length - 1
      ];

    if (lastMessage?.type === "received") {
      textToSpeech?.speak({
        text: lastMessage.translatedText,
        language: lastMessage.targetLanguage,
      });
    }
  }, [translatorSocket.messages, textToSpeech]);

  useEffect(() => {
    if (!microphone.microphoneReady) return;
    if (speechRecognition.listening) return;

    speechRecognition.startListening();
  }, [
    microphone.microphoneReady,
    speechRecognition.listening,
    speechRecognition,
  ]);

  if (!speechRecognition) {
    return <p>{t.loadingSpeech}</p>;
  }

  if (!webRTC) {
    return (
      <p style={{ color: "red" }}>
        {t.webRTCError}
      </p>
    );
  }

  const leaveRoom = () => {
    window.location.reload();
  };

  return (
    <div className="room-screen">
      <div className="room-header">
        <div>
          <h2>
            {t.room}: {translatorSocket.roomId}
          </h2>

          <p>
            {t.connectedUsers}: {translatorSocket.usersCount}/2
          </p>
        </div>

        <button onClick={leaveRoom}>
          {t.leave}
        </button>
      </div>

      <div className="room-body">
        <div className="left-panel">
          <div className="room-card">
            <p>
              {t.microphone}:{" "}
              <strong>
                {microphone.microphoneReady
                  ? t.ready
                  : t.unavailable}
              </strong>
            </p>

            <p>
              {t.callStatus}:{" "}
              <strong>{callStatus}</strong>
            </p>

            <p>
              {t.translatedVoice}:{" "}
              <strong>{t.active}</strong>
            </p>
          </div>

          <div className="webrtc-box">
            <p>
              {t.call}: <strong>{callStatus}</strong>
            </p>

            {!webRTC.webrtcConnected ? (
              <button onClick={webRTC.startCallAsCaller}>
                {t.connectCall}
              </button>
            ) : (
              <button disabled>
                {t.callConnected}
              </button>
            )}

            <button onClick={webRTC.endCall}>
              {t.endCall}
            </button>
          </div>
        </div>

        <div className="right-panel">
          <div className="speech-box">
            {!speechRecognition.speechSupported && (
              <p className="error-message">
                {t.speechNotSupported}
              </p>
            )}

            <p className="call-status">
              {t.subtitles}:{" "}
              <strong>
                {speechRecognition.listening
                  ? t.subtitlesActive
                  : t.subtitlesInactive}
              </strong>
            </p>

            <div className="messages-container">
              {translatorSocket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.type === "mine"
                      ? "message mine"
                      : "message received"
                  }
                >
                  {msg.type === "mine" ? (
                    <p>{msg.text}</p>
                  ) : (
                    <>
                      <p>{msg.translatedText}</p>

                      <span>
                        {msg.fromLanguage} → {msg.targetLanguage}
                      </span>
                    </>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <audio
          ref={webRTC.remoteAudioRef}
          autoPlay
          playsInline
          muted
        />
      </div>
    </div>
  );
}

export default CallRoom;