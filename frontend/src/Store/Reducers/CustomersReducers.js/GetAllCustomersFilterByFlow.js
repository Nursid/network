import * as constant from '../../Constants/customersConstant';

const initialState = {
    isLoading: false,
    data: [],
    isError: false
}


const GetAllCustomerFilterByFlowReducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.GET_ALL_CUSTOMER_FILTER_BY_FLOW_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case constant.GET_ALL_CUSTOMER_FILTER_BY_FLOW_SUCCESS:
            return {
                ...state,
                data: action.payload,
                isLoading: false,
            }

        case constant.GET_ALL_CUSTOMER_FILTER_BY_FLOW_ERROR:
            return {
                ...state,
                isError: true,
                isLoading: false
            }

        default:
            return state;
    }
}



export default GetAllCustomerFilterByFlowReducer