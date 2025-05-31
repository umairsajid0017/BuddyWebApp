"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { PlaceOrderSheet } from "./place-order-sheet";
import { PlaceOrderDrawer } from "./place-order-drawer";
import { Service } from "@/types/service-types";
import { MediaFiles } from "@/types/general-types";

interface PlaceOrderResponsiveProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (description: string, mediaFiles?: MediaFiles) => void;
  service?: Service;
}

export function PlaceOrderResponsive({
  isOpen,
  onClose,
  onContinue,
  service,
}: PlaceOrderResponsiveProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <PlaceOrderDrawer
        isOpen={isOpen}
        onClose={onClose}
        onContinue={onContinue}
        service={service}
      />
    );
  }

  return (
    <PlaceOrderSheet
      isOpen={isOpen}
      onClose={onClose}
      onContinue={onContinue}
      service={service}
    />
  );
} 