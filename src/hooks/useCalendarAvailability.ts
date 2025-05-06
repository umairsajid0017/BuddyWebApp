import { useQuery } from "@tanstack/react-query";
import { http } from "@/apis/httpMethods";
import { Endpoints } from "@/apis/endpoints";
import { format } from "date-fns";

interface AvailabilityDetail {
  date_is: string;
  is_available: boolean;
}

interface AvailabilityResponse {
  records: {
    availability_details: AvailabilityDetail[];
  };
}

export const useCalendarAvailability = (workerId?: string) => {
  const currentMonth = format(new Date(), "yyyy-MM");
  const nextMonth = format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "yyyy-MM");

  const { data: currentMonthData } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", workerId, currentMonth],
    queryFn: async () => {
      const { data } = await http.get<AvailabilityResponse>(Endpoints.GET_WORKER_AVAILABILITY, {
        worker_id: workerId,
        month: currentMonth,
      });
      return data;
    },
    enabled: !!workerId,
  });

  const { data: nextMonthData } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", workerId, nextMonth],
    queryFn: async () => {
      const { data } = await http.get<AvailabilityResponse>(Endpoints.GET_WORKER_AVAILABILITY, {
        worker_id: workerId,
        month: nextMonth,
      });
      return data;
    },
    enabled: !!workerId,
  });
  //TODO: Implement the calendar availability

  // const availableDates = new Set(
  //   [
  //     ...(currentMonthData?.records.availability_details ?? []),
  //     ...(nextMonthData?.records.availability_details ?? []),
  //   ].map((availability) => availability.date_is),
  // );

  // const isDateAvailable = (date: Date) => {
  //   const dateString = format(date, "yyyy-MM-dd");
  //   return availableDates.has(dateString);
  // };

  return {
    isLoading: false,
    isDateAvailable: false,
  };
};
