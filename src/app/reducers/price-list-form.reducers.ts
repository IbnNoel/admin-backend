import { PriceList } from '../moopla/models/price-list';
import { PriceListFormAction, PriceListFormActionTypes } from '../state/models/price-list-form.actions';

export interface PriceListFormState {
    priceList: PriceList;
}

export const ForminitialState: PriceListFormState = {
    priceList: {
        _id: '',
        rentRange: [],
        saleRange: []
    },
};
export function PriceListReducer(
    state: PriceListFormState = ForminitialState,
    action: PriceListFormAction) {

    switch (action.type) {
        case PriceListFormActionTypes.UPDATE_FORM:
            return {
                state,
                priceList: action.payload
            };
        default:
            return state;
    }
}
