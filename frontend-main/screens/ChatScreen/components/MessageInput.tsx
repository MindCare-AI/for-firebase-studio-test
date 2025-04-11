//screens/ChatScreen/components/MessageInput.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, Animated, Platform, Text, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Message } from '../../../types/chat';
import AttachmentPicker from './AttachmentPicker'; // New import for attachments
import { useChatMessages } from '../hooks/useChatMessages'; // Import the hook

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onTypingStart: () => void; // Add onTypingStart
  onTypingStop: () => void;  // Add onTypingStop
  editMessage?: Message | null;
  onEditCancel: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  value, 
  onChangeText, 
  onSend,
  onTypingStart, // Receive onTypingStart
  onTypingStop,  // Receive onTypingStop
  editMessage, 
  onEditCancel
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [showAttachments, setShowAttachments] = useState(false); // New state for attachments

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: 250,
          useNativeDriver: false
        }).start();
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [keyboardHeight]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (editMessage) {
      inputRef.current?.focus();
    }
  }, [editMessage]);

  const handleSend = () => {
    onSend();
    // Focus the input again after sending
    inputRef.current?.focus();
  };

  const handleTextChange = useCallback((text: string) => {    
    onChangeText(text);
    if (text.length > 0) {
      onTypingStart();
    } else {
      onTypingStop();
    }
  }, [onChangeText, onTypingStart, onTypingStop]);

  const debouncedHandleTextChange = useCallback((event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = event.nativeEvent.text;
    handleTextChange(text);
  }, [handleTextChange]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onTypingStop(); // Ensure typing stops when input loses focus
  }, [onTypingStop]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  return (
    <View style={styles.containerWrapper}>
      {editMessage && (
        <View style={styles.editHeader}>
          <Text style={styles.editHeaderText}>Editing message</Text>
          <TouchableOpacity onPress={onEditCancel} style={styles.editCancelButton}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.container}>
        {!editMessage && (
          <TouchableOpacity 
            style={styles.attachmentButton}
            onPress={() => setShowAttachments(true)} // Open attachment picker
          >
            <Icon name="attach" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
        
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            isFocused && styles.focusedInput,
            editMessage && styles.editInput
          ]}
          placeholder={editMessage ? "Edit your message..." : "Type a message..."}
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="default"
          value={value}
          onChange={debouncedHandleTextChange}
          blurOnSubmit={false}
        />
        
        {value ? (
          <TouchableOpacity 
            style={[styles.sendButton, editMessage && styles.editSendButton]} 
            onPress={handleSend}
          >
            <Icon name={editMessage ? "checkmark" : "send"} size={24} color="white" />
          </TouchableOpacity>
        ) : (
          !editMessage && (
            <TouchableOpacity style={styles.mediaButton}>
              <Icon name="camera" size={24} color="#007AFF" />
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Attachment Picker */}
      <AttachmentPicker
        visible={showAttachments}
        onClose={() => setShowAttachments(false)}
        onSelect={(attachments) => {
          // Handle selected attachments here
          setShowAttachments(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#e8f0fe', // Light blue background for edit mode
    borderBottomWidth: 1,
    borderBottomColor: '#b3d4fc', // Slightly darker blue border
  },
  editHeaderText: {
    fontSize: 16,
    color: '#1e3a8a', // Dark blue text color
    fontWeight: '500',
  },
  editCancelButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light gray input background
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#d9d9d9', // Light gray border
  },
  focusedInput: {
    borderColor: '#1e3a8a', // Focus border color
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  editInput: {
    backgroundColor: '#e8f0fe', // Light blue background for edit mode input
    borderColor: '#1e3a8a', // Blue border for edit mode input
    borderWidth: 1, // Keep the border in edit mode
  },
  attachmentButton: {
    padding: 8,
  },
  mediaButton: {
    padding: 8,
  },
  sendButton: {
    padding: 8,
    backgroundColor: '#1e3a8a', // Dark blue send button
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  editSendButton: {
    backgroundColor: '#4CD964', // Green color for save/confirm
  },
});

export default MessageInput;