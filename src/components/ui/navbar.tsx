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
  Bell,
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
    <header className="flex justify-center bg-gradient-to-b from-[#1D0D25] to-[#673086] shadow">
      <div className="container flex items-center justify-between px-6 py-2 md:mx-auto">
        {!isSearchVisible && (
          <Link href={"/"} className="flex items-center gap-2">
            <Image src={"/assets/logo.png"} alt="logo" width={72} height={72} />
            <span className="text-3xl font-bold text-white">Buddy</span>
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
                className="ml-2 text-white hover:bg-secondary-800 md:hidden"
                onClick={() => setIsSearchVisible(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden w-80 md:block">
                {/* <SearchComponent /> */}
              </div>
              <TooltipWrapper content="Search for services">
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center justify-center text-white hover:bg-secondary-800 hover:text-white md:hidden"
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
                  onClick={() => router.push("/bids")}
                  className="font-semibold text-white hover:bg-secondary-800 hover:text-white"
                >
                  My Bids
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => router.push("/bookings")}
                  className="font-semibold text-white hover:bg-secondary-800 hover:text-white"
                >
                  My Bookings
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => router.push("/bookings")}
                  className="font-semibold text-white hover:bg-secondary-800 hover:text-white"
                >
                  Help Center
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/bookings")}
                  className="font-semibold text-white hover:bg-secondary-800 hover:text-white"
                >
                  Privacy Policy
                </Button>
                <CreateBookingDialog />
                <TooltipWrapper content="Notifications">
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Bell className="h-5 w-5 text-white" />
                  </Button>
                </TooltipWrapper>
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
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-secondary-800"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={
                            user.image
                              ? process.env.NEXT_PUBLIC_IMAGE_URL + user.image
                              : undefined
                          }
                          alt={user.name || "User"}
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-secondary-900 bg-green-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-secondary-900 text-white"
                  >
                    <div className="border-b border-secondary-700 px-2 py-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-secondary-300">{user.email}</p>
                    </div>

                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                      className="gap-2 py-2 text-white hover:bg-secondary-800"
                    >
                      <UserCircle className="h-4 w-4" />
                      My Account
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/settings")}
                      className="gap-2 py-2 text-white hover:bg-secondary-800"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </DropdownMenuItem>

                    <div className="my-1 h-px bg-secondary-700" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-2 py-2 text-red-400 hover:bg-secondary-800 focus:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="text-white hover:bg-secondary-800"
                >
                  Login
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 text-white hover:bg-secondary-800 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-r from-secondary-900 to-secondary-700 p-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white hover:bg-secondary-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="mt-16 flex flex-col space-y-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/bookings")}
              className="text-white hover:bg-secondary-800"
            >
              Bookings
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/bookings/offers")}
              className="text-white hover:bg-secondary-800"
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
