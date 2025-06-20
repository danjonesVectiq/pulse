
export enum AvailabilityStatus {
  OPERATIONAL = 'Operational',
  DEGRADED = 'Degraded Performance',
  PARTIAL_OUTAGE = 'Partial Outage',
  FULL_OUTAGE = 'Full Outage',
  MAINTENANCE = 'Scheduled Maintenance',
  UNKNOWN = 'Unknown',
}

export interface Category {
  id: string;
  name: string;
}

export interface System {
  id: string;
  name: string;
  categoryId: string;
}

export interface StatusEntry {
  id: string;
  systemId: string;
  date: string; // YYYY-MM-DD
  status: AvailabilityStatus;
  description: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}
    