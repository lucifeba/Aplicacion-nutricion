import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Message, TrainingModificationRequest, WeeklyFeedback, AppNotification } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { sendLocalNotification } from '../services/notifications';

interface DataContextType {
  messages: Message[];
  trainingRequests: TrainingModificationRequest[];
  feedbacks: WeeklyFeedback[];
  notifications: AppNotification[];
  unreadCount: number;
  sendMessage: (recipientId: string, text: string, sender: { _id: string; name: string }) => Promise<void>;
  sendBroadcast: (text: string, sender: { _id: string; name: string }) => Promise<void>;
  getConversation: (userId1: string, userId2: string) => Message[];
  submitTrainingRequest: (request: Omit<TrainingModificationRequest, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateRequestStatus: (id: string, status: TrainingModificationRequest['status']) => Promise<void>;
  submitFeedback: (feedback: Omit<WeeklyFeedback, 'id' | 'createdAt'>) => Promise<void>;
  getClientFeedbacks: (clientId: string) => WeeklyFeedback[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') return localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
  return SecureStore.setItemAsync(key, value);
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [trainingRequests, setTrainingRequests] = useState<TrainingModificationRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<WeeklyFeedback[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [msgsJson, reqsJson, fbsJson, notifsJson] = await Promise.all([
        getItem('messages'),
        getItem('trainingRequests'),
        getItem('feedbacks'),
        getItem('notifications'),
      ]);
      if (msgsJson) setMessages(JSON.parse(msgsJson));
      if (reqsJson) setTrainingRequests(JSON.parse(reqsJson));
      if (fbsJson) setFeedbacks(JSON.parse(fbsJson));
      if (notifsJson) setNotifications(JSON.parse(notifsJson));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveMessages = async (msgs: Message[]) => {
    setMessages(msgs);
    await setItem('messages', JSON.stringify(msgs));
  };

  const saveRequests = async (reqs: TrainingModificationRequest[]) => {
    setTrainingRequests(reqs);
    await setItem('trainingRequests', JSON.stringify(reqs));
  };

  const saveFeedbacks = async (fbs: WeeklyFeedback[]) => {
    setFeedbacks(fbs);
    await setItem('feedbacks', JSON.stringify(fbs));
  };

  const saveNotifications = async (notifs: AppNotification[]) => {
    setNotifications(notifs);
    await setItem('notifications', JSON.stringify(notifs));
  };

  const addNotification = async (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notification,
      id: uuidv4(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNotif, ...notifications];
    await saveNotifications(updated);
    sendLocalNotification(notification.title, notification.body, notification.data);
  };

  const sendMessage = async (recipientId: string, text: string, sender: { _id: string; name: string }) => {
    const newMsg: Message = {
      _id: uuidv4(),
      text,
      createdAt: new Date(),
      user: sender,
    };
    const conversationKey = [sender._id, recipientId].sort().join('_');
    const taggedMsg = { ...newMsg, conversationKey };
    const updated = [taggedMsg, ...messages];
    await saveMessages(updated);
    await addNotification({
      type: 'message',
      title: 'Nuevo mensaje',
      body: `${sender.name}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      data: { senderId: sender._id, recipientId },
    });
  };

  const sendBroadcast = async (text: string, sender: { _id: string; name: string }) => {
    const newMsg: Message = {
      _id: uuidv4(),
      text,
      createdAt: new Date(),
      user: sender,
      isBroadcast: true,
    };
    const taggedMsg = { ...newMsg, conversationKey: 'broadcast' };
    const updated = [taggedMsg, ...messages];
    await saveMessages(updated);
    await addNotification({
      type: 'broadcast',
      title: 'Mensaje de difusión',
      body: text.substring(0, 80),
    });
  };

  const getConversation = (userId1: string, userId2: string): Message[] => {
    const key = [userId1, userId2].sort().join('_');
    const convMsgs = messages.filter((m: any) => m.conversationKey === key || m.conversationKey === 'broadcast');
    return convMsgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const submitTrainingRequest = async (request: Omit<TrainingModificationRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: TrainingModificationRequest = {
      ...request,
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newReq, ...trainingRequests];
    await saveRequests(updated);
    await addNotification({
      type: 'training_request',
      title: 'Nueva solicitud de modificación',
      body: `${request.clientName} ha solicitado una modificación de entrenamiento`,
      data: { clientId: request.clientId },
    });
  };

  const updateRequestStatus = async (id: string, status: TrainingModificationRequest['status']) => {
    const updated = trainingRequests.map(r => r.id === id ? { ...r, status } : r);
    await saveRequests(updated);
  };

  const submitFeedback = async (feedback: Omit<WeeklyFeedback, 'id' | 'createdAt'>) => {
    const newFb: WeeklyFeedback = {
      ...feedback,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newFb, ...feedbacks];
    await saveFeedbacks(updated);
    await addNotification({
      type: 'feedback',
      title: 'Nuevo feedback semanal',
      body: `${feedback.clientName} ha enviado su feedback de la semana ${feedback.weekNumber}`,
      data: { clientId: feedback.clientId },
    });
  };

  const getClientFeedbacks = (clientId: string) =>
    feedbacks.filter(f => f.clientId === clientId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const markNotificationRead = async (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    await saveNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DataContext.Provider value={{
      messages, trainingRequests, feedbacks, notifications, unreadCount,
      sendMessage, sendBroadcast, getConversation,
      submitTrainingRequest, updateRequestStatus,
      submitFeedback, getClientFeedbacks,
      addNotification, markNotificationRead, refreshData: loadData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
