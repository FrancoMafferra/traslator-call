function CallRoom({
	translatorSocket,
	microphone,
	audioSender,
}) {
	const leaveRoom = () => {
		window.location.reload();
	};

	return (
		<div className="room-screen">
			<div className="room-header">
				<div>
					<h2>
						Sala {translatorSocket.roomId}
					</h2>

					<p>
						Usuarios conectados:{' '}
						{translatorSocket.usersCount}/2
					</p>
				</div>

				<button onClick={leaveRoom}>
					Salir
				</button>
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
			</div>

			<div className="room-footer">
				{!audioSender.audioSending ? (
					<button
						onClick={
							audioSender.startSendingAudio
						}
					>
						Iniciar audio
					</button>
				) : (
					<button
						onClick={
							audioSender.stopSendingAudio
						}
					>
						Pausar audio
					</button>
				)}
			</div>
		</div>
	);
}

export default CallRoom;