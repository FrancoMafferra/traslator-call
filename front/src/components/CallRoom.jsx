function CallRoom({
	translatorSocket,
	microphone,
	audioSender,
	speechRecognition,
	webRTC,
}) {
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
						Usuarios conectados:{' '}
						{translatorSocket.usersCount}/2
					</p>
				</div>

				<button onClick={leaveRoom}>Salir</button>
			</div>

			<div className="room-body">
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

					<p>
						Último msj:{' '}
						<strong>
							{speechRecognition.lastTranscript || '...'}
						</strong>
					</p>

					<p>
						Msj recibido:{' '}
						<strong>
							{translatorSocket.receivedText ||
								'Esperando msj...'}
						</strong>
					</p>
				</div>

				<audio
					ref={webRTC.remoteAudioRef}
					autoPlay
					playsInline
				/>

				<div className="webrtc-box">
					<p>
						WebRTC:{' '}
						<strong>{webRTC.webrtcStatus}</strong>
					</p>

					<button onClick={webRTC.startCallAsCaller}>
						Iniciar llamada WebRTC
					</button>

					<button onClick={webRTC.endCall}>
						Cortar WebRTC
					</button>
				</div>
			</div>
		</div>
	);
}

export default CallRoom;