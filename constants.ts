
import { AvailabilityStatus, Category, System, StatusEntry } from './types';
import { ChartBarIcon, CogIcon, DocumentChartBarIcon, InformationCircleIcon, PlusCircleIcon, TableCellsIcon } from './components/icons/Icons';

export const STATUS_COLORS: Record<AvailabilityStatus, string> = {
  [AvailabilityStatus.OPERATIONAL]: 'bg-green-500',
  [AvailabilityStatus.DEGRADED]: 'bg-yellow-500',
  [AvailabilityStatus.PARTIAL_OUTAGE]: 'bg-orange-500',
  [AvailabilityStatus.FULL_OUTAGE]: 'bg-red-500',
  [AvailabilityStatus.MAINTENANCE]: 'bg-blue-500',
  [AvailabilityStatus.UNKNOWN]: 'bg-gray-400',
};

export const STATUS_TEXT_COLORS: Record<AvailabilityStatus, string> = {
  [AvailabilityStatus.OPERATIONAL]: 'text-green-700',
  [AvailabilityStatus.DEGRADED]: 'text-yellow-700',
  [AvailabilityStatus.PARTIAL_OUTAGE]: 'text-orange-700',
  [AvailabilityStatus.FULL_OUTAGE]: 'text-red-700',
  [AvailabilityStatus.MAINTENANCE]: 'text-blue-700',
  [AvailabilityStatus.UNKNOWN]: 'text-gray-300',
};

export const AVAILABILITY_STATUS_OPTIONS = Object.values(AvailabilityStatus).filter(status => status !== AvailabilityStatus.UNKNOWN);

export const NAVIGATION_LINKS = [
  { name: 'Dashboard', path: '/', icon: ChartBarIcon },
  { name: 'Log Status', path: '/entry', icon: PlusCircleIcon },
  { name: 'Systems Configuration', path: '/manage', icon: CogIcon },
];

export const APP_TITLE = "System Pulse";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Core Services' },
  { id: 'cat2', name: 'Customer Facing APIs' },
  { id: 'cat3', name: 'Internal Tools' },
];

export const DEFAULT_SYSTEMS: System[] = [
  { id: 'sys1', name: 'Authentication Service', categoryId: 'cat1' },
  { id: 'sys2', name: 'Payment Gateway', categoryId: 'cat1' },
  { id: 'sys3', name: 'Product API', categoryId: 'cat2' },
  { id: 'sys4', name: 'User Profile API', categoryId: 'cat2' },
  { id: 'sys5', name: 'Admin Portal', categoryId: 'cat3' },
];

// Sample status entries for initial view
export const DEFAULT_STATUS_ENTRIES: StatusEntry[] = [
    { id: 'entry1', systemId: 'sys1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: AvailabilityStatus.OPERATIONAL, description: 'System fully operational.' },
    { id: 'entry2', systemId: 'sys1', date: new Date().toISOString().split('T')[0], status: AvailabilityStatus.OPERATIONAL, description: 'Continued operational status.' },
    { id: 'entry3', systemId: 'sys2', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: AvailabilityStatus.DEGRADED, description: 'Experiencing slight delays.' },
    { id: 'entry4', systemId: 'sys2', date: new Date().toISOString().split('T')[0], status: AvailabilityStatus.OPERATIONAL, description: 'Degradation resolved.' },
    { id: 'entry5', systemId: 'sys3', date: new Date().toISOString().split('T')[0], status: AvailabilityStatus.MAINTENANCE, description: 'Scheduled maintenance window.' },
    { id: 'entry6', systemId: 'sys4', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: AvailabilityStatus.OPERATIONAL, description: 'Initial status.' },
];
