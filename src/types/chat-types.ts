export interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ChatRoom {
  id: number;
  user_id: number;
  worker_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  last_message?: ChatMessage;
  unread_count?: number;
}

export interface ChatResponse {
  error: boolean;
  message: string;
  records: ChatMessage[];
}

export interface ChatRoomResponse {
  error: boolean;
  message: string;
  records: ChatRoom[];
}

export interface SendMessageData {
  receiver_id: number;
  message: string;
}

export interface SendMessageResponse {
  error: boolean;
  message: string;
  records: ChatMessage;
}

export interface MarkAsReadData {
  chat_room_id: number;
}

export interface MarkAsReadResponse {
  error: boolean;
  message: string;
} 

export interface InboxItem {
    id: string;
    senderName: string;
    senderAvatar: string;
    title: string;
    description?: string;
    date: string;
    read: boolean;
  }

  export interface ChatMessageFirebase {
    id?: string;
    text: string;
    sender: string;
    receiver: string;
    type: string;
    timestamp?: Date;
    chatRoomId: string;
    replyTo?: {
      id: string;
      text: string;
      sender: string;
    } | null;
  }

  export interface InboxDropdownProps {
    items: InboxItem[];
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
  }