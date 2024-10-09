'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '../ui/card'

type CancelBookingDialogProps = {
  task: {
    title: string
    person: string
    image: string
  }
  onConfirm: () => void
  onCancel: () => void
}

export function CancelBookingDialog({ task, onConfirm, onCancel }: CancelBookingDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex-1">
          Cancel Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Cancel Booking
          </DialogTitle>
        </DialogHeader>
        <Card className="flex items-center justify-start">
            <CardHeader>
          <Image
            src={task.image}
            alt={task.title}
            width={96}
            height={96}
            className="rounded-lg"
            />
            </CardHeader>
          <CardContent className='h-full flex flex-col justify-center p-0'>
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-text-700">{task.person}</p>
          </CardContent>
        </Card>
        <DialogDescription className="text-center mb-4">
          Are you sure want to cancel your service booking?
        </DialogDescription>
        <p className="text-sm text-destructive text-center mb-6">
          Only 80% of the money you can refund from your payment according to our policy
        </p>
        <div className="flex justify-between space-x-4">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">
            Yes, Cancel Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}