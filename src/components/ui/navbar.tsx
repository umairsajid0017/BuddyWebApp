"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar, LogOut, MailsIcon, SearchIcon, SettingsIcon, ShoppingCart, Tag, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";
import TooltipWrapper from "./tooltip-wrapper";
import InboxDropdown from "../inbox/inbox-dropdown";
import { InboxItem } from "@/lib/types";
import InboxComponent from "../inbox/inbox-component";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

const NavBar: React.FC = () => {

  const { user } = useAuth();

  const [isOpenBookings, setIsOpenBookings] = useState(false)
  const [isOpenAccount, setIsOpenAccount] = useState(false)


  useEffect(() => {
    console.log("User:", user);
  }, [user]);
  const router = useRouter();
  return (
    <header className="flex justify-center bg-white shadow">
      <div className="container flex items-center justify-between px-6 py-4 md:mx-auto">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={"/assets/logo.jpg"} alt="logo" width={48} height={48} />

        </Link>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search here"
            className="hidden w-64 md:block"
          />
          <TooltipWrapper content={"Search for services"}>
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center justify-center md:hidden"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          </TooltipWrapper>

          {user &&
            <>
              <TooltipWrapper key={"Bookings"} content={"My Bookings"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => router.push('/bookings')}
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper key={"offers"} content={"Offers"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => router.push('/bookings/offers')}
                >
                  <Tag className="h-5 w-5" />
                </Button>
              </TooltipWrapper>
              {user && <InboxComponent />}
              <TooltipWrapper key={"account-settings"} content="Account Settings">
                <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
                  <SettingsIcon className="h-5 w-5" />
                </Button>
              </TooltipWrapper>

            </>
          }

          <div className="flex items-center">
            {user ? (
              <>
                <DropdownMenu open={isOpenAccount} onOpenChange={setIsOpenAccount}>

                  <DropdownMenuTrigger asChild>

                    <Button
                      className="flex items-center justify-start px-2"
                      size={"lg"}
                      variant={"ghost"}
                      onClick={() => router.push('/profile')}
                    >
                      <Avatar className="cursor-pointer">
                        <AvatarImage src="https://api.dicebear.com/9.x/dylan/svg?seed=Destiny" alt="User" />
                        <AvatarFallback>LC</AvatarFallback>
                      </Avatar>

                      <div className="ml-3 hidden flex-col items-start justify-start p-2 md:flex">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-[#619EFF] text-xs">
                          {user?.email}
                        </p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-48"
                  >
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>Bookmarks</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/bookings')}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => router.push("/login")}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
