import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  serverTimestamp,
  getDocs,
  Timestamp,
} from "firebase/firestore";

export interface ChatMessage {
  id?: string;
  text: string;
  sender: string;
  receiver: string;
  type: string;
  timestamp?: Date;
  chatRoomId: string;
}

export const chatService = {
  // Send a message
  async sendMessage(message: Omit<ChatMessage, "id" | "timestamp">) {
    try {
      await addDoc(collection(db, "messages"), {
        ...message,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Get chat room ID (creates one if it doesn't exist)
  async getChatRoomId(userId1: string, userId2: string) {
    const chatRoomsRef = collection(db, "chatRooms");
    const q = query(
      chatRoomsRef,
      where("participants", "array-contains", userId1),
    );

    const querySnapshot = await getDocs(q);
    let chatRoomId = null;

    querySnapshot.forEach((doc) => {
      const room = doc.data();
      if (room.participants.includes(userId2)) {
        chatRoomId = doc.id;
      }
    });

    if (!chatRoomId) {
      const newRoomRef = await addDoc(chatRoomsRef, {
        participants: [userId1, userId2],
        createdAt: serverTimestamp(),
      });
      chatRoomId = newRoomRef.id;
    }

    return chatRoomId;
  },

  // Subscribe to messages
  subscribeToMessages(
    chatRoomId: string,
    callback: (messages: ChatMessage[]) => void,
  ) {
    console.log("Subscribing to chatRoom:", chatRoomId);
    const q = query(
      collection(db, "messages"),
      where("chatRoomId", "==", chatRoomId),
      orderBy("timestamp", "asc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp:
            data.timestamp instanceof Timestamp
              ? data.timestamp.toDate()
              : data.timestamp,
        } as ChatMessage);
      });
      callback(messages);
    });
  },
};
