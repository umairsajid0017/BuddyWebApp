'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  iconSrc: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, iconSrc, bgColor }) => (
  <Card className={`col-span-1 py-2 lg:p-4 ${bgColor} place-items-center`}>
    <CardContent className='flex items-center justify-between p-6'>
    <div className="w-full flex flex-col-reverse items-center lg:flex-row  lg:justify-between gap-4">
    <div className="flex flex-col items-start gap-2">
          <h3 className="text-sm lg:text-base font-regular ">{title}</h3>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold">{value}</p>
        </div>
        <Image src={iconSrc} alt={title} width={48} height={48} />
      </div>
    </CardContent>
  </Card>
);

const DashboardStats = () => (
  <section className="grid grid-cols-4 gap-4 mt-6">
    <StatCard 
      title="Total Spend" 
      value="Rs. 3.4k" 
      iconSrc="/assets/icons/wallet.svg" 
      bgColor="bg-primary-100" 
    />
    <StatCard 
      title="Total Orders" 
      value="164" 
      iconSrc="/assets/icons/box.svg" 
      bgColor="bg-[#F0EAF3]" 
    />
    <StatCard 
      title="Pending Orders" 
      value="24" 
      iconSrc="/assets/icons/clock.svg" 
      bgColor="bg-[#FFF9EE]" 
    />
    <StatCard 
      title="Over Due" 
      value="33" 
      iconSrc="/assets/icons/stopwatch.svg" 
      bgColor="bg-[#FEF2F2]" 
    />
  </section>
);

export default DashboardStats;
