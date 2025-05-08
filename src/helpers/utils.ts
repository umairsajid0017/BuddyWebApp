import { SearchParams } from "@/apis/api-request-types";
import { BidStatus, BookingStatus } from "@/constants/constantValues";
import { ImageType } from "@/types/general-types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function kebabCase(str: string): string {
  return str
    .replace(/ /g, '-') 
    .replace(/([A-Z])/g, (match: string, p1: string) => `${p1.toLowerCase()}`) 
    .replace(/^\-|\-$/g, ''); 
}

type NameParts = {
  firstName: string;
  lastName: string;
};

export function splitFullName(fullName: string): NameParts {
  const nameParts = fullName.trim().split(/\s+/);
  const lastName = nameParts.pop() ?? ""; 
  const firstName = nameParts.join(" ") ?? ""; 

  return {
    firstName,
    lastName,
  };
}

export const parseServiceImages = (
  images: ImageType[] | string | undefined | null,
): ImageType[] => {
  if (!images) return [];

  if (typeof images === "string") {
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  }

  return images;
};

export const getImageUrl = (name?: string | null) => {
  if (name?.startsWith("http")) {
    return name;
  }

  if(!name){
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/placeholder_img.png`;
  }

  return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${name}`;
};

export const getStatusLabel = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.OPEN:
      return "Open";
    case BookingStatus.CLOSED:
      return "Closed";
    case BookingStatus.CANCELED:
    case BookingStatus.CANCELED_BY_WORKER:
    case BookingStatus.CANCELED_BY_CUSTOMER:
    case BookingStatus.TIMEOUT_CANCELED:
      return "Canceled";
    case BookingStatus.PENDING:
      return "Pending";
    case BookingStatus.CONFIRMED:
      return "Confirmed";
    case BookingStatus.STARTED:
    case BookingStatus.WORKER_HAS_STARTED_THE_WORK:
      return "Started";
    case BookingStatus.COMPLETED:
      return "Completed";
    case BookingStatus.DECLINED:
      return "Declined";
    case BookingStatus.WORKER_IS_ON_HIS_WAY:
      return "Worker En Route";
    case BookingStatus.WORKER_IS_ON_YOUR_DOORSTEP:
      return "Worker Arrived";
    case BookingStatus.NOT_STARTED:
      return "Not Started";
    default:
      return "Unknown";
  }
};

export const getStatusBadgeVariant = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.OPEN:
    case BookingStatus.CONFIRMED:
    case BookingStatus.STARTED:
    case BookingStatus.WORKER_HAS_STARTED_THE_WORK:
    case BookingStatus.WORKER_IS_ON_HIS_WAY:
    case BookingStatus.WORKER_IS_ON_YOUR_DOORSTEP:
      return "default";
    case BookingStatus.COMPLETED:
      return "success";
    case BookingStatus.CANCELED:
    case BookingStatus.CANCELED_BY_WORKER:
    case BookingStatus.CANCELED_BY_CUSTOMER:
    case BookingStatus.TIMEOUT_CANCELED:
    case BookingStatus.DECLINED:
      return "destructive";
    case BookingStatus.PENDING:
    case BookingStatus.NOT_STARTED:
      return "outline";
    default:
      return "secondary";
  }
};


export const getStatusBadgeProps = (status: number) => {
  switch (status) {
    case BidStatus.OPEN:
      return { variant: "default" as const, label: "Open" };
    case BidStatus.CLOSED:
      return { variant: "secondary" as const, label: "Closed" };
    case BidStatus.CANCELED:
    case BidStatus.CANCELED_BY_WORKER:
    case BidStatus.CANCELED_BY_CUSTOMER:
    case BidStatus.TIMEOUT_CANCELED:
      return { variant: "destructive" as const, label: "Canceled" };
    case BidStatus.PENDING:
      return { variant: "outline" as const, label: "Pending" };
    case BidStatus.CONFIRMED:
      return { variant: "default" as const, label: "Confirmed" };
    case BidStatus.STARTED:
    case BidStatus.WORKER_HAS_STARTED_THE_WORK:
      return { variant: "default" as const, label: "In Progress" };
    case BidStatus.COMPLETED:
      return { variant: "success" as const, label: "Completed" };
    case BidStatus.DECLINED:
      return { variant: "destructive" as const, label: "Declined" };
    case BidStatus.WORKER_IS_ON_HIS_WAY:
      return { variant: "default" as const, label: "Worker En Route" };
    case BidStatus.WORKER_IS_ON_YOUR_DOORSTEP:
      return { variant: "default" as const, label: "Worker Arrived" };
    case BidStatus.NOT_STARTED:
      return { variant: "outline" as const, label: "Not Started" };
    default:
      return { variant: "secondary" as const, label: "Unknown" };
  }
};

export function generateConsistentPassword(googleId: string) {
  const firstPart = googleId.slice(0, 5); // First 5 characters of the Google ID
  const lastPart = googleId.slice(-5); // Last 5 characters of the Google ID

  const fixedSymbol = "!"; // A fixed symbol to include
  const fixedPattern = "MyPwd"; // A fixed string for added complexity

  // Combine the parts into a consistent password
  const password = `${firstPart}${fixedSymbol}${fixedPattern}${lastPart}`;

  return password;
}
export const buildQueryString = (params: SearchParams): string => {
  const queryParams = new URLSearchParams();
  if (params.keyword) queryParams.append("keyword", params.keyword);
  if (params.category_id) queryParams.append("category_id", params.category_id.toString());
  if (params.price_from) queryParams.append("price_from", params.price_from.toString());
  if (params.price_to) queryParams.append("price_to", params.price_to.toString());
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};