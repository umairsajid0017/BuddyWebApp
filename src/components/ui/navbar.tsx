"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/authStore";
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
import { CreateBookingDialog } from "../bookings/create-booking-dialogue";
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  BookMarked,
  LifeBuoy,
  Settings,
  LogOut,
  Menu,
  SearchIcon,
  User,
  X,
} from "lucide-react";

export default function NavBar() {
  const { user, logoutUser } = useAuth();
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <header className="flex justify-center bg-white shadow">
      <div className="container flex items-center justify-between px-6 py-4 md:mx-auto">
        {!isSearchVisible && (
          <Link href={"/"} className="flex items-center gap-2">
            <Image src={"/assets/logo.png"} alt="logo" width={72} height={72} />
            <span className="text-3xl font-bold text-text-900">Buddy</span>
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
              <TooltipWrapper content="Search for services">
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
              <div className="hidden font-bold md:flex md:items-center md:space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/bookings")}
                  className="font-semibold"
                >
                  Bookings
                </Button>
                <Button
                  variant="ghost"
                  className="font-semibold"
                  onClick={() => router.push("/bookings/offers")}
                >
                  Offers
                </Button>
                <CreateBookingDialog />
              </div>
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
                    <Button variant="ghost" size="icon" className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src="https://api.dicebear.com/9.x/dylan/svg?seed=Destiny"
                          alt="User"
                        />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="border-b px-2 py-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                      className="gap-2 py-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      My Account
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/bookmarks")}
                      className="gap-2 py-2"
                    >
                      <BookMarked className="h-4 w-4" />
                      Saved
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/helpdesk")}
                      className="gap-2 py-2"
                    >
                      <LifeBuoy className="h-4 w-4" />
                      Helpdesk
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/settings")}
                      className="gap-2 py-2"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </DropdownMenuItem>

                    <div className="my-1 h-px bg-muted" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-2 py-2 text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => router.push("/login")}>Login</Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="mt-16 flex flex-col space-y-4">
            <Button variant="ghost" onClick={() => router.push("/bookings")}>
              Bookings
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/bookings/offers")}
            >
              Offers
            </Button>
            <CreateBookingDialog />
          </div>
        </div>
      )}
    </header>
  );
}
