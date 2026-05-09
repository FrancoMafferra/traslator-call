import { useRef, useState } from "react";

const rtcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export function useWebRTC({ socketRef, streamRef }) {
  const peerConnectionRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const [webrtcConnected, setWebrtcConnected] = useState(false);
  const [webrtcStatus, setWebrtcStatus] = useState("Sin iniciar");

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(rtcConfig);

    peerConnectionRef.current = peerConnection;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, streamRef.current);
      });
    }

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.send(
          JSON.stringify({
            type: "WEBRTC_ICE_CANDIDATE",
            candidate: event.candidate,
          }),
        );
      }
    };

    peerConnection.onconnectionstatechange = () => {
      setWebrtcStatus(peerConnection.connectionState);

      if (peerConnection.connectionState === "connected") {
        setWebrtcConnected(true);
      }

      if (
        peerConnection.connectionState === "disconnected" ||
        peerConnection.connectionState === "failed" ||
        peerConnection.connectionState === "closed"
      ) {
        setWebrtcConnected(false);
      }
    };

    return peerConnection;
  };

  const startCallAsCaller = async () => {
    const peerConnection = peerConnectionRef.current || createPeerConnection();

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    socketRef.current?.send(
      JSON.stringify({
        type: "WEBRTC_OFFER",
        offer,
      }),
    );

    setWebrtcStatus("offer-sent");
  };

  const handleOffer = async (offer) => {
    const peerConnection = peerConnectionRef.current || createPeerConnection();

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer);

    socketRef.current?.send(
      JSON.stringify({
        type: "WEBRTC_ANSWER",
        answer,
      }),
    );

    setWebrtcStatus("answer-sent");
  };

  const handleAnswer = async (answer) => {
    const peerConnection = peerConnectionRef.current;

    if (!peerConnection) return;

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer),
    );

    setWebrtcStatus("answer-received");
  };

  const handleIceCandidate = async (candidate) => {
    const peerConnection = peerConnectionRef.current;

    if (!peerConnection || !candidate) return;

    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const endCall = () => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    setWebrtcConnected(false);
    setWebrtcStatus("closed");
  };

  return {
    remoteAudioRef,
    webrtcConnected,
    webrtcStatus,
    startCallAsCaller,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    endCall,
  };
}
