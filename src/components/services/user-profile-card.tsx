import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Phone, Mail, Star, Calendar } from "lucide-react";
import { type User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

interface UserProfileCardProps {
  user: User;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={
              user.image
                ? process.env.NEXT_PUBLIC_IMAGE_URL + user.image
                : undefined
            }
            alt={user.name ?? ""}
          />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
        <Badge variant="secondary" className="mt-1">
          {user.role === "worker" ? "Service Provider" : user.role}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{user.address || "Location not specified"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Member since {new Date(user.created_at).getFullYear()}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">About</h3>
            <div className="text-sm text-muted-foreground">
              {user.role && (
                <div className="mb-2">Professional {user.role}</div>
              )}
              <div>{user.email && `✉️ ${user.email}`}</div>
              {user.phone && <div>📱 {user.phone}</div>}
            </div>
          </div>

          <Button className="w-full" variant="outline">
            Contact Service Provider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
