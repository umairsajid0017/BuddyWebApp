"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Calendar,
  LogOut,
  SearchIcon,
  SettingsIcon,
  Tag,
  User,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthStore, { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";
import TooltipWrapper from "./tooltip-wrapper";
import InboxComponent from "../inbox/inbox-component";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { SearchComponent } from "../services/search-services/search-component";

type NavBarProps = object;

const NavBar: React.FC<NavBarProps> = () => {
  const { user, logoutUser } = useAuth();
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleLogout = async () => {
    console.log("Logout");
    await logoutUser()
      .then(() => {
        console.log("Logged out successfully");
        router.push("/");
      })
      .catch((error) => {
        console.log("Error logging out", error);
      });
  };

  return (
    <header className="flex justify-center bg-white shadow">
      <div className="container flex items-center justify-between px-6 py-4 md:mx-auto">
        {!isSearchVisible && (
          <Link href={"/"} className="flex items-center gap-2">
            <Image src={"/assets/logo.jpg"} alt="logo" width={48} height={48} />
          </Link>
        )}
        <div
          ref={searchContainerRef}
          className={`flex items-center space-x-4 ${isSearchVisible ? "w-full" : ""}`}
        >
          {isSearchVisible ? (
            <div className="flex w-full items-center">
              <SearchComponent onClose={() => setIsSearchVisible(false)} />
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 md:hidden"
                onClick={() => setIsSearchVisible(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden w-80 md:block">
                <SearchComponent />
              </div>
              <TooltipWrapper content={"Search for services"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center justify-center md:hidden"
                  onClick={toggleSearch}
                >
                  <SearchIcon className="h-5 w-5" />
                </Button>
              </TooltipWrapper>
            </>
          )}

          {!isSearchVisible && user && (
            <>
              <TooltipWrapper key={"Bookings"} content={"My Bookings"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => router.push("/bookings")}
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper key={"offers"} content={"Offers"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => router.push("/bookings/offers")}
                >
                  <Tag className="h-5 w-5" />
                </Button>
              </TooltipWrapper>
              <InboxComponent />
              <TooltipWrapper
                key={"account-settings"}
                content="Account Settings"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/settings")}
                >
                  <SettingsIcon className="h-5 w-5" />
                </Button>
              </TooltipWrapper>
            </>
          )}

          {!isSearchVisible && (
            <div className="flex items-center">
              {user ? (
                <DropdownMenu
                  open={isOpenAccount}
                  onOpenChange={setIsOpenAccount}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="flex items-center justify-start px-2"
                      size={"lg"}
                      variant={"ghost"}
                      onClick={() => router.push("/profile")}
                    >
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src="https://api.dicebear.com/9.x/dylan/svg?seed=Destiny"
                          alt="User"
                        />
                        <AvatarFallback>LC</AvatarFallback>
                      </Avatar>
                      <div className="ml-3 hidden flex-col items-start justify-start p-2 md:flex">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-[#619EFF]">{user?.email}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>Bookmarks</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => router.push("/login")}>Login</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
