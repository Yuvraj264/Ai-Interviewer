'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Room, RoomEvent, createLocalAudioTrack, LocalAudioTrack, RemoteTrack, RemoteTrackPublication } from 'livekit-client';
import { RealtimeConnectionState, MicrophoneState, AiConversationState, TranscriptItem } from '@ai-interviewer/shared';
import { InterviewApiClient } from '@/lib/api-client';

export interface UseRealtimeAudioResult {
  connectionState: RealtimeConnectionState;
  micState: MicrophoneState;
  aiConversationState: AiConversationState;
  agentConnected: boolean;
  transcript: TranscriptItem[];
  errorMessage: string | null;
  connectRealtime: () => Promise<void>;
  disconnectRealtime: () => Promise<void>;
}

export function useRealtimeAudio(sessionId: string): UseRealtimeAudioResult {
  const [connectionState, setConnectionState] = useState<RealtimeConnectionState>('DISCONNECTED');
  const [micState, setMicState] = useState<MicrophoneState>('IDLE');
  const [aiConversationState, setAiConversationState] = useState<AiConversationState>('IDLE');
  const [agentConnected, setAgentConnected] = useState<boolean>(false);
  const [transcript] = useState<TranscriptItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roomRef = useRef<Room | null>(null);
  const audioTrackRef = useRef<LocalAudioTrack | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const disconnectRealtime = useCallback(async () => {
    try {
      if (audioTrackRef.current) {
        audioTrackRef.current.stop();
        audioTrackRef.current = null;
      }
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
      if (audioElRef.current) {
        audioElRef.current.srcObject = null;
      }
    } catch (err) {
      console.warn('[useRealtimeAudio] Error during disconnect:', err);
    } finally {
      setConnectionState('DISCONNECTED');
      setMicState('IDLE');
      setAiConversationState('IDLE');
      setAgentConnected(false);
    }
  }, []);

  const connectRealtime = useCallback(async () => {
    if (!sessionId) return;
    setErrorMessage(null);
    setConnectionState('CONNECTING');
    setMicState('REQUESTING');
    setAiConversationState('CONNECTING');

    try {
      // 1. Fetch short-lived JWT token from backend API
      const { token, url } = await InterviewApiClient.getRealtimeToken(sessionId);

      // 2. Request user microphone permission
      let localTrack: LocalAudioTrack;
      try {
        localTrack = await createLocalAudioTrack();
        audioTrackRef.current = localTrack;
        setMicState('ACTIVE');
      } catch (err: unknown) {
        const errorObj = err as Error;
        if (errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError') {
          setMicState('DENIED');
          setAiConversationState('ERROR');
          throw new Error('Microphone permission was denied. Please allow microphone access to participate in voice interviews.');
        } else if (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError') {
          setMicState('ERROR');
          setAiConversationState('ERROR');
          throw new Error('No microphone device was detected on your computer.');
        } else {
          setMicState('ERROR');
          setAiConversationState('ERROR');
          throw new Error(errorObj.message || 'Failed to initialize microphone audio.');
        }
      }

      // 3. Connect to LiveKit Room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      roomRef.current = room;

      room.on(RoomEvent.Connected, () => {
        setConnectionState('CONNECTED');
        setAiConversationState('LISTENING');
        console.log('[Realtime Voice Transport] [realtime.connection.connected]');

        const hasAgent = Array.from(room.remoteParticipants.values()).some((p) =>
          p.identity.startsWith('agent-'),
        );
        setAgentConnected(hasAgent);
      });

      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication) => {
        if (track.kind === 'audio') {
          console.log(`[Realtime Voice Transport] Subscribed to remote audio track: ${publication.trackSid}`);
          if (!audioElRef.current) {
            audioElRef.current = new Audio();
            audioElRef.current.autoplay = true;
          }
          track.attach(audioElRef.current);
          setAiConversationState('SPEAKING');
        }
      });

      room.on(RoomEvent.Reconnecting, () => {
        setConnectionState('RECONNECTING');
        setAiConversationState('RECONNECTING');
        console.log('[Realtime Voice Transport] [realtime.connection.reconnecting]');
      });

      room.on(RoomEvent.Reconnected, () => {
        setConnectionState('CONNECTED');
        setAiConversationState('LISTENING');
        console.log('[Realtime Voice Transport] [realtime.connection.reconnected]');
      });

      room.on(RoomEvent.Disconnected, () => {
        setConnectionState('DISCONNECTED');
        setAiConversationState('IDLE');
        console.log('[Realtime Voice Transport] [realtime.connection.closed]');
      });

      room.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log(`[Realtime Voice Transport] Participant joined: ${participant.identity}`);
        if (participant.identity.startsWith('agent-')) {
          setAgentConnected(true);
        }
      });

      room.on(RoomEvent.ParticipantDisconnected, (participant) => {
        console.log(`[Realtime Voice Transport] Participant left: ${participant.identity}`);
        if (participant.identity.startsWith('agent-')) {
          setAgentConnected(false);
        }
      });

      // Connect to LiveKit WebRTC server
      await room.connect(url, token);

      // 4. Publish local microphone track
      await room.localParticipant.publishTrack(localTrack);
      console.log('[Realtime Voice Transport] [realtime.microphone.enabled]');
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : 'Failed to establish realtime connection.';
      const isConnectionRefused = rawMsg.includes('Failed to fetch') || rawMsg.includes('could not establish signal') || rawMsg.includes('ERR_CONNECTION');
      const msg = isConnectionRefused
        ? 'LiveKit WebRTC server is offline (ws://localhost:7880). The interview will continue seamlessly in Simulated Interactive Mode via the UI controls.'
        : rawMsg;
      setErrorMessage(msg);
      setConnectionState('FAILED');
      setAiConversationState('ERROR');
      await disconnectRealtime();
    }
  }, [sessionId, disconnectRealtime]);

  useEffect(() => {
    return () => {
      disconnectRealtime();
    };
  }, [disconnectRealtime]);

  return {
    connectionState,
    micState,
    aiConversationState,
    agentConnected,
    transcript,
    errorMessage,
    connectRealtime,
    disconnectRealtime,
  };
}
