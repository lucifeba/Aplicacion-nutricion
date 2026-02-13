import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Message, TrainingModificationRequest, WeeklyFeedback, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  // Messages
  messages: Record<string, Message[]>; // keyed by recipientId or 'broadcast'
  sendMessage: (recipientId: string, text: string, sender: { id: string; name: string }) => void;
  sendBroadcast: (text: string, sender: { id: string; name: string }) => void;
  getConversation: (userId1: string, userId2: string) => Message[];

  // Training requests
  trainingRequests: TrainingModificationRequest[];
  submitTrainingRequest: (request: Omit<TrainingModificationRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateRequestStatus: (id: string, status: TrainingModificationRequest['status']) => void;

  // Feedback
  feedbacks: WeeklyFeedback[];
  submitFeedback: (feedback: Omit<WeeklyFeedback, 'id' | 'createdAt'>) => void;
  getClientFeedbacks: (clientId: string) => WeeklyFeedback[];

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [trainingRequests, setTrainingRequests] = useState<TrainingModificationRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<WeeklyFeedback[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [storedMessages, storedRequests, storedFeedbacks, storedNotifications] = await Promise.all([
        SecureStore.getItemAsync('messages'),
        SecureStore.getItemAsync('trainingRequests'),
        SecureStore.getItemAsync('feedbacks'),
        SecureStore.getItemAsync('notifications'),
      ]);
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedRequests) setTrainingRequests(JSON.parse(storedRequests));
      if (storedFeedbacks) setFeedbacks(JSON.parse(storedFeedbacks));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  }

  async function persistMessages(msgs: Record<string, Message[]>) {
    setMessages(msgs);
    await SecureStore.setItemAsync('messages', JSON.stringify(msgs));
  }

  function getConversationKey(id1: string, id2: string): string {
    return [id1, id2].sort().join('_');
  }

  function sendMessage(recipientId: string, text: string, sender: { id: string; name: string }) {
    const key = getConversationKey(sender.id, recipientId);
    const msg: Message = {
      _id: uuidv4(),
      text,
      createdAt: new Date(),
      user: { _id: sender.id, name: sender.name },
    };
    const updated = { ...messages, [key]: [...(messages[key] || []), msg] };
    persistMessages(updated);

    addNotification({
      type: 'message',
      title: 'Nuevo mensaje',
      body: `${sender.name}: ${text.substring(0, 50)}...`,
      data: { senderId: sender.id, recipientId },
    });
  }

  function sendBroadcast(text: string, sender: { id: string; name: string }) {
    const msg: Message = {
      _id: uuidv4(),
      text,
      createdAt: new Date(),
      user: { _id: sender.id, name: sender.name },
      isBroadcast: true,
    };
    const updated = { ...messages, broadcast: [...(messages['broadcast'] || []), msg] };
    persistMessages(updated);

    addNotification({
      type: 'broadcast',
      title: 'Mensaje de difusión',
      body: text.substring(0, 80),
    });
  }

  function getConversation(userId1: string, userId2: string): Message[] {
    const key = getConversationKey(userId1, userId2);
    return messages[key] || [];
  }

  function submitTrainingRequest(request: Omit<TrainingModificationRequest, 'id' | 'status' | 'createdAt'>) {
    const newRequest: TrainingModificationRequest = {
      ...request,
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [...trainingRequests, newRequest];
    setTrainingRequests(updated);
    SecureStore.setItemAsync('trainingRequests', JSON.stringify(updated));

    addNotification({
      type: 'training_request',
      title: 'Nueva solicitud de modificación',
      body: `${request.clientName} ha solicitado un cambio en su entrenamiento`,
      data: { clientId: request.clientId },
    });
  }

  function updateRequestStatus(id: string, status: TrainingModificationRequest['status']) {
    const updated = trainingRequests.map(r => r.id === id ? { ...r, status } : r);
    setTrainingRequests(updated);
    SecureStore.setItemAsync('trainingRequests', JSON.stringify(updated));
  }

  function submitFeedback(feedback: Omit<WeeklyFeedback, 'id' | 'createdAt'>) {
    const newFeedback: WeeklyFeedback = {
      ...feedback,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...feedbacks, newFeedback];
    setFeedbacks(updated);
    SecureStore.setItemAsync('feedbacks', JSON.stringify(updated));

    addNotification({
      type: 'feedback',
      title: 'Nuevo feedback semanal',
      body: `${feedback.clientName} ha enviado su feedback semanal`,
      data: { clientId: feedback.clientId },
    });
  }

  function getClientFeedbacks(clientId: string): WeeklyFeedback[] {
    return feedbacks.filter(f => f.clientId === clientId);
  }

  function addNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    SecureStore.setItemAsync('notifications', JSON.stringify(updated));
  }

  function markNotificationRead(id: string) {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    SecureStore.setItemAsync('notifications', JSON.stringify(updated));
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DataContext.Provider value={{
      messages, sendMessage, sendBroadcast, getConversation,
      trainingRequests, submitTrainingRequest, updateRequestStatus,
      feedbacks, submitFeedback, getClientFeedbacks,
      notifications, addNotification, markNotificationRead, unreadCount,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
