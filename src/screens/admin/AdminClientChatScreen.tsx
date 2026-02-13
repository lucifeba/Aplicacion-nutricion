import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GiftedChat, IMessage, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { colors, fontSize, spacing, borderRadius } from '../../theme';
import { RouteProp } from '@react-navigation/native';

type Props = {
  route: RouteProp<{ params: { clientId: string; clientName: string } }, 'params'>;
};

export function AdminClientChatScreen({ route }: Props) {
  const { clientId, clientName } = route.params;
  const { user } = useAuth();
  const { getConversation, sendMessage, messages: allMessages } = useData();
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (!user) return;
    const conv = getConversation(user.id, clientId);
    const formatted: IMessage[] = conv.map(m => ({
      _id: m._id,
      text: m.text,
      createdAt: new Date(m.createdAt),
      user: { _id: m.user._id, name: m.user.name },
    })).reverse();
    setChatMessages(formatted);
  }, [allMessages, user, clientId]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (!user) return;
    newMessages.forEach(msg => {
      sendMessage(clientId, msg.text, { id: user.id, name: user.name });
    });
  }, [user, clientId, sendMessage]);

  function renderBubble(props: any) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: colors.chatBubbleSent, borderRadius: borderRadius.lg },
          left: { backgroundColor: colors.chatBubbleReceived, borderRadius: borderRadius.lg },
        }}
        textStyle={{
          right: { color: colors.textLight },
          left: { color: colors.text },
        }}
      />
    );
  }

  function renderSend(props: any) {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <Ionicons name="send" size={24} color={colors.primary} />
      </Send>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{clientName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{clientName}</Text>
          <Text style={styles.headerSubtitle}>Chat individual</Text>
        </View>
      </View>
      <GiftedChat
        messages={chatMessages}
        onSend={onSend}
        user={{ _id: user?.id || '', name: user?.name }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        alwaysShowSend
        scrollToBottom
        {...{ placeholder: "Escribe un mensaje..." } as any}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  headerText: { marginLeft: spacing.md },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textLight },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.secondaryLight },
  sendContainer: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
});
