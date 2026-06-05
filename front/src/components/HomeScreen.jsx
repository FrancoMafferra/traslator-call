import { useMemo, useState } from 'react';

import CallControls from './CallControls';
import RoomControls from './RoomControls';
import ConnectionStatus from './ConnectionStatus';

const translations = {
	es: {
		selectLanguage: 'Seleccionar idioma',
		enterCall: 'Entrar a la llamada',
		enterViewer: 'Entrar como espectador',
		microphone: 'Micrófono',
		pending: 'pendiente',
		ready: 'listo',
		readyHint: 'Ya podés entrar o crear una sala.',
		viewerHint: 'Usá espectador si solo querés recibir subtítulos y voz traducida.',
		modalTitle: 'Configurar idiomas',
		iSpeak: 'Yo hablo',
		iWantToHear: 'Quiero escuchar en',
		saveLanguage: 'Guardar idioma',
		close: 'Cerrar',
		selectOption: 'Seleccionar',
		spanish: 'Español',
		english: 'Inglés',
	},
	en: {
		selectLanguage: 'Select language',
		enterCall: 'Join call',
		enterViewer: 'Join as viewer',
		microphone: 'Microphone',
		pending: 'pending',
		ready: 'ready',
		readyHint: 'You can now join or create a room.',
		viewerHint: 'Use viewer mode if you only want subtitles and translated voice.',
		modalTitle: 'Language settings',
		iSpeak: 'I speak',
		iWantToHear: 'I want to hear',
		saveLanguage: 'Save language',
		close: 'Close',
		selectOption: 'Select',
		spanish: 'Spanish',
		english: 'English',
	},
};

function getBrowserLanguage() {
	const browserLanguage = navigator.language || 'es';

	return browserLanguage.startsWith('en') ? 'en' : 'es';
}

function HomeScreen({
	translatorSocket,
	microphone,
	textToSpeech,
}) {
	const [languageModalOpen, setLanguageModalOpen] = useState(false);

	const uiLanguage =
		translatorSocket.listenLanguage || getBrowserLanguage();

	const t = translations[uiLanguage] || translations.es;

	const hasLanguages = useMemo(() => {
		return Boolean(
			translatorSocket.spokenLanguage &&
			translatorSocket.listenLanguage,
		);
	}, [
		translatorSocket.spokenLanguage,
		translatorSocket.listenLanguage,
	]);

	const saveLanguages = () => {
		if (
			!translatorSocket.spokenLanguage ||
			!translatorSocket.listenLanguage
		) {
			return;
		}

		translatorSocket.saveLanguageConfig();
		setLanguageModalOpen(false);

		textToSpeech?.warmupVoices();

		if (!translatorSocket.connected) {
			translatorSocket.connectSocket();
		}
	};

	return (
		<>
			<ConnectionStatus
				status={translatorSocket.status}
				language={translatorSocket.listenLanguage}
			/>

			{!translatorSocket.connected && (
				<CallControls
					connected={translatorSocket.connected}
					connectSocket={translatorSocket.connectSocket}
					microphoneReady={microphone.microphoneReady}
					microphoneError={microphone.microphoneError}
					requestMicrophone={microphone.requestMicrophone}
					textToSpeech={textToSpeech}
					hasLanguages={hasLanguages}
					onOpenLanguageModal={() => {
						microphone.requestMicrophone();
						setLanguageModalOpen(true);
					}}
					t={t}
				/>
			)}

			{languageModalOpen && (
				<div className="modal-backdrop">
					<div className="language-modal">
						<h2>{t.modalTitle}</h2>

						<label>
							{t.iSpeak}
							<select
								value={translatorSocket.spokenLanguage}
								onChange={(event) =>
									translatorSocket.setSpokenLanguage(event.target.value)
								}
							>
								<option value="">{t.selectOption}</option>
								<option value="es">{t.spanish}</option>
								<option value="en">{t.english}</option>
							</select>
						</label>

						<label>
							{t.iWantToHear}
							<select
								value={translatorSocket.listenLanguage}
								onChange={(event) =>
									translatorSocket.setListenLanguage(event.target.value)
								}
							>
								<option value="">{t.selectOption}</option>
								<option value="es">{t.spanish}</option>
								<option value="en">{t.english}</option>
							</select>
						</label>

						<div className="modal-actions">
							<button
								type="button"
								onClick={saveLanguages}
								disabled={!hasLanguages}
							>
								{t.saveLanguage}
							</button>

							<button
								type="button"
								className="secondary-button"
								onClick={() => setLanguageModalOpen(false)}
							>
								{t.close}
							</button>
						</div>
					</div>
				</div>
			)}

			{translatorSocket.connected && (
				<RoomControls
					{...translatorSocket}
				/>
			)}
		</>
	);
}

export default HomeScreen;