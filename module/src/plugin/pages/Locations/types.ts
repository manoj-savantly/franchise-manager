import { dateTime } from '@savantly/sprout-api';
import { FranchiseFee } from './Fees/feeEntity';

export interface FranchiseBar {
  id: string;
  standalone: boolean;
  linearFeet: Number;
  beer: boolean;
  liquor: boolean;
}

export interface FranchisePatio {
  id: string;
  totalSquareFeet: Number;
}

export class FranchiseBuilding {
  totalSquareFeet: Number = 0;
  fohSquareFeet: Number = 0;
  bohSquareFeet: Number = 0;
  maxOccupancy: Number = 0;
  maxSeating: Number = 0;
  leaseSignDate = dateTime().format('YYYY-MM-DD');
}

export class FranchiseHoursOfOperation {
  sundayOpen = '';
  sundayClose = '';
  mondayOpen = '';
  mondayClose = '';
  tuesdayOpen = '';
  tuesdayClose = '';
  wednesdayOpen = '';
  wednesdayClose = '';
  thursdayOpen = '';
  thursdayClose = '';
  fridayOpen = '';
  fridayClose = '';
  saturdayOpen = '';
  saturdayClose = '';
}

export interface FranchiseHoursOfOperationModifier {
  id: string;
  dateToModify: Date;
  openTime: Date;
  closeTime: Date;
}

export class FranchisePOS {
  physicalTerminals: Number = 0;
  virtualTerminals: Number = 0;
}

export interface FranchiseLocationMember {
  itemId?: string;
  userId?: string;
  locationId?: string;
  role: 'COACH' | 'STAFF' | 'OWNER';
}

export class FranchiseLocation {
  id = '';
  // @Size(max = 100)
  name = '';
  // @Size(max = 100)
  country = '';
  // @Size(max = 100)
  address1 = '';
  // @Size(max = 100)
  address2 = '';
  // @Size(max = 100)
  city = '';
  // @Size(max = 100)
  state = '';
  // @Size(max = 20)
  zip = '';
  concept = 'TRADITIONAL';
  locationType = 'STANDALONE';
  // @Size(max = 100)
  marketId = '';
  phoneNumber: Number = 0;
  bars: FranchiseBar[] = [];
  patios: FranchisePatio[] = [];
  building: FranchiseBuilding = new FranchiseBuilding();
  hours: FranchiseHoursOfOperation = new FranchiseHoursOfOperation();
  modifiedHours: FranchiseHoursOfOperationModifier[] = [];
  pos: FranchisePOS = new FranchisePOS();
  members: FranchiseLocationMember[] = [];
  fees: FranchiseFee[] = [];
}

export interface FranchiseLocationState {
  locations: FranchiseLocation[];
  isFetching: boolean;
  isFetched: boolean;
  error?: string;
}
