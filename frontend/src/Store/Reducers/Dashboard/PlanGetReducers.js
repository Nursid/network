import * as constant from "../../Constants/Dashboard/ServicesConstant"

const initialState = {
    isLoading: false,
    isSuccess: false,
    data: [],
    isError: false
}


const GetAllPlanReducer = (state = initialState, action) => {
    switch (action.type) {
        case constant.PLAN_GET_API_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case constant.PLAN_GET_API_SUCCESS:
            return {
                ...state,
                isSuccess: true,
                data: action.payload
            }
        case constant.PLAN_GET_API_ERROR:
            return {
                ...state,
                isError: true
            }

        default:
            return state
    }
}


export default GetAllPlanReducer
