import { Action } from '@ngrx/store';

export enum PriceListFormActionTypes {
  UPDATE_FORM = 'UPDATE_FORM',
}

export class UpdatePriceListForm implements Action {
  readonly type = PriceListFormActionTypes.UPDATE_FORM;
  constructor(public payload: any) {
  }
}

export type PriceListFormAction = UpdatePriceListForm;
