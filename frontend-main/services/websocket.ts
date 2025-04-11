import { useEffect, useRef, useCallback, useState } from 'react';
import { WS_BASE_URL } from '../config';
import { getAuthToken } from '../utils/auth';
import * as NetInfo from "@react-native-community/netinfo";
import type { NetInfoState } from "@react-native-community/netinfo";

interface WebSocketMessage {
  type: string;
  data?: any;
}

interface WebSocketHook {
  sendMessage: (message: WebSocketMessage) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  error: string | null;
  retrySendMessage: (message: WebSocketMessage) => void;
}

// This is your dedicated connectWebSocket utility.
export const connectWebSocket = (
  conversationId: string,
  token: string,
  userId: string,
  onMessageReceived: (message: any) => void,
  onTypingIndicator?: (data: any) => void,
  onReadReceipt?: (data: any) => void
): WebSocket => {
  const socket = new WebSocket(`${WS_BASE_URL}/ws/messaging/${conversationId}/?token=${token}`);

  socket.onopen = () => {
    console.log('[WS] Connection established for conversation', conversationId);
    // Send join message to ensure we're connected to the room
    socket.send(JSON.stringify({ 
      type: 'join', 
      data: { conversation_id: conversationId,
              user_id: userId } 
    }));
  };

  socket.onmessage = (event) => {
   try {
     const data = JSON.parse(event.data);
     console.log('[WS Utility] Raw message:', data);

     // Standardized message handling
     switch (data.type) {
       case 'conversation_message':
       case 'new_message':
       case 'message_create':
       case 'message_update':
         console.log(`[WS] Processing ${data.type}:`, data);
         onMessageReceived({
           type: data.type,
           id: data.id,
           content: data.content,
           sender: data.sender,
           timestamp: data.timestamp,
           status: data.status,
           conversation: data.conversation,
         });
         break;
       case 'typing_indicator':
         onTypingIndicator?.(data);
         break;
       case 'read_receipt':
         onReadReceipt?.(data);
         break;
       default:
         console.log('[WS] Unhandled message type:', data.type, data);
     }
   } catch (error) {
     console.error('[WS] Error processing message:', error);
   }
 };

  socket.onerror = (error) => {
    console.error('[WS] WebSocket error:', error);
  };

  socket.onclose = (event) => {
    console.log('[WS] Connection closed for conversation', conversationId, 'Code:', event.code);
  };

  return socket;
};

// The hook now uses connectWebSocket and does not override its events.
export const useWebSocket = (
  conversationId: string,
  onMessageReceived: (data: any) => void,
): WebSocketHook => {
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000; 
  const onMessageReceivedRef = useRef(onMessageReceived);
  const connectionStatusRef = useRef<'connecting' | 'connected' | 'disconnected'>('disconnected');

  // Update the message callback ref on change.
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  const connect = useCallback(() => {
    if (!conversationId) {
      console.warn('Missing conversation ID');
      return;
    }

    const token =  getAuthToken();
    if (!token) {
      console.error('No authentication token available');
      return; 
    }
    
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    connectionStatusRef.current = 'connecting';

    ws.current = connectWebSocket(
      conversationId,
      token,
      (msg) => {
        console.log('[WS Hook] onMessageReceived invoked with:', msg);

        onMessageReceivedRef.current(msg);
      },
      (data) => {
        console.log('[WS Hook] Typing indicator:', data);
      },
      (data) => {
        console.log('[WS Hook] Read receipt:', data);
      }
    );


    ws.current.onerror = (error) => {
      console.error('WebSocket error (hook):', error);
      setError('WebSocket connection error.');
    };

    ws.current.onopen = () => {
      console.log(`[WS Hook] Connected to conversation ${conversationId}`);
      connectionStatusRef.current = 'connected';
      reconnectAttempts.current = 0;
    };
  }, [conversationId]);

  // Connect on mount and when conversationId changes.
  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        console.log('[WS Hook] Closing WebSocket on component unmount');
        ws.current.close(1000, 'Component unmounted');
        ws.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      setError(null); // Clear any previous errors before sending
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected, cannot send message');
      setError('Message could not be sent: Not connected.');
    }
  }, []);

  const retrySendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      setError(null); // Clear any previous errors before retrying
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected, cannot retry sending message');
    }
  }, []);

  // Heartbeat to keep the connection alive
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        sendMessage({ type: 'heartbeat' });
      }
    }, 30000); // every 30 seconds
    return () => clearInterval(heartbeatInterval);
  }, [sendMessage]);

  // Add NetInfo listener for reconnection
  useEffect(() => {
    const handleNetworkChange = (state: NetInfoState) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (state.isConnected && !ws.current && connectionStatusRef.current === 'disconnected') {
        connect();
      }
    };

    const unsubscribe = (NetInfo as any).addEventListener(handleNetworkChange);

    return () => {
      unsubscribe();
    };
  }, [connect]);

  return {
    sendMessage,
    connectionStatus: connectionStatusRef.current,
    error,
    retrySendMessage,
  };
};