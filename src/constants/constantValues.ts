export const CURRENCY = "OMR";

export enum LoginType {
  MANUAL = "manual",
  GOOGLE = "google",
  GUEST = "guest",
}

export enum RoleType {
  CUSTOMER = "customer",
  WORKER = "worker",
}


export enum BidStatus {
  OPEN = 1,
  CLOSED = 2,
  CANCELED = 3,
  PENDING = 4,
  CONFIRMED = 5,
  STARTED = 6,
  COMPLETED = 7,
  CANCELED_BY_WORKER = 8,
  CANCELED_BY_CUSTOMER = 9,
  DECLINED = 10,
  WORKER_IS_ON_HIS_WAY = 11,
  WORKER_IS_ON_YOUR_DOORSTEP = 12,
  WORKER_HAS_STARTED_THE_WORK = 13,
  TIMEOUT_CANCELED = 14,
  NOT_STARTED = 15,
}

export enum BookingStatus {
  OPEN = 1,
  CLOSED = 2,
  CANCELED = 10,
  PENDING = 4,
  CONFIRMED = 5,
  STARTED = 6,
  COMPLETED = 7,
  CANCELED_BY_WORKER = 8,
  CANCELED_BY_CUSTOMER = 9,
  DECLINED = 10,
  WORKER_IS_ON_HIS_WAY = 11,
  WORKER_IS_ON_YOUR_DOORSTEP = 12,
  WORKER_HAS_STARTED_THE_WORK = 13,
  TIMEOUT_CANCELED = 14,
  NOT_STARTED = 15,
}


export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  CANCELLED = "cancelled",
}
