"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, MailsIcon, Trash, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "../ui/tooltip-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { InboxItem } from "@/lib/types";

interface InboxDropdownProps {
  items: InboxItem[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function InboxDropdown({
  items = [],
  onMarkAsRead,
  onDelete,
}: InboxDropdownProps) {
  const router = useRouter();
  const unreadCount = items.filter((item) => !item.read).length;
  const [open, setOpen] = React.useState(false);

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsRead(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
  };

  const handleInboxClick = () => {
    router.push("/inbox");
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <TooltipWrapper content="Inbox">
        <DropdownMenuTrigger asChild>
          <Button className="relative" variant="ghost" size="icon">
            <MailsIcon className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
      </TooltipWrapper>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Inbox</p>
            <p className="text-xs leading-none text-muted-foreground">
              You have {unreadCount} unread messages
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-96 overflow-auto">
          {items.length === 0 ? (
            <DropdownMenuItem disabled>No messages</DropdownMenuItem>
          ) : (
            items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="flex flex-col items-start p-4"
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex w-full items-center">
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage
                      src={item.senderAvatar}
                      alt={item.senderName}
                    />
                    <AvatarFallback>
                      {item.senderName.slice(0, 2).toUpperCase() ?? "BD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex w-full justify-between">
                      <p className="text-sm font-medium leading-none">
                        {item.senderName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                    <p className="mt-1 text-xs font-medium">{item.title}</p>
                  </div>
                </div>
                <p className="mt-1 line-clamp-2 w-full pl-10 text-xs leading-none text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-2 flex w-full justify-end space-x-2">
                  {!item.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={(e) => handleMarkAsRead(e, item.id)}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Mark as read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={(e) => handleDelete(e, item.id)}
                  >
                    <Trash className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={handleInboxClick}
        >
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleInboxClick}
          >
            <Inbox className="mr-2 h-4 w-4" />
            View All Messages
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
