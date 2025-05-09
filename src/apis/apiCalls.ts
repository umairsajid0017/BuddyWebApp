import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { http } from "./httpMethods";
import { BidStatus, BookingStatus } from "@/constants/constantValues";
import { Endpoints } from "./endpoints";
import { buildQueryString } from "@/helpers/utils";
import {
  AvailabilityResponse,
  BidResponse,
  BidsResponse,
  BookingsResponse,
  BookmarkResponse,
  CancelBidResponse,
  CategoriesResponse,
  CategoryResponse,
  CategoryServicesResponse,
  CheckCredentialsResponse,
  CnicVerificationResponse,
  CreateBookingResponse,
  FAQResponse,
  GeneralResponse,
  LivePhotoVerificationResponse,
  LoginResponse,
  OfferResponse,
  PassportVerificationResponse,
  PaymentGatewayResponse,
  RegisterResponse,
  SearchResponse,
  SendOtpResponse,
  ServiceResponse,
  ServicesResponse,
  SpecialOffersResponse,
  TransactionResponse,
  UserDetailResponse,
  UserResponse,
  VerificationCheckResponse,
  WalletCreditResponse,
} from "@/apis/api-response-types";
import {
  AddToWalletData,
  CancelBidRequest,
  ChangePasswordData,
  CnicVerificationRequest,
  CreateBidData,
  CreateBookingData,
  LivePhotoVerificationRequest,
  LoginCredentials,
  PassportVerificationRequest,
  ProfileFormData,
  RegisterData,
  ResetPasswordData,
  SearchParams,
  SendOtpData,
  VerifyOtpData,
} from "./api-request-types";
import { Service } from "@/types/service-types";
import { Category } from "@/types/category-types";
import { Offer } from "@/types/bid-types";
import { User } from "@/types/general-types";
import { setAuthToken } from "./axios";
import { format } from "date-fns";
import { deleteCookie } from "@/helpers/cookies";
import useAuthStore from "@/store/authStore";

const handleError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response) {
    const responseData = error.response?.data as { message?: string };
    return responseData?.message ?? error.message;
  } else if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

// Auth API Calls
export const useRegister = () => {
  return useMutation<RegisterResponse, AxiosError, RegisterData>({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await http.post<RegisterResponse>(
        Endpoints.REGISTER,
        userData,
      );
      return data;
    },
  });
};

export const useCheckCredentials = () => {
  return useMutation<
    CheckCredentialsResponse,
    AxiosError,
    { email: string; phone: string; role: string }
  >({
    mutationFn: async (credentials: {
      email: string;
      phone: string;
      role: string;
    }) => {
      const { data } = await http.post<CheckCredentialsResponse>(
        Endpoints.CHECK_CREDENTIALS,
        credentials,
      );
      return data;
    },
  });
};

export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await http.post<LoginResponse>(
        Endpoints.LOGIN,
        credentials,
      );
      return data;
    },
  });
};


export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        // Clear all auth-related state
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setToken(null);
        useAuthStore.getState().setError(null);

        // Clear all React Query cache
        queryClient.clear();

        // Clear any auth-related items from localStorage
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("token");

        //Delete Cookie
        try {
          const cookieRes = await deleteCookie("token");
          const authCookieRes = await deleteCookie("auth-storage");
          console.log("Cookie deleted:", cookieRes);
          console.log("Auth Cookie deleted:", authCookieRes);
        } catch (error) {
          console.log("Error deleting cookie:", error);
        }
        return { success: true };
      } catch (error) {
        console.error("Logout error:", error);
        throw error;
      }
    },
    onSettled: () => {
      // Ensure state is cleared regardless of success/failure
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setToken(null);
      },
    },
  );
};

export const useUser = () => {
  return useQuery<UserDetailResponse, AxiosError>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await http.get<UserDetailResponse>(
        Endpoints.GET_MY_PROFILE_DETAILS,
      );
      return data;
    },
  });
};

