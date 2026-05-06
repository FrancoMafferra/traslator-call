import { useRef, useState } from 'react';

export function useAudioSender({ streamRef, socketRef }) {
  const mediaRecorderRef = useRef(null);

  const [audioSending, setAudioSending] = useState(false);

  const startSendingAudio = () => {
    if (!streamRef.current || !socketRef.current) return;

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'audio/webm',
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = async (event) => {
      if (!event.data || event.data.size === 0) return;

      const arrayBuffer = await event.data.arrayBuffer();
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      socketRef.current.send(
        JSON.stringify({
          type: 'AUDIO_CHUNK',
          audio: base64Audio,
        })
      );
    };

    mediaRecorder.start(1000);
    setAudioSending(true);
  };

  const stopSendingAudio = () => {
    mediaRecorderRef.current?.stop();
    setAudioSending(false);
  };

  return {
    audioSending,
    startSendingAudio,
    stopSendingAudio,
  };
}