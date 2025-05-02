import React, { useState } from 'react'
import Image from 'next/image'
import { InboxItem } from "@/types/chat-types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageIcon, Mic, PaperclipIcon, SendIcon, ArrowLeft, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: 'text' | 'image'
}

interface Conversation extends InboxItem {
  messages: Message[]
}

const initialConversations: Conversation[] = [
  {
    id: "1",
    title: "I have booked your house...",
    date: "Yesterday",
    read: false,
    senderAvatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Lauralee",
    senderName: "Lauralee Quintero",
    messages: [
      { id: "m1", senderId: "1", content: "Hi Jenny, good morning 😊", timestamp: "10:00", type: 'text' },
      { id: "m2", senderId: "user", content: "Hi, morning too Andrew!", timestamp: "10:00", type: 'text' },
      { id: "m3", senderId: "1", content: "Yes, I have received your order. I will come on that date! 😊😊", timestamp: "10:00", type: 'text' },
    ]
  },
  {
    id: "2",
    title: "I have booked your house...",
    date: "13:29",
    read: false,
    senderAvatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Tanner",
    senderName: "Tanner Stafford",
    messages: []
  },
]

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[0] ?? null)
  const [message, setMessage] = useState("")
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false)

  const handleSendMessage = () => {
    if (message.trim() && activeConversation) {
      const newMessage: Message = {
        id: `m${Date.now()}`,
        senderId: "user",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      }
      const updatedConversation = {
        ...activeConversation,
        messages: [...activeConversation.messages, newMessage]
      }
      setActiveConversation(updatedConversation)
      setConversations(conversations.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      ))
      setMessage("")
    }
  }

  const handleConversationClick = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setIsMobileChatOpen(true)
    if (!conversation.read) {
      const updatedConversation = { ...conversation, read: true }
      setConversations(conversations.map(conv => 
        conv.id === conversation.id ? updatedConversation : conv
      ))
    }
  }

  const handleBackToList = () => {
    setIsMobileChatOpen(false)
  }

  const handleDeleteMessage = (messageId: string) => {
    if (activeConversation) {
      const updatedMessages = activeConversation.messages.filter(msg => msg.id !== messageId)
      const updatedConversation = { ...activeConversation, messages: updatedMessages }
      setActiveConversation(updatedConversation)
      setConversations(conversations.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      ))
    }
  }

  const handleDeleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId)
    setConversations(updatedConversations)
    if (activeConversation?.id === conversationId) {
      setActiveConversation(updatedConversations[0] ?? null)
      setIsMobileChatOpen(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-128px)] overflow-hidden">
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r flex flex-col ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Inbox</h1>
        </div>
        <ScrollArea className="flex-grow">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${activeConversation?.id === conversation.id ? 'bg-gray-100' : ''}`}
              onClick={() => handleConversationClick(conversation)}
            >
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={conversation.senderAvatar} alt={conversation.senderName} />
                <AvatarFallback>{conversation.senderName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold truncate">{conversation.senderName}</h3>
                  <span className="text-sm text-gray-500 ml-2 flex-shrink-0">{conversation.date}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conversation.title}</p>
              </div>
              {!conversation.read && (
                <div className="w-3 h-3 bg-red-500 rounded-full ml-2 flex-shrink-0"></div>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2" onClick={(e) => e.stopPropagation()}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the conversation.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteConversation(conversation.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </ScrollArea>
      </div>
      {activeConversation && (
        <div className={`flex-1 flex flex-col ${isMobileChatOpen ? 'flex' : 'hidden md:flex'}`}>
          <div className="p-4 border-b flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={handleBackToList}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={activeConversation.senderAvatar} alt={activeConversation.senderName} />
              <AvatarFallback>{activeConversation.senderName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{activeConversation.senderName}</h2>
          </div>
          <ScrollArea className="flex-grow p-4">
            {activeConversation.messages.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.senderId === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'} relative group`}>
                  {msg.type === 'text' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <Image src={msg.content} alt="Shared image" className="max-w-full rounded" width={300} height={200} />
                  )}
                  <span className="text-xs mt-1 block">{msg.timestamp}</span>
                  {msg.senderId === 'user' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteMessage(msg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="p-4 border-t flex items-center">
            <Button variant="ghost" size="icon">
              <PaperclipIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage()
                }
              }}
              className="flex-1 mx-2"
            />
            <Button variant="ghost" size="icon">
              <Mic className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSendMessage}>
              <SendIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}