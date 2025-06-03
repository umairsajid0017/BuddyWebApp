"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon } from "lucide-react";

interface PaymentGatewayDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  paymentUrl: string;
  handlePaymentClose: () => void;
  title?: string;
}

export const PaymentGatewayDialog: React.FC<PaymentGatewayDialogProps> = ({
  isOpen,
  onOpenChange,
  paymentUrl,
  handlePaymentClose,
  title = "Payment Gateway",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] max-w-[90vw] overflow-hidden rounded-lg p-0 md:max-w-[900px]">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#1D0D25] to-[#673086] p-5 text-white">
          <div className="flex items-center gap-3">
            {/* Optional: Icon can be passed as a prop if needed */}
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <Button
            variant="ghost"
            className="h-8 w-8 rounded-full p-0 text-white"
            onClick={handlePaymentClose}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(80vh-134px)]">
          <div className="min-h-full bg-gradient-to-b from-[#f8f8f8] to-white p-4">
            {paymentUrl ? (
              <div className="h-full w-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-inner">
                <div className="relative h-[calc(80vh-182px)] w-full">
                  <div
                    className="absolute inset-0 z-10 flex items-center justify-center bg-white/80"
                    id="loading-indicator"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mb-2 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      <p className="text-sm text-muted-foreground">
                        Loading payment gateway...
                      </p>
                    </div>
                  </div>
                  <iframe
                    src={paymentUrl}
                    className="h-full w-full border-none"
                    title="Payment Gateway Iframe" 
                    sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-modals"
                    onLoad={() => {
                      const loadingIndicator =
                        document.getElementById("loading-indicator");
                      if (loadingIndicator)
                        loadingIndicator.style.display = "none";
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-[calc(80vh-150px)] w-full items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-lg font-medium">
                    Initializing payment...
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between border-t bg-gray-50 p-3">
          <div className="flex items-center">
            <div className="flex space-x-1">
              <div className="h-4 w-6 rounded bg-gray-300"></div>
              <div className="h-4 w-6 rounded bg-gray-400"></div>
              <div className="h-4 w-6 rounded bg-gray-500"></div>
              <div className="h-4 w-6 rounded bg-gray-600"></div>
            </div>
            <span className="ml-2 text-xs text-gray-500">Secure payment</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePaymentClose}
            className="text-sm"
          >
            Cancel Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 