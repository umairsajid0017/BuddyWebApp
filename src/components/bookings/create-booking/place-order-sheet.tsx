"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Video, Image as ImageIcon } from 'lucide-react'

interface PlaceOrderSheetProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  service: string
}

export function PlaceOrderSheet({ isOpen, onClose, onContinue, service }: PlaceOrderSheetProps) {
  const [description, setDescription] = useState('')

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>Place an order</SheetTitle>
          <SheetDescription>
            {service}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Textarea
              placeholder="Describe your task"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Button variant="outline" className="w-full justify-start">
              <Mic className="mr-2 h-4 w-4" />
              Record Detailed Audio
            </Button>
          </div>
          <div>
            <Button variant="outline" className="w-full justify-start">
              <Video className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          </div>
          <div>
            <Button variant="outline" className="w-full justify-start">
              <ImageIcon className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
          </div>
        </div>
        <Button onClick={onContinue} className="w-full">Continue</Button>
      </SheetContent>
    </Sheet>
  )
}