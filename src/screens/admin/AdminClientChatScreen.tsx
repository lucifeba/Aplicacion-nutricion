import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GiftedChat, IMessage, Bubble, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { colors, spacing, fontSize, fontWeight } from '../../theme';

export default function AdminClientChatScreen({ route }: any) {
  const { client } = route.params;
  const { user } = useAuth();
  const { getConversation, sendMessage } = useData();
  const [isLoading, setIsLoading] = useState(false);

  const conversation = getConversation(user?.id || '', client.id);
  const giftedMessages: IMessage[] = conversation.map(m => ({
    _id: m._id,
    text: m.text,
    createdAt: new Date(m.createdAt),
    user: m.user,
  }));

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!user || !newMessages.length) return;
    setIsLoading(true);
    await sendMessage(client.id, newMessages[0].text, { _id: user.id, name: user.name });
    setIsLoading(false);
  }, [user, client.id, sendMessage]);

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
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{client.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.clientName}>{client.name}</Text>
      </View>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textLight },
  clientName: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text },
  sendContainer: { justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 5 },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondaryLight + '30', alignItems: 'center', justifyContent: 'center' },
});
