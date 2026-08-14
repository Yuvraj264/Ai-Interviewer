'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Room, RoomEvent, createLocalAudioTrack, LocalAudioTrack } from 'livekit-client';
import { RealtimeConnectionState, MicrophoneState } from '@ai-interviewer/shared';
import { InterviewApiClient } from '@/lib/api-client';

export interface UseRealtimeAudioResult {
  connectionState: RealtimeConnectionState;
  micState: MicrophoneState;
  agentConnected: boolean;
  errorMessage: string | null;
  connectRealtime: () => Promise<void>;
  disconnectRealtime: () => Promise<void>;
}

export function useRealtimeAudio(sessionId: string): UseRealtimeAudioResult {
  const [connectionState, setConnectionState] = useState<RealtimeConnectionState>('DISCONNECTED');
  const [micState, setMicState] = useState<MicrophoneState>('IDLE');
  const [agentConnected, setAgentConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roomRef = useRef<Room | null>(null);
  const audioTrackRef = useRef<LocalAudioTrack | null>(null);

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
    } catch (err) {
      console.warn('[useRealtimeAudio] Error during disconnect:', err);
    } finally {
      setConnectionState('DISCONNECTED');
      setMicState('IDLE');
      setAgentConnected(false);
    }
  }, []);

  const connectRealtime = useCallback(async () => {
    if (!sessionId) return;
    setErrorMessage(null);
    setConnectionState('CONNECTING');
    setMicState('REQUESTING');

    try {
      // 1. Fetch short-lived JWT token from backend
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
          throw new Error('Microphone permission was denied. Please allow microphone access to participate in voice interviews.');
        } else if (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError') {
          setMicState('ERROR');
          throw new Error('No microphone device was detected on your computer.');
        } else {
          setMicState('ERROR');
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
        console.log('[Realtime Transport] [realtime.connection.connected]');
        
        // Check if agent is already present in room
        const hasAgent = Array.from(room.remoteParticipants.values()).some((p) =>
          p.identity.startsWith('agent-'),
        );
        setAgentConnected(hasAgent);
      });

      room.on(RoomEvent.Reconnecting, () => {
        setConnectionState('RECONNECTING');
        console.log('[Realtime Transport] [realtime.connection.reconnecting]');
      });

      room.on(RoomEvent.Reconnected, () => {
        setConnectionState('CONNECTED');
        console.log('[Realtime Transport] [realtime.connection.reconnected]');
      });

      room.on(RoomEvent.Disconnected, () => {
        setConnectionState('DISCONNECTED');
        console.log('[Realtime Transport] [realtime.connection.closed]');
      });

      room.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log(`[Realtime Transport] Participant joined: ${participant.identity}`);
        if (participant.identity.startsWith('agent-')) {
          setAgentConnected(true);
        }
      });

      room.on(RoomEvent.ParticipantDisconnected, (participant) => {
        console.log(`[Realtime Transport] Participant left: ${participant.identity}`);
        if (participant.identity.startsWith('agent-')) {
          setAgentConnected(false);
        }
      });

      // Connect to LiveKit WebSocket / WebRTC server
      await room.connect(url, token);

      // 4. Publish local audio track
      await room.localParticipant.publishTrack(localTrack);
      console.log('[Realtime Transport] [realtime.microphone.enabled]');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to establish realtime connection.';
      setErrorMessage(msg);
      setConnectionState('FAILED');
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
    agentConnected,
    errorMessage,
    connectRealtime,
    disconnectRealtime,
  };
}
