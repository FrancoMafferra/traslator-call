import CallControls from './CallControls';
import LanguageSelector from './LanguageSelector';
import RoomControls from './RoomControls';
import ConnectionStatus from './ConnectionStatus';

function HomeScreen({
	translatorSocket,
	microphone,
	textToSpeech,
}) {
	return (
		<>
			<ConnectionStatus
				status={translatorSocket.status}
			/>

			<CallControls
				connected={translatorSocket.connected}
				connectSocket={translatorSocket.connectSocket}
				microphoneReady={microphone.microphoneReady}
				microphoneError={microphone.microphoneError}
				requestMicrophone={microphone.requestMicrophone}
				textToSpeech={textToSpeech}
			/>

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
		</>
	);
}

export default HomeScreen;