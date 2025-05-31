import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Check, Trash2, X, BellRing, MoreVertical } from "lucide-react";
import { Notification } from "@/types/notification-types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  useAuth, 
  useMarkNotificationAsRead, 
  useClearAllNotifications,
  useDeleteNotification,
  useMarkAllNotificationsAsRead
} from '@/apis/apiCalls'

interface NotificationsMenuProps {
  notifications: Notification[];
  onClose: () => void;
}

export default function NotificationsMenu({
  notifications,
  onClose,
}: NotificationsMenuProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const markAsReadMutation = useMarkNotificationAsRead();
  const clearAllMutation = useClearAllNotifications();
  const deleteNotificationMutation = useDeleteNotification();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  // Helper function to safely format timestamp
  const formatTimestamp = (timestamp: any) => {
    try {
      // Handle regular timestamp number
      if (timestamp && typeof timestamp === "number") {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
      }

      // Handle string timestamp
      if (timestamp && typeof timestamp === "string") {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
      }

      // Default case, return a placeholder
      return "recently";
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "recently";
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await markAsReadMutation.mutateAsync({ notification_id: notification.id });
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (notification: Notification) => {
    try {
      await deleteNotificationMutation.mutateAsync({ notification_id: notification.id });
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllMutation.mutateAsync();
      toast({
        title: "Success",
        description: "All notifications cleared",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear notifications",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification);
    }

    // if (notification.link) {
    //   router.push(notification.link);
    //   onClose();
    // }
  };

  return (
    <div className="flex max-h-[80vh] flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                title="Mark all as read"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                title="Clear all"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} title="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
            <BellRing className="mb-4 h-10 w-10 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-sm">
              We&apos;ll notify you when something arrives
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-accent/50 ${notification.is_read ? "opacity-75" : "bg-accent/20"} `}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="relative h-10 w-10 flex-shrink-0">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-100">
                    <BellRing className="h-5 w-5 text-primary" />
                  </div>
                  {!notification.is_read && (
                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="truncate text-sm font-medium leading-5">
                      {notification.title}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {notification.message}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatTimestamp(notification.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
