// screens/ChatScreen/components/ReadReceipts.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ReadReceiptsProps {
  readBy: Array<{
    id: string;
    name: string;
    read_at: string;
  }>;
  isUserMessage: boolean;
}

const ReadReceipts: React.FC<ReadReceiptsProps> = ({ readBy, isUserMessage }) => {
  if (!readBy || readBy.length === 0) {
    return null;
  }

  // Check for missing properties in readBy array
  const hasMissingData = readBy.some(
    (read) => !read || !read.id || !read.name || !read.read_at
  );

  if (hasMissingData) {
    console.warn("Missing read receipt data:", readBy);
    return null; // Or display an error message if appropriate
  }

  return (
    <View style={[styles.container, isUserMessage ? styles.userReceipts : styles.otherReceipts]}>
      <View style={styles.readContainer}>
        <Icon
          name="checkmark-done"
          size={14}
          color={isUserMessage ? '#E0E0E0' : '#666'}
          style={styles.icon}
        />
        {readBy.length > 1 && (
          <Text style={styles.readUsers}>
            {`Read by ${readBy.length} users`}
          </Text>
        )}
        {readBy.length === 1 && (
          <Text style={[styles.readText, isUserMessage ? styles.userReadText : styles.otherReadText]}>
            {`Read by ${readBy[0].name} (${readBy.map((read) => read.name).join(', ')})`}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userReceipts: {
    justifyContent: 'flex-end',
  },
  otherReceipts: {
    justifyContent: 'flex-start',
  },
  readContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  readUsers: {
    fontSize: 12,
    color: '#777',
  },
  readText: {
    fontSize: 12,
  },
  userReadText: {
    color: 'white',
  },
  otherReadText: {
    color: '#333',
  },
});

export default ReadReceipts;