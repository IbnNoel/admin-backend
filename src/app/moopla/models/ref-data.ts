import { Local } from './local';
import { PriceList } from './price-list';
export interface RefData {
  _id: string;
  country: string;
  currencyCode: string;
  rentPeriod: string[];
  priceList_id: string;
  local: Local;
  priceList: PriceList;
}
