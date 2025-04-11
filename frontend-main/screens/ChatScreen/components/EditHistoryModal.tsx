// screens/ChatScreen/components/EditHistoryModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatTime } from '../../../utils/helpers';

interface EditHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  history: Array<{
    content: string;
    edited_at: string;
    edited_by: {
      id: string;
      name: string;
    };
  }>;
  currentContent: string;
}

const EditHistoryModal: React.FC<EditHistoryModalProps> = ({
  visible,
  onClose,
  history,
  currentContent,
}) => {
  if (!history || !Array.isArray(history) || history.length === 0) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit History</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.emptyHistory}>No edit history found.</Text>
          </View>
        </View>
      </Modal>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyContent}>{item.content}</Text>
      <View style={styles.historyFooter}>
        <Text style={styles.editedBy}>
          {item.edited_by && item.edited_by.name ? item.edited_by.name : 'Unknown'}
        </Text>
        <Text style={styles.editedAt}>{formatTime(item.edited_at)}</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>Edit History</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="close" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent]}>
          {renderHeader()}
          <View style={styles.currentVersion}>
            <Text style={styles.currentContent}>{currentContent}</Text>
          </View>

          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.historyList}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    minHeight: '40%',
    padding: 16,
  },
  modalHeader: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  currentVersion: {
    padding: 12,
    backgroundColor: '#e0f2f7',
    borderRadius: 8,
    marginBottom: 16,
  },
  currentContent: {
    fontSize: 16,
    color: '#333',
  },
  emptyHistory: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  historyList: {
    paddingBottom: 16,
  },
  historyItem: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  historyContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontStyle: 'italic',
    borderLeftWidth: 3,
    paddingLeft: 8,
    borderColor: '#90caf9',
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editedBy: {
    fontSize: 12,
    color: '#3f51b5',
    fontWeight: 'bold',
  },
  editedAt: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginLeft: 10,
  },
});

export default EditHistoryModal;