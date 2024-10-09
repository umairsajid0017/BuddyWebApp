'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, MessageCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { CancelBookingDialog } from './cancel-booking-dialog';

type Task = {
    id: string;
    title: string;
    image: string;
    person: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
    date?: string;
    time?: string;
    location?: string;
};

type BookingDetailsSheetProps = {
    task: Task;
};

const BookingDetailsSheet: React.FC<BookingDetailsSheetProps> = ({ task }) => {
    const handleCancel = () => {
        console.log('Cancelling booking:', task.id);
        // Implement cancellation logic here
    };

    const handleChat = () => {
        console.log('Opening chat for booking:', task.id);
        // Implement chat opening logic here
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">Details</Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>{task.title}</SheetTitle>
                    <SheetDescription>{task.person}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <Image src={task.image} alt={task.title} width={500} height={300} className="w-full rounded-lg" />
                    <div className="space-y-2">
                        <Badge
                            variant={
                                task.status === 'Upcoming'
                                    ? 'default'
                                    : task.status === 'Completed'
                                        ? 'default'
                                        : 'destructive'
                            }
                            className={`${task.status === 'Completed' ? 'bg-green-500 hover:bg-green-400' : ''}`}
                        >
                            {task.status}
                        </Badge>
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{task.date || 'Date not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{task.time || 'Time not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{task.location || 'Location not specified'}</span>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <Button onClick={handleChat} className="flex-1">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Chat
                        </Button>

                       {
                        (task.status === 'Upcoming') && 

                      <CancelBookingDialog
                            task={task}
                            onConfirm={handleCancel}
                            onCancel={() => console.log('Cancellation aborted')}
                        />
                    }
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    );
};

export default BookingDetailsSheet;