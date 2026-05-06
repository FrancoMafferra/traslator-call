export function playReceivedAudio(base64Audio) {
  const binary = atob(base64Audio);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], {
    type: 'audio/webm',
  });

  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);

  audio.play();

  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
  };
}