import { useWorkerAvailability } from "@/lib/api/bookings";
import { addMonths, format, getMonth } from "date-fns";

export const useCalendarAvailability = (workerId?: string) => {
  const currentMonth = getMonth(new Date()) + 1; // getMonth is 0-based
  const { data: currentMonthData, isLoading: isLoadingCurrentMonth } =
    useWorkerAvailability(workerId ?? "", currentMonth);
  console.log(currentMonthData);

  const nextMonth = getMonth(addMonths(new Date(), 1)) + 1;
  const { data: nextMonthData, isLoading: isLoadingNextMonth } =
    useWorkerAvailability(workerId ?? "", nextMonth);
  const availableDates = new Set(
    [
      ...(currentMonthData?.availability_details ?? []),
      ...(nextMonthData?.availability_details ?? []),
    ].map((availability) => availability.date_is),
  );

  const isDateAvailable = (date: Date) => {
    // Format the date in YYYY-MM-DD format to match the API response format
    const dateString = format(date, "yyyy-MM-dd");
    return availableDates.has(dateString);
  };
  console.log(currentMonthData);

  return {
    isLoading: isLoadingCurrentMonth || isLoadingNextMonth,
    isDateAvailable,
    workerDetails: currentMonthData?.worker_details,
  };
};
