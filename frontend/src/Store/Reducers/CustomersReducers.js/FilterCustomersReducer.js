import * as constant from '../../Constants/customersConstant';

const initialState = {
    isLoading: false,
    data: [],
    isError: false,
    count: 0
}

const FilterCustomersReducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.FILTER_CUSTOMERS_LOADING:
            return {
                ...state,
                isLoading: true,
                isError: false
            }
        case constant.FILTER_CUSTOMERS_SUCCESS:
            return {
                ...state,
                data: action.payload,
                count: action.payload.count || 0,
                isLoading: false,
                isError: false
            }
        case constant.FILTER_CUSTOMERS_ERROR:
            return {
                ...state,
                isError: true,
                isLoading: false,
                data: [],
                count: 0
            }
        default:
            return state;
    }
}

export default FilterCustomersReducer 