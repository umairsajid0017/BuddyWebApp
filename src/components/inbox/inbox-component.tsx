import { InboxItem } from "@/lib/types";
import React, { useState } from "react";
import InboxDropdown from "../ui/inbox-dropdown";

const InboxComponent: React.FC = ()=> {
    const [message, setMessage] = useState<InboxItem[] | null>([
        {
          id: "1",
          title: "Hello",
          // description: "string",
          date: new Date().toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          read: false,
          senderAvatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Kimberly",
          senderName: "Kimberly"
        },
        {
          id: "2",
          title: "Hello",
          // description: "string",
          date:  new Date().toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          read: false,
          senderAvatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Mackenzie",
          senderName: "Mackenzie"
        },
        {
          id: "3",
          title: "Yoooooooo",
          // description: "string",
          date:  new Date().toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          read: false,
          senderAvatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Liam",
          senderName: "Liam"
        },
      ])
    
      
      const handleDelete = (id: string)=> {
        setMessage(prevMessages => prevMessages?.filter(msg => msg.id !== id) || null);
      }


      return <>
         <InboxDropdown
              items={
                message!
              }
              onDelete={(id)=> handleDelete(id) }
              onMarkAsRead={() => {}}
            />
            </>

}


export default InboxComponent