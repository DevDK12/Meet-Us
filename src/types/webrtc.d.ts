// webrtc.d.ts (or any file inside src/types/)
declare global {
    interface RTCPeerConnection {
        ontrack?: (event: RTCTrackEvent) => void;
        onicecandidate?: (event: RTCIceCandidateEvent) => void;
        // Add any other WebRTC custom event handlers you need
    }
}

export { };
