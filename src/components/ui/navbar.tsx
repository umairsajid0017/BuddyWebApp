'use client'
import Image from "next/image";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MailsIcon, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";

const NavBar: React.FC = () => {
    const {user} = useAuth();
    useEffect(() => {   
        console.log("User:", user);
    }, [user]);
    const router = useRouter()
    return (
        <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={"/assets/logo.png"} alt="logo" width={48} height={48} />
            <h1 className="text-2xl font-bold">Buddies<span className="text-primary">App</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <Input type="search" placeholder="Search here" className="w-64" />
            <Button variant="ghost" size="icon">
              <SettingsIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MailsIcon className="w-5 h-5" />
            </Button>
            <div className="flex items-center">
              {
                user ? 
                (


                  <>

              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>LC</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs">User</p>
              </div>
              </>)
              : 
              <Button onClick={()=> router.push('/login')} >
                Login
              </Button>
              }
            </div>
          </div>
        </div>
      </header>
    )
}

export default NavBar;