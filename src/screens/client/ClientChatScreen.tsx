import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, IMessage, Bubble, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { colors } from '../../theme';

const ADMIN_ID = 'admin-001';

export default function ClientChatScreen() {
  const { user } = useAuth();
  const { getConversation, sendMessage } = useData();
  const [isLoading, setIsLoading] = useState(false);

  const conversation = getConversation(user?.id || '', ADMIN_ID);
  const giftedMessages: IMessage[] = conversation.map(m => ({
    _id: m._id,
    text: m.text,
    createdAt: new Date(m.createdAt),
    user: m.user,
  }));

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!user || !newMessages.length) return;
    setIsLoading(true);
    await sendMessage(ADMIN_ID, newMessages[0].text, { _id: user.id, name: user.name });
    setIsLoading(false);
  }, [user, sendMessage]);

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: colors.chatBubbleSent },
        left: { backgroundColor: colors.chatBubbleReceived },
      }}
      textStyle={{
        right: { color: colors.textLight },
        left: { color: colors.text },
      }}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props} containerStyle={styles.sendContainer}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={22} color={colors.primary} />
      </View>
    </Send>
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={giftedMessages}
        onSend={onSend}
        user={{ _id: user?.id || '', name: user?.name || '' }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        placeholder="Escribe un mensaje..."
        alwaysShowSend
        isTyping={isLoading}
        locale="es"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  sendContainer: { justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 5 },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondaryLight + '30', alignItems: 'center', justifyContent: 'center' },
});