export const useSendOtp = () => {
  return useMutation<SendOtpResponse, AxiosError, SendOtpData>({
    mutationFn: async (otpData: SendOtpData) => {
      const { data } = await http.post<SendOtpResponse>(
        Endpoints.SEND_OTP,
        otpData,
      );
      return data;
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation<GeneralResponse, AxiosError, VerifyOtpData>({
    mutationFn: async (otpData: VerifyOtpData) => {
      const { data } = await http.post<GeneralResponse>(
        Endpoints.VERIFY_OTP,
        otpData,
      );
      return data;
    },
  });
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const userQuery = useUser();

  const {
    data: user = null,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await userQuery.refetch();
      if (data && !data.error) {
        return data.records;
      }
      throw new Error(data?.error?.toString() || "Failed to fetch user");
    },
  });

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      setAuthToken(result.token);
      queryClient.setQueryData(["user"], result.records);
      return result.records;
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      throw new Error(errorMessage);
    }
  };

  const registerUser = async (userData: RegisterData) => {
    try {
      const result = await registerMutation.mutateAsync(userData);
      if (!result) throw new Error("Registration failed");
      if (result.records) {
        queryClient.setQueryData(["user"], result.records);
      }
      return result.records;
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      throw new Error(errorMessage);
    }
  };

  const logoutUser = async () => {
    try {
      await logoutMutation.mutateAsync();
      setAuthToken(null);
      queryClient.setQueryData(["user"], null);
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      throw new Error(errorMessage);
    }
  };

  return {
    user,
    error,
    isLoading,
    loginUser,
    registerUser,
    logoutUser,
  };
};

// Service API Calls
export const useServices = () => {
  const queryClient = useQueryClient();

  const {
    data: services = [],
    isLoading,
    error,
  } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await http.get<ServicesResponse>(Endpoints.GET_SERVICES);
      return data.records;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newServices: Service[]) => {
      const { data } = await http.post<ServicesResponse>(
        Endpoints.ADD_NEW_SERVICE,
        newServices,
      );
      return data.records;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const addService = (service: Service) => {
    mutation.mutate([...services, service]);
  };

  const updateService = (updatedService: Service) => {
    mutation.mutate(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service,
      ),
    );
  };

  const deleteService = (id: number) => {
    mutation.mutate(services.filter((service) => service.id !== id));
  };

  return {
    services,
    isLoading,
    error,
    addService,
    updateService,
    deleteService,
  };
};

export const useServiceDetails = (
  id: number,
  options?: UseQueryOptions<ServiceResponse, AxiosError>,
) => {
  return useQuery<ServiceResponse, AxiosError>({
    queryKey: ["service", id],
    queryFn: async (): Promise<ServiceResponse> => {
      const { data } = await http.get<ServiceResponse>(
        Endpoints.GET_SERVICE_DETAIL,
        { service_id: id },
      );
      return data;
    },
    ...options,
  });
};

export const useCreateService = (): UseMutationResult<
  AxiosResponse<ServiceResponse>,
  AxiosError,
  Partial<ServiceResponse>
> => {
  return useMutation({
    mutationFn: async (newService: Partial<ServiceResponse>) => {
      const response = await http.post<ServiceResponse>(
        Endpoints.ADD_NEW_SERVICE,
        newService,
      );
      return response;
    },
  });
};

export const useUpdateService = (): UseMutationResult<
  AxiosResponse<GeneralResponse>,
  AxiosError,
  Service
> => {
  return useMutation({
    mutationFn: async (data: Service) => {
      const response = await http.put<GeneralResponse>(
        Endpoints.EDIT_MY_SERVICES,
        data,
      );
      return response;
    },
  });
};

export const useDeleteService = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await http.delete(Endpoints.DELETE_MY_SERVICES, {
        params: { id },
      });
      return data;
    },
  });
};

export const useServicesByCategory = (
  categoryId: string,
  options?: UseQueryOptions<CategoryServicesResponse, AxiosError>,
) => {
  return useQuery<CategoryServicesResponse, AxiosError>({
    queryKey: ["services", "category", categoryId],
    queryFn: async () => {
      const { data } = await http.get<CategoryServicesResponse>(
        Endpoints.SERVICES_AGAINST_CATEGORY,
        { params: { categoryId } },
      );
      return data;
    },
    ...options,
  });
};

// Profile API Calls
export const useChangePassword = () => {
  const { user } = useAuth();

  return useMutation<GeneralResponse, AxiosError, ChangePasswordData>({
    mutationFn: async (passwordData: ChangePasswordData) => {
      if (!user?.id) throw new Error("User not found");
      const { data } = await http.put<GeneralResponse>(
        Endpoints.CHANGE_PASSWORD,
        passwordData,
      );
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    AxiosError,
    { formData: ProfileFormData; image?: File }
  >({
    mutationFn: async (formData: {
      formData: ProfileFormData;
      image?: File;
    }) => {
      const formDataToSend = new FormData();

      Object.entries(formData.formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const { data } = await http.post<UserResponse>(
        Endpoints.UPDATE_PROFILE,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.error) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: (response: UserResponse) => {
      queryClient.setQueryData(["user"], response.records);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Password Reset API Calls
export const useRequestResetOtp = () => {
  return useMutation<GeneralResponse, AxiosError, { email: string }>({
    mutationFn: async (resetData: { email: string }) => {
      const { data } = await http.post<GeneralResponse>(
        Endpoints.SEND_OTP,
        resetData,
      );
      return data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation<GeneralResponse, AxiosError, ResetPasswordData>({
    mutationFn: async (resetData: ResetPasswordData) => {
      const { data } = await http.post<GeneralResponse>(
        Endpoints.RESET_PASSWORD,
        {
          email: resetData.email,
          password: resetData.password,
        },
      );
      return data;
    },
  });
};

// Verification API Calls
export const useCnicVerification = () => {
  return useMutation<
    CnicVerificationResponse,
    AxiosError,
    CnicVerificationRequest
  >({
    mutationFn: async (verificationData: CnicVerificationRequest) => {
      const formData = new FormData();
      formData.append("cnic_front", verificationData.cnic_front);
      formData.append("cnic_back", verificationData.cnic_back);

      const { data } = await http.post<CnicVerificationResponse>(
        Endpoints.ADD_VERIFICATION_CNIC,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
  });
};

export const useLivePhotoVerification = () => {
  return useMutation<
    LivePhotoVerificationResponse,
    AxiosError,
    LivePhotoVerificationRequest
  >({
    mutationFn: async (verificationData: LivePhotoVerificationRequest) => {
      const formData = new FormData();
      formData.append("live_photo", verificationData.live_photo);

      const { data } = await http.post<LivePhotoVerificationResponse>(
        Endpoints.ADD_VERIFICATION_LIVE_PHOTO,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
  });
};

export const usePassportVerification = () => {
  return useMutation<
    PassportVerificationResponse,
    AxiosError,
    PassportVerificationRequest
  >({
    mutationFn: async (verificationData: PassportVerificationRequest) => {
      const formData = new FormData();
      formData.append("passport_photo", verificationData.passport_photo);

      const { data } = await http.post<PassportVerificationResponse>(
        Endpoints.ADD_VERIFICATION_PASSPORT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
  });
};

export const useVerificationCheck = () => {
  return useQuery<VerificationCheckResponse, AxiosError>({
    queryKey: ["verificationCheck"],
    queryFn: async () => {
      const { data } = await http.get<VerificationCheckResponse>(
        Endpoints.CHECK_ACCOUNT_VERIFICATION,
      );
      return data;
    },
  });
};

// FAQ API Calls
export const useFAQs = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data } = await http.get<FAQResponse>(Endpoints.SHOW_FAQ);
      return data;
    },
  });
};

// Wallet API Calls
export const useWalletCredit = () => {
  return useQuery({
    queryKey: ["wallet-credit"],
    queryFn: async () => {
      const { data } = await http.get<WalletCreditResponse>(
        Endpoints.SHOW_WALLET_CREDIT,
      );
      return data;
    },
  });
};

export const useCustomerTransactions = () => {
  return useQuery({
    queryKey: ["customer-transactions"],
    queryFn: async () => {
      const { data } = await http.get<TransactionResponse>(
        Endpoints.SHOW_CUSTOMER_TRANSACTION,
      );
      return data;
    },
  });
};

export const useInitPaymentGateway = () => {
  return useMutation({
    mutationFn: async (paymentData: AddToWalletData) => {
      const { data } = await http.post<PaymentGatewayResponse>(
        Endpoints.INIT_PAYMENT_GATEWAY,
        paymentData,
      );
      return data;
    },
  });
};

export const useCustomerBidsByStatus = (
  status: BidStatus,
  options?: UseQueryOptions<BidsResponse, AxiosError>,
) => {
  return useQuery<BidsResponse, AxiosError>({
    queryKey: ["customerBids", status],
    queryFn: async (): Promise<BidsResponse> => {
      const { data } = await http.get<BidsResponse>(Endpoints.BIDS, {
        bid_status: status,
      });
      return data;
    },
    enabled: status !== undefined && (options?.enabled ?? true),
    ...options,
  });
};

export const useCancelBid = () => {
  return useMutation<CancelBidResponse, AxiosError, CancelBidRequest>({
    mutationFn: async ({ bid_id, bid_canceled_reason }: CancelBidRequest) => {
      const { data } = await http.post<CancelBidResponse>(
        Endpoints.CANCELED_BID_CUSTOMER,
        {
          bid_id,
          bid_canceled_reason,
        },
      );
      return data;
    },
  });
};

export const useBidResponses = (bid_id: number | null) => {
  return useQuery<OfferResponse, AxiosError>({
    queryKey: ["bidResponses", bid_id],
    queryFn: async () => {
      const { data } = await http.get<OfferResponse>(
        Endpoints.SHOW_BID_RESPONSE_CUSTOMER,
        {
          bid_id,
        },
      );
      return data;
    },
    enabled: !!bid_id,
  });
};

// Bookings API Calls
export const useBookings = (
  role?: string,
  options?: UseQueryOptions<BookingsResponse, AxiosError>,
) => {
  return useQuery<BookingsResponse, AxiosError>({
    queryKey: ["showActiveBookings", role],
    queryFn: async (): Promise<BookingsResponse> => {
      if (!role) throw new Error("Role is required");
      const { data } = await http.get<BookingsResponse>(
        Endpoints.SHOW_ACTIVE_BOOKINGS,
        {
          params: { role },
        },
      );
      return data;
    },
    ...options,
  });
};

export const useBookingsByStatus = (status: BookingStatus) => {
  return useQuery({
    queryKey: ["bookings", status],
    queryFn: async () => {
      const { data } = await http.get<BookingsResponse>(
        Endpoints.BOOKINGS_AGAINST_STATUS,
        { status: status.toString() },
      );
      return data;
    },
  });
};

export const useBookingDetails = (
  bookingId: string,
  options?: UseQueryOptions<BookingsResponse, AxiosError>,
) => {
  return useQuery<BookingsResponse, AxiosError>({
    queryKey: ["booking", bookingId],
    queryFn: async (): Promise<BookingsResponse> => {
      const { data } = await http.get<BookingsResponse>(
        Endpoints.GET_BOOKING_DETAILS,
        {
          params: { bookingId },
        },
      );
      return data;
    },
    ...options,
  });
};

export const useCancelBooking = () => {
  return useMutation<GeneralResponse, AxiosError, string>({
    mutationFn: async (bookingId: string) => {
      const { data } = await http.put<GeneralResponse>(
        Endpoints.SHOW_ALL_CANCELED_BOOKINGS,
        { bookingId },
      );
      return data;
    },
  });
};

export const useCreateBid = () => {
  return useMutation<BidResponse, AxiosError, CreateBidData>({
    mutationFn: async (bookingData: CreateBidData) => {
      const formData = new FormData();
      formData.append("category_id", bookingData.category_id.toString());
      formData.append("expected_price", bookingData.expected_price);
      formData.append("address", bookingData.address);

      if (bookingData.description) {
        formData.append("description", bookingData.description);
      }
      if (bookingData.images) {
        bookingData.images.forEach((image: File) => {
          formData.append("images[]", image);
        });
      }
      if (bookingData.audio) {
        formData.append("audio", bookingData.audio);
      }

      const { data } = await http.post<BidResponse>(
        Endpoints.BID_CREATION_CUSTOMER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return data;
    },
  });
};

export const useDirectBooking = () => {
  return useMutation<CreateBookingResponse, AxiosError, CreateBookingData>({
    mutationFn: async (bookingData: CreateBookingData) => {
      const formData = new FormData();
      formData.append("worker_id", bookingData.worker_id);
      formData.append("booking_date", bookingData.booking_date);
      formData.append("address", bookingData.address);
      formData.append("service_id", bookingData.service_id);

      if (bookingData.description) {
        formData.append("description", bookingData.description);
      }
      if (bookingData.images) {
        bookingData.images.forEach((image: File) => {
          formData.append("images[]", image);
        });
      }
      if (bookingData.audio) {
        formData.append("audio", bookingData.audio);
      }

      const { data } = await http.post<CreateBookingResponse>(
        Endpoints.PLACE_ORDER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (data.error) {
        throw new Error(data.message);
      }

      return data;
    },
  });
};

export const useUpdateLocation = () => {
  return useMutation<
    { error: boolean; message: string },
    AxiosError,
    { latitude: string; longitude: string }
  >({
    mutationFn: async (locationData: {
      latitude: string;
      longitude: string;
    }) => {
      const formData = new URLSearchParams();
      formData.append("latitude", locationData.latitude);
      formData.append("longitude", locationData.longitude);

      const { data } = await http.patch<{ error: boolean; message: string }>(
        Endpoints.UPDATE_LOCATION,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return data;
    },
  });
};

// Categories API Calls
export const useCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await http.get<CategoriesResponse>(
        Endpoints.GET_ALL_CATEGORIES,
      );
      return data.records;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newCategories: Category[]) => {
      const { data } = await http.post<CategoriesResponse>(
        Endpoints.GET_ALL_CATEGORIES,
        newCategories,
      );
      return data.records;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const addCategory = (category: Category) => {
    mutation.mutate([...categories, category]);
  };

  const updateCategory = (updatedCategory: Category) => {
    mutation.mutate(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category,
      ),
    );
  };

  const deleteCategory = (id: number) => {
    mutation.mutate(categories.filter((category) => category.id !== id));
  };

  return {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const { data } = await http.get<CategoryResponse>(
        Endpoints.GET_CATEGORY_DETAILS,
        { category_id: id },
      );
      return data;
    },
  });
};

export const useSearchServices = (
  searchParams: SearchParams,
  options?: UseQueryOptions<SearchResponse, AxiosError>,
) => {
  // const { user } = useAuth();

  return useQuery<SearchResponse, AxiosError>({
    queryKey: ["services", "search", searchParams],
    queryFn: async (): Promise<SearchResponse> => {
      try {
        // const queryString = buildQueryString(searchParams);
        const { data } = await http.get<SearchResponse>(Endpoints.SEARCH_ALL, {
          keyword: searchParams.keyword,
        });
        return data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw new Error("Please log in to search services");
        }
        throw error;
      }
    },
    enabled: Object.values(searchParams).some((param) => param !== undefined),
    // Boolean(user),
    ...options,
    retry: (failureCount: number, error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Special Offers API Calls
export const useSpecialOffers = () => {
  return useQuery({
    queryKey: ["special-offers"],
    queryFn: async () => {
      const { data } = await http.get<SpecialOffersResponse>(
        Endpoints.SHOW_SPECIAL_OFFERS,
      );
      return data.records;
    },
  });
};

export const useWorkerAvailability = (service_id: string) => {
  return useQuery({
    queryKey: ["worker-availability", service_id],
    queryFn: async () => {
      const { data } = await http.get(Endpoints.GET_WORKER_AVAILABILITY, {
        params: { service_id },
      });
      return data;
    },
  });
};

// Filters API Calls
export interface Filters {
  serviceOptions: string;
  sellerDetails: string;
  budget: string;
  deliveryTime: string;
  sortBy: string;
}

const initialFilters: Filters = {
  serviceOptions: "",
  sellerDetails: "",
  budget: "",
  deliveryTime: "",
  sortBy: "best_selling",
};

export const useFilters = () => {
  const queryClient = useQueryClient();

  const { data: filters = initialFilters } = useQuery<Filters>({
    queryKey: ["filters"],
    queryFn: async () => {
      const storedFilters = localStorage.getItem("filters");
      return storedFilters ? JSON.parse(storedFilters) : initialFilters;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newFilters: Filters) => {
      localStorage.setItem("filters", JSON.stringify(newFilters));
      return newFilters;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
    },
  });

  const setFilter = (key: keyof Filters, value: string) => {
    mutation.mutate({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    mutation.mutate(initialFilters);
  };

  return {
    filters,
    setFilter,
    resetFilters,
  };
};

export const useCalendarAvailability = (service_id?: string) => {
  const { data: currentMonthData, isLoading } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", service_id],
    queryFn: async () => {
      const { data } = await http.get<AvailabilityResponse>(
        Endpoints.GET_AVAILABLE_WORKERS_BY_MONTH,
        {
          service_id: service_id as string,
        },
      );
      return data;
    },
    enabled: !!service_id,
  });

  const availableDates = new Set(
    Array.isArray(currentMonthData?.records)
      ? currentMonthData.records.map((availability) => availability.date_is)
      : [],
  );

  const isDateAvailable = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return availableDates.has(dateString);
  };

  return {
    isLoading,
    isDateAvailable,
  };
};

export const useAcceptOffer = () => {
  return useMutation<GeneralResponse, AxiosError, { response_id: number, bid_id: number, status: number }>({
    mutationFn: async ({ response_id, bid_id, status }) => {
      const formData = new FormData();
      formData.append("response_id", response_id.toString());
      formData.append("bid_id", bid_id.toString());
      formData.append("status", status.toString());
      
      const { data } = await http.post<GeneralResponse>(
        Endpoints.DIRECT_AS_CUSTOMER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.error) {
        throw new Error(data.message);
      }
      return data;
    },
  });
};

export const useAddBookmark = () => {
  return useMutation<BookmarkResponse, AxiosError, { service_id: number, status: number }>({
    mutationFn: async ({ service_id, status }) => {
      const formData = new FormData();
      formData.append("service_id", service_id.toString());
      formData.append("status", status.toString());
      
      const { data } = await http.post<BookmarkResponse>(
        Endpoints.ADD_BOOKMARK,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.error) {
        throw new Error(data.message);
      }
      return data;
    },
  });
};


export const useShowBookmarks = () => {
  return useQuery<BookmarkResponse, AxiosError>({
    queryKey: ["show-bookmarks"],
    queryFn: async () => {
      const { data } = await http.get<BookmarkResponse>(Endpoints.SHOW_BOOKMARK);
      if (data.error) {
        throw new Error(data.message);
      }
      return data;
    },
  });
};




