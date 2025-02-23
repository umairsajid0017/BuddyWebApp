export enum BookingStatus {
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
