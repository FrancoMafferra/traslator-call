function CallRoom({
	translatorSocket,
	microphone,
	audioSender,
	speechRecognition,
}) {
	if (!speechRecognition) {
		return <p>Cargando reconocimiento de voz...</p>;
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
						Mi último texto:{' '}
						<strong>
							{speechRecognition.lastTranscript || '...'}
						</strong>
					</p>

					<p>
						Texto recibido:{' '}
						<strong>
							{translatorSocket.receivedText ||
								'Esperando voz...'}
						</strong>
					</p>
				</div>
			</div>

			<div className="room-footer">
				{!audioSender.audioSending ? (
					<button onClick={audioSender.startSendingAudio}>
						Iniciar audio
					</button>
				) : (
					<button onClick={audioSender.stopSendingAudio}>
						Pausar audio
					</button>
				)}
			</div>
		</div>
	);
}

export default CallRoom;