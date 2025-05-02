import { db, auth } from './firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { Notification } from '../types/notification-types';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Notification[];
};

export const subscribeToUserNotifications = (
  userId: string, 
  callback: (notifications: Notification[]) => void
) => {
  if (!userId) return null;
  
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    
    callback(notifications);
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
  await updateDoc(notificationRef, {
    read: true
  });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const notifications = await getUserNotifications(userId);
  
  const updatePromises = notifications
    .filter(notification => !notification.read)
    .map(notification => 
      updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notification.id), { read: true })
    );
    
  await Promise.all(updatePromises);
};

export const deleteNotification = async (notificationId: string) => {
  const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
  await deleteDoc(notificationRef);
};

export const clearAllNotifications = async (userId: string) => {
  const notifications = await getUserNotifications(userId);
  
  const deletePromises = notifications.map(notification => 
    deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, notification.id))
  );
    
  await Promise.all(deletePromises);
};

export const saveNotificationToFirestore = async (userId: string, notification: Partial<Notification>) => {
  await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
    userId,
    title: notification.title || 'New Notification',
    body: notification.body || '',
    read: false,
    timestamp: serverTimestamp(),
    link: notification.link || null,
    imageUrl: notification.imageUrl || null
  });
};