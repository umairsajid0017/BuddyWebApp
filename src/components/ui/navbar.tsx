"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import TooltipWrapper from "./tooltip-wrapper";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchComponent } from "../services/search-services/search-component";
import { CreateBookingDialog } from "../bookings/create-booking-dialogue";
import {
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  LogIn,
  Wallet,
  Bookmark,
} from "lucide-react";

import NotificationsBell from "../notification/notifcation-bell";
import { LoginType } from "@/constants/constantValues";
import { getImageUrl } from "@/helpers/utils";
import { useAuth } from "@/store/authStore";
import { Endpoints } from "@/apis/endpoints";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function NavBar() {
  const { user, logoutUser } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Check if the current user is a guest
  const isGuestUser = user?.login_type === LoginType.GUEST;

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
      setIsProfileOpen(false);
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsProfileOpen(false);
  };

  return (
    <header className="flex justify-center bg-gradient-to-b from-[#371b46] to-[#673086] shadow backdrop-blur-lg bg-opacity-20">
      <div className="container flex items-center justify-between px-6 py-2 md:mx-auto">
        {!isSearchVisible && (
          <Link href={"/"} className="flex items-center gap-2">
            <Image src={"/assets/logo.png"} alt="logo" width={88} height={88} />
            <span className="text-3xl font-bold text-white">Buddy</span>
          </Link>
        )}
        <div
          ref={searchContainerRef}
          className={`flex items-center space-x-4 ${isSearchVisible ? "w-full" : ""}`}
        >
          {isSearchVisible ? (
            <div className="flex w-full items-center">
              {/* <SearchComponent onClose={() => setIsSearchVisible(false)} /> */}
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
                  {/* <SearchIcon className="h-5 w-5" /> */}
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
                  onClick={() => router.push("/help-center")}
                  className="font-semibold text-white hover:bg-secondary-800 hover:text-white"
                >
                  Help Center
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push(Endpoints.PRIVACY_POLICY)}
                  className="font-semibold text-white hover:bg-secondary-800 hover:text-white"
                >
                  Privacy Policy
                </Button>

                <CreateBookingDialog isGuest={isGuestUser} />
                <TooltipWrapper content="Notifications">
                  <NotificationsBell />
                </TooltipWrapper>
              </div>
            </>
          )}

          {!isSearchVisible && (
            <div className="flex items-center">
              {user ? (
                <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-full hover:bg-secondary-800"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={getImageUrl(user.image)}
                          alt={user.name || "User"}
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-56 bg-white text-gray-800"
                  >
                    <div className="border-b border-gray-200 px-4 py-3">
                      {user.login_type === LoginType.GUEST ? (
                        <p className="font-medium">Guest User</p>
                      ) : (
                        <>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </>
                      )}
                    </div>

                    <div className="py-2">
                      {!isGuestUser && (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                            onClick={() => navigateTo("/profile")}
                          >
                            <UserCircle className="h-4 w-4" />
                            My Account
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                            onClick={() => navigateTo("/wallet")}
                          >
                            <Wallet className="h-4 w-4" />
                            Wallet
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                            onClick={() => navigateTo("/bookmarks")}
                          >
                            <Bookmark className="h-4 w-4" />
                            Bookmarks
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                            onClick={() => navigateTo("/settings")}
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Button>

                          <div className="my-1 h-px bg-gray-200" />
                        </>
                      )}

                      {user.login_type !== LoginType.GUEST ? (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 focus:text-red-500"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          className="w-full justify-start gap-2 px-4 py-2 text-text-200"
                          onClick={() => navigateTo("/login")}
                        >
                          <LogIn className="h-4 w-4" />
                          Log in
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
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

      <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} direction="bottom">
        <DrawerTrigger asChild>
        
        </DrawerTrigger>
        <DrawerContent className="h-[80%] w-full  bg-gradient-to-b from-[#1D0D25] to-[#673086] p-0 text-white md:hidden">
          <DrawerHeader className="p-4 flex justify-center">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-bold">Menu</DrawerTitle>
              {/* <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-secondary-800">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose> */}
            </div>
          </DrawerHeader>
          <div className="flex flex-col items-center space-y-4 p-4">
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/bookings");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-lg text-white hover:bg-secondary-800"
            >
              Bookings
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/bids");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-lg text-white hover:bg-secondary-800"
            >
              My Bids
            </Button>
            {/* Duplicate My Bookings removed, assuming one is enough */}
            {!isGuestUser && (
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/profile");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-lg text-white hover:bg-secondary-800"
              >
                My Account
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/help-center");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-lg text-white hover:bg-secondary-800"
            >
              Help Center
            </Button>
             <Button
                variant="ghost"
                onClick={() => {
                  router.push(Endpoints.PRIVACY_POLICY);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-lg text-white hover:bg-secondary-800"
              >
                Privacy Policy
              </Button>
            <div className="mt-6">
             <CreateBookingDialog isGuest={isGuestUser} />
            </div>
          </div>
          {/* <DrawerFooter className="p-4">
            <Button variant="outline" onClick={() => setIsMobileMenuOpen(false)}>Close</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </header>
  );
}
