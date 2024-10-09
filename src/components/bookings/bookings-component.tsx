import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SprayCan, PaintBucket, Waves } from 'lucide-react';
import Image from 'next/image';
import BookingDetailsSheet from './bookings-details-sheet';
import { Button } from '../ui/button';

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

type TaskCardProps = {
    task: Task;
};

const getTaskIcon = (title: string) => {
    switch (title) {
        case 'House Cleaning':
        case 'Garage Cleaning':
            return <SprayCan className="h-4 w-4" />;
        case 'Painting the Walls':
            return <PaintBucket className="h-4 w-4" />;
        case 'Laundry':
            return <Waves className="h-4 w-4" />;
        default:
            return null;
    }
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => (
    <Card className="w-full max-w-sm">
        <CardHeader className="p-0">
            <img src={task.image} alt={task.title} className="w-full h-40 object-cover rounded-t-lg" />
        </CardHeader>
        <CardContent className="p-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {getTaskIcon(task.title)}
                {task.title}
            </CardTitle>
            <p className="text-sm text-gray-500">{task.person}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
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
            <BookingDetailsSheet task={task} />
        </CardFooter>
    </Card>
);

const tasks: Task[] = [
    { id: '2', title: 'Garage Cleaning', image: '/assets/garage.png', person: 'Florencio Dorrance', status: 'Completed', date: '2023-06-15', time: '14:00 - 16:00', location: '123 Main St, Anytown, USA' },
    { id: '6', title: 'Laundry', image: '/assets/laundry.png', person: 'Jenny Wilson', status: 'Cancelled', date: '2023-06-18', time: '10:00 - 12:00', location: '456 Elm St, Somewhere, USA' },
    { id: '4', title: 'Laundry', image: '/assets/laundry.png', person: 'Jenny Wilson', status: 'Upcoming', date: '2023-06-18', time: '10:00 - 12:00', location: '456 Elm St, Somewhere, USA' },
];

const NoBookingsView: React.FC<{ status: string }> = ({ status }) => (
    <div className="flex flex-col items-center justify-center py-12">
        <div className="flex justify-center items-center  pointer-events-none">
            <Image src="/assets/verify-email.svg" alt="Verify Email" className="h-[180px] w-[180px]" width={180} height={180} />
        </div>
        <h2 className="text-2xl text-center font-semibold mb-2">You have no {status} booking</h2>
        <p className="text-gray-500 text-center mb-6">You do not have any {status} booking. Make a new booking by clicking the button below.</p>
        <Button variant="default" className="">
            Make New Booking
        </Button>
    </div>
);

const BookingsComponent: React.FC = () => {
    return (
        <div className="p-4">
            <Tabs defaultValue="upcoming">
                <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                {['upcoming', 'completed', 'cancelled'].map((status) => (
                    <TabsContent key={status} value={status}>
                        {tasks.filter((task) => task.status.toLowerCase() === status).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {tasks
                                    .filter((task) => task.status.toLowerCase() === status)
                                    .map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                            </div>
                        ) : (
                            <NoBookingsView status={status} />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default BookingsComponent;