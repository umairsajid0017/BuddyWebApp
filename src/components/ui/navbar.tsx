"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, SearchIcon, User, X } from "lucide-react";
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
import { NewBookingDialog } from "../bookings/create-booking";

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
            <Image src="/assets/logo.png" alt="logo" width={64} height={64} />
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
                <NewBookingDialog />
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
                    <Button
                      className="flex items-center justify-start px-2"
                      size="lg"
                      variant="ghost"
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
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Settings</span>
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
            <NewBookingDialog />
          </div>
        </div>
      )}
    </header>
  );
}
