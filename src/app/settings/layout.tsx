"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  UserIcon,
  LanguagesIcon,
  KeyIcon,
  LockIcon,
  BellIcon,
  ShieldIcon,
  HelpCircleIcon,
  ChevronRightIcon,
  Loader2Icon,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import kebabCase from "@/utils/helper-functions";
import Loading from "@/components/ui/loading";

const settingsItems = [
  { href: "/settings/profile", icon: UserIcon, label: "Edit Profile" },
  { href: "/settings/calendar", icon: CalendarIcon, label: "My Calendar" },
  { href: "/settings/language", icon: LanguagesIcon, label: "Language" },
  { href: "/settings/password", icon: KeyIcon, label: "Change Password" },
  { href: "/settings/verify", icon: LockIcon, label: "Verify Account" },
  { href: "/settings/notifications", icon: BellIcon, label: "Notifications" },
  { href: "/settings/privacy", icon: ShieldIcon, label: "Privacy Policy" },
  { href: "/settings/help", icon: HelpCircleIcon, label: "Help Center" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label =
      settingsItems.find((item) => item.href === href)?.label || segment;
    return { href, label };
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRightIcon className="h-4 w-4" />
            </BreadcrumbSeparator>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.href}>
                <BreadcrumbItem>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>{kebabCase(item.label)}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRightIcon className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <nav className="space-y-2">
            {settingsItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? "bg-secondary-100" : ""}`}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="rounded-lg bg-white p-6 shadow">
            {isLoading ? (
              <div className="flex p-16 items-center justify-center">
                <Loading/>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}