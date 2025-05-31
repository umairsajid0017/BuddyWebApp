"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { StartBookingDialog } from "./offer-bid";
import { StartBookingDrawer } from "./offer-bid-drawer";
import { Service } from "@/types/service-types";

interface StartBookingResponsiveProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBid: (amount: number) => void;
  service?: Service;
  isLoading?: boolean;
}

export function StartBookingResponsive({
  isOpen,
  onClose,
  onSubmitBid,
  service,
  isLoading = false,
}: StartBookingResponsiveProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <StartBookingDrawer
        isOpen={isOpen}
        onClose={onClose}
        onSubmitBid={onSubmitBid}
        service={service}
        isLoading={isLoading}
      />
    );
  }

  return (
    <StartBookingDialog
      isOpen={isOpen}
      onClose={onClose}
      onSubmitBid={onSubmitBid}
      service={service}
      isLoading={isLoading}
    />
  );
} 