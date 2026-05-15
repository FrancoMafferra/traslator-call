import { useEffect, useRef } from 'react';

function CallRoom({
	translatorSocket,
	microphone,
	audioSender,
	speechRecognition,
	webRTC,
	textToSpeech,
}) {
	const messagesEndRef = useRef(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
		});

		const lastMessage =
			translatorSocket.messages[translatorSocket.messages.length - 1];

		if (lastMessage?.type === 'received') {
			textToSpeech?.speak({
				text: lastMessage.translatedText,
				language: lastMessage.targetLanguage,
			});
		}
	}, [translatorSocket.messages]);

	if (!speechRecognition) {
		return <p>Cargando reconocimiento de voz...</p>;
	}

	if (!webRTC) {
		return (
			<p style={{ color: 'red' }}>
				Error: webRTC no fue inicializado. Revisar useWebRTC.js.
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
					<h2>Sala {translatorSocket.roomId}</h2>

					<p>
						Usuarios conectados: {translatorSocket.usersCount}/2
					</p>
				</div>

				<button onClick={leaveRoom}>Salir</button>
			</div>

			<div className="room-body">
				<div className="left-panel">
					<div className="room-card">
						<p>
							Micrófono:{' '}
							<strong>
								{microphone.microphoneReady
									? 'listo'
									: 'no disponible'}
							</strong>
						</p>

						<p>
							Audio:{' '}
							<strong>
								{audioSender.audioSending
									? 'activo'
									: 'pausado'}
							</strong>
						</p>
					</div>

					<div className="webrtc-box">
						<p>
							WebRTC: <strong>{webRTC.webrtcStatus}</strong>
						</p>

						<button onClick={webRTC.startCallAsCaller}>
							Iniciar llamada WebRTC
						</button>

						<button onClick={webRTC.endCall}>
							Cortar WebRTC
						</button>
					</div>
				</div>

				<div className="right-panel">
					<div className="speech-box">
						{!speechRecognition.speechSupported && (
							<p className="error-message">
								Tu navegador no soporta reconocimiento de voz.
								Probá con Chrome o Edge.
							</p>
						)}

						{!speechRecognition.listening ? (
							<button onClick={speechRecognition.startListening}>
								Activar subtítulos
							</button>
						) : (
							<button onClick={speechRecognition.stopListening}>
								Pausar subtítulos
							</button>
						)}

						<div className="messages-container">
							{translatorSocket.messages.map((msg) => (
								<div
									key={msg.id}
									className={
										msg.type === 'mine'
											? 'message mine'
											: 'message received'
									}
								>
									{msg.type === 'mine' ? (
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
					muted={true}
				/>
			</div>
		</div>
	);
}

export default CallRoom;