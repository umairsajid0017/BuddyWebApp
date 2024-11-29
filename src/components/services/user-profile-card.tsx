import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bookmark, Network, Users2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { type User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface UserProfileCardProps {
  user: User;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card className="w-full max-w-sm">
      {user && (
        <>
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={process.env.NEXT_PUBLIC_IMAGE_URL! + user.image}
                alt={user.name ?? ""}
              />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
            <Badge className="text-sm text-text-700 bg-secondary-100 hover:bg-secondary-100">
              {user.role ?? "Professional Service Provider"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                {user.address && `Located in ${user.address}`}
                {user.country && ` • ${user.country}`}
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Users2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xl font-semibold">296</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Connections
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Network className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xl font-semibold">32</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Profile views
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

              <Separator />

              <div className="flex items-center gap-2 text-sm">
                <Bookmark className="h-4 w-4" />
                <span>Saved items</span>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
