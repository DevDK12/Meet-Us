//! BUG : ScrollViews are not working as indented



//? WebRTC Process FLow :

//- A enters room

//- B enters room
//_ pcA = new RTCPeerConnection(stun_servers)
//*     -> Creates peerConnection obj for A and  configures it with stun servers
//*     (which will be pinged by WebRTC  asyncly during ICE Gathering Process)

//_ pcA.onTrack()
//*     -> adds onTrack listner to pcA
//*     -> Receives remote stream from A and saves it in liveMeetSession

//_ pcA.onIceCandidate()
//*     -> adds onIceCandidate listner (triggered when WebRTC resolves ice candidate from server ),
//*     -> Receives multiple ICE candidates during ICE gathering process
//*     -> Sends them to A via socket (signaling server) when ICE candidates received

//* We have iceConnectionState which tells about connection state of ICE candidates
//* As soon as state is completed then RTCRtpSender fires

//_ pcA.addTrack(localStream)
//*     -> Adds local stream to pcA , which creates RTCRtpSender internally that sends this
//*         stream to A when needed
//*     -> This information also included in SDP offer to inform A about media formats etc

//_ pcA.createOffer()
//*     -> Creates SDP offer object which contains media formats etc

//_ pcA.setLocalDescription(offer)
//*     -> ICE Gathering process starts and A starts receiving ICE candidates 1 by 1
//*     -> Final ICE candidate sent is null which means ICE gathering process is completed

//_ sendsToA(offer )
//*     -> B sends offer to A via socket (signaling server)

//- A receives offer from B
//_ pcB = new RTCPeerConnection(stun_servers)
//_ pcB.onTrack()
//_ pcB.onIceCandidate()

//_ For each pending Ice candidate received from B for pcB (stored in [])
//*      -> pcB.addIceCandidate(candidate)
//*      -> Adds them to pcB

//_ pcB.addTrack(localStream)
//_ pcB.setRemoteDescription(offer)
//*      -> A allocates resources for B's incoming media stream

//_ pcB.createAnswer()
//*      -> Creates SDP answer object which contains media formats etc

//_ pcB.setLocalDescription(answer)
//*      -> ICE Gathering process starts and A starts receiving ICE candidates 1 by 1

//_ sendsToB(answer)
//*      -> A sends answer to B via socket (signaling server)


//- B receives answer from A
//_ pcA.setRemoteDescription(answer)


//- ICE Gathering Process
//_ A sends ICE candidates to B , meanwhile B sends ICE candidates to A
//_ When A receives ICE candidate
//*     -> A adds ICE candidate to pcB via pcB.addIceCandidate(candidate)
//*     -> If pcB not exists then
//*         -> initiates empty [] for pendingIceCandidate[pcB] map if not exists
//*         -> Stores ice candidate in pendingIceCandidate[pcB]
//*         -> which will be added to pcB when pcB is created during receive Offer period


