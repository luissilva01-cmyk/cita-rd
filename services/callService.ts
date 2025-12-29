// cita-rd/services/callService.ts
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  orderBy, 
  serverTimestamp,
  where,
  getDocs
} from "firebase/firestore";
import { Call } from '../types';

// Crear una nueva llamada
export const initiateCall = async (
  chatId: string, 
  callerId: string, 
  receiverId: string, 
  type: 'voice' | 'video'
): Promise<string> => {
  const callData: Omit<Call, 'id'> = {
    chatId,
    callerId,
    receiverId,
    type,
    status: 'ringing',
    startTime: Date.now()
  };
  
  const docRef = await addDoc(collection(db, "calls"), {
    ...callData,
    serverTimestamp: serverTimestamp()
  });
  
  console.log('📞 Llamada iniciada:', docRef.id, type);
  return docRef.id;
};

// Actualizar estado de llamada
export const updateCallStatus = async (
  callId: string, 
  status: Call['status'], 
  duration?: number
) => {
  const callRef = doc(db, "calls", callId);
  const updateData: any = {
    status,
    serverTimestamp: serverTimestamp()
  };
  
  if (status === 'active') {
    updateData.startTime = Date.now();
  } else if (status === 'ended') {
    updateData.endTime = Date.now();
    if (duration) {
      updateData.duration = duration;
    }
  }
  
  await updateDoc(callRef, updateData);
  console.log('📞 Estado de llamada actualizado:', callId, status);
};

// Escuchar llamadas entrantes para un usuario
export const listenToIncomingCalls = (
  userId: string, 
  callback: (calls: Call[]) => void
) => {
  const q = query(
    collection(db, "calls"),
    where("receiverId", "==", userId),
    where("status", "in", ["ringing", "active"])
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const calls: Call[] = [];
    querySnapshot.forEach((doc) => {
      calls.push({ id: doc.id, ...doc.data() } as Call);
    });
    
    console.log('📞 Llamadas entrantes:', calls.length);
    callback(calls);
  });
};

// Simular WebRTC para llamadas (en producción usar WebRTC real)
export class CallManager {
  private currentCall: Call | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  public onCallStateChange?: (call: Call | null) => void;

  constructor(onCallStateChange?: (call: Call | null) => void) {
    this.onCallStateChange = onCallStateChange;
  }

  // Iniciar llamada
  async startCall(chatId: string, callerId: string, receiverId: string, type: 'voice' | 'video') {
    try {
      console.log('📞 Iniciando llamada:', type);
      
      // Obtener permisos de cámara/micrófono
      const constraints = {
        audio: true,
        video: type === 'video'
      };
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Crear llamada en Firebase
      const callId = await initiateCall(chatId, callerId, receiverId, type);
      
      this.currentCall = {
        id: callId,
        chatId,
        callerId,
        receiverId,
        type,
        status: 'ringing',
        startTime: Date.now()
      };
      
      this.onCallStateChange?.(this.currentCall);
      
      return callId;
    } catch (error) {
      console.error('❌ Error iniciando llamada:', error);
      throw error;
    }
  }

  // Responder llamada
  async answerCall(call: Call) {
    try {
      console.log('📞 Respondiendo llamada:', call.id);
      
      const constraints = {
        audio: true,
        video: call.type === 'video'
      };
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentCall = { ...call, status: 'active' };
      
      await updateCallStatus(call.id, 'active');
      this.onCallStateChange?.(this.currentCall);
      
    } catch (error) {
      console.error('❌ Error respondiendo llamada:', error);
      await this.declineCall(call);
    }
  }

  // Rechazar llamada
  async declineCall(call: Call) {
    console.log('📞 Rechazando llamada:', call.id);
    await updateCallStatus(call.id, 'declined');
    this.endCall();
  }

  // Terminar llamada
  async endCall() {
    if (this.currentCall) {
      console.log('📞 Terminando llamada:', this.currentCall.id);
      
      const duration = this.currentCall.startTime 
        ? Math.floor((Date.now() - this.currentCall.startTime) / 1000)
        : 0;
      
      await updateCallStatus(this.currentCall.id, 'ended', duration);
      
      // Limpiar streams
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      
      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
        this.remoteStream = null;
      }
      
      this.currentCall = null;
      this.onCallStateChange?.(null);
    }
  }

  // Obtener stream local
  getLocalStream() {
    return this.localStream;
  }

  // Obtener llamada actual
  getCurrentCall() {
    return this.currentCall;
  }

  // Alternar cámara (solo video)
  async toggleCamera() {
    if (this.localStream && this.currentCall?.type === 'video') {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  // Alternar micrófono
  async toggleMicrophone() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }
}

export const callManager = new CallManager(undefined);