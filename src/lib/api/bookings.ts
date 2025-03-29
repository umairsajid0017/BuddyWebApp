import { api } from "../api";
import { useQuery, useMutation, UseQueryOptions } from "react-query";
import { AxiosError } from "axios";
import {
  BookingsResponse,
  CreateBidData,
  CreateBidResponse,
  CreateBookingData,
  CreateBookingResponse,
} from "../types/booking-types";

// Get all bookings with optional status filter
export const useBookings = (
  role?: string,
  options?: UseQueryOptions<BookingsResponse, AxiosError>,
) => {
  return useQuery<BookingsResponse, AxiosError>(
    ["showActiveBookings", role],
    async () => {
      if (!role) throw new Error("Role is required"); // Ensure role is provided
      const response = await api.get<BookingsResponse>("/showActiveBookings", {
        params: { role }, // Correctly pass role as an object
      });
      console.log("Response:", response.data);
      return response.data;
    },
    options,
  );
};

// Get bookings by status
export const useBookingsByStatus = (
  status: number,
  options?: UseQueryOptions<BookingsResponse, AxiosError>,
) => {
  return useQuery<BookingsResponse, AxiosError>(
    ["bookings", status],
    async () => {
      const response = await api.get<BookingsResponse>(
        "/bookingsAgainstStatus",
        {
          params: { status },
        },
      );
      return response.data;
    },
    options,
  );
};

// Create a new booking
export const useCreateBooking = () => {
  return useMutation<CreateBookingResponse, AxiosError, CreateBookingData>(
    async (bookingData) => {
      const formData = new FormData();

      // Append basic booking data
      // formData.append("category_id", bookingData.category_id.toString());
      // formData.append("expected_price", bookingData.expected_price);
      if (bookingData.description) {
        formData.append("description", bookingData.description);
      }

      // Append media files if they exist
      if (bookingData.images) {
        bookingData.images.forEach((image) => {
          formData.append("images[]", image);
        });
      }

      if (bookingData.audio) {
        formData.append("audio", bookingData.audio);
      }

      const response = await api.post<CreateBookingResponse>(
        "/bookings",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
  );
};

// Cancel a booking
export const useCancelBooking = () => {
  return useMutation<{ status: boolean; message: string }, AxiosError, string>(
    async (bookingId) => {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      return response.data;
    },
  );
};

// Get booking details
export const useBookingDetails = (
  bookingId: string,
  options?: UseQueryOptions<BookingsResponse, AxiosError>,
) => {
  return useQuery<BookingsResponse, AxiosError>(
    ["booking", bookingId],
    async () => {
      const response = await api.get<BookingsResponse>(
        `/bookings/${bookingId}`,
      );
      return response.data;
    },
    options,
  );
};

// Create a new bid
export const useCreateBid = () => {
  return useMutation<CreateBidResponse, AxiosError, CreateBidData>(
    async (bookingData) => {
      const formData = new FormData();

      // Append required fields
      formData.append("category_id", bookingData.category_id.toString());
      formData.append("expected_price", bookingData.expected_price);
      formData.append("address", bookingData.address);
     

      // Append optional fields
      if (bookingData.description) {
        formData.append("description", bookingData.description);
      }

      // Append media files if they exist
      if (bookingData.images) {
        bookingData.images.forEach((image) => {
          formData.append("images[]", image);
        });
      }

      if (bookingData.audio) {
        formData.append("audio", bookingData.audio);
      }

      const response = await api.post<CreateBidResponse>(
        "/bidCreationCustomer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
  );
};

// Direct booking
export const useDirectBooking = () => {
  return useMutation<CreateBookingResponse, AxiosError, CreateBookingData>(
    async (bookingData) => {
      console.log("Booking Data", bookingData);
      const formData = new FormData();

      // Append booking data
      formData.append("worker_id", bookingData.worker_id);
      formData.append("booking_date", bookingData.booking_date);
      formData.append("address", bookingData.address);

      if (bookingData.description) {
        formData.append("description", bookingData.description);
      }

      // Handle media files
      if (bookingData.images) {
        bookingData.images.forEach((image) => {
          formData.append("images[]", image);
        });
      }

      if (bookingData.audio) {
        formData.append("audio", bookingData.audio);
      }

      const response = await api.post<CreateBookingResponse>(
        "/placeOrder",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
  );
};

// Update location
export const useUpdateLocation = () => {
  return useMutation<
    { error: boolean; message: string },
    AxiosError,
    { latitude: string; longitude: string }
  >(async (locationData) => {
    const formData = new URLSearchParams();
    formData.append("latitude", locationData.latitude);
    formData.append("longitude", locationData.longitude);

    const response = await api.patch("/updateLocation", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  });
};

interface WorkerAvailabilityResponse {
  error: boolean;
  message: string;
  worker_details: {
    id: number;
    name: string;
    service: {
      id: number;
      name: string;
      fixed_price: string;
      hourly_price: string;
      category: {
        id: number;
        title: string;
      };
    };
  };
  availability_details: Array<{
    id: number;
    user_id: number;
    service_id: number;
    date_is: string;
    is_available: number;
    created_at: string;
    updated_at: string;
  }>;
}

// Get worker availability for a month
export const useWorkerAvailability = (workerId: string, month: number) => {
  return useQuery<WorkerAvailabilityResponse, AxiosError>(
    ["workerAvailability", workerId, month],
    async () => {
      const response = await api.get<WorkerAvailabilityResponse>(
        "/getavailableWorkersByMonth",
        {
          params: {
            worker_id: workerId,
            month: month,
          },
        },
      );
      return response.data;
    },
    {
      enabled: Boolean(workerId && month),
    },
  );
};
