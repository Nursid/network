import axios from 'axios'
import * as constant from '../../../Constants/customersConstant'
import { API_URL } from '../../../../config'



export const GetAllCustomers = () => {
    return async (dispatch) => {
        dispatch({ type: constant.GET_ALL_CUSTOMER_LOADING })
        try {
            const response = await axios.get(API_URL + '/customer/getall')
            if (response.status === 200) {
                dispatch({ type: constant.GET_ALL_CUSTOMER_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.GET_ALL_CUSTOMER_ERROR })
        }
    }
}

export const GetAllCustomersFilterByFlow = () => {
    return async (dispatch) => {
        dispatch({ type: constant.GET_ALL_CUSTOMER_FILTER_BY_FLOW_LOADING })
        try {
            const response = await axios.get(API_URL + '/customer/getallcustomerfilterbyflow')
            if (response.status === 200) {
                dispatch({ type: constant.GET_ALL_CUSTOMER_FILTER_BY_FLOW_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.GET_ALL_CUSTOMER_FILTER_BY_FLOW_ERROR })
        }
    }
}



// get update the customer 
export const GetUpdateTheCustomer = (id, formdata) => {
    return async (dispatch) => {
        dispatch({ type: constant.GET_CUSTOMER_UPDATE_LOADING })
        try {
            const response = await axios.put(API_URL + '/customer/getupdate/' + id, formdata, { method: 'PUT' })
            if (response.status === 200) {
                dispatch({ type: constant.GET_CUSTOMER_UPDATE_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.GET_CUSTOMER_UPDATE_ERROR })
        }
    }
}

// get update the customer 
export const createTheCustomer = (formdata) => {
    return async (dispatch) => {
        dispatch({ type: constant.GET_CUSTOMER_CREATE_LOADING })
        try {
            const response = await axios.post(API_URL + '/create/new/customer', formdata)
            if (response.status === 200) {
                dispatch({ type: constant.GET_CUSTOMER_CREATE_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.GET_CUSTOMER_CREATE_ERROR })
        }
    }
}


export const GetAllEnquiry = () => {
    return async (dispatch) => {
        dispatch({ type: constant.GET_ALL_Enquiry_LOADING })
        try {
            const response = await axios.get(API_URL + '/enquiry/getall')
            if (response.status === 200) {
                dispatch({ type: constant.GET_ALL_Enquiry_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.GET_ALL_Enquiry_ERROR })
        }
    }
}

export const GetAllLastServices = () => {
    return async (dispatch) => {
        dispatch({ type: constant.GET_ALL_LASTSERVICES_LOADING })
        try {
            const response = await axios.get(API_URL + '/order/get-last-service')
            if (response.status === 200) {

                dispatch({ type: constant.GET_ALL_LASTSERVICES_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.GET_ALL_LASTSERVICES_ERROR })
        }
    }
}




export const GetAllMembers = () => {
    return async (dispatch) => {
        dispatch({ type: constant.GET_ALL_Members_LOADING })
        try {
            const response = await axios.get(API_URL + '/members/getall')
            if (response.status === 200) {
                dispatch({ type: constant.GET_ALL_Members_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.GET_ALL_Members_ERROR })
        }
    }
}

export const FilterCustomers = (filterData) => {
    return async (dispatch) => {
        dispatch({ type: constant.FILTER_CUSTOMERS_LOADING })
        try {
            const response = await axios.post(API_URL + '/customer/filter', filterData)
            if (response.status === 200) {
                dispatch({ type: constant.FILTER_CUSTOMERS_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.FILTER_CUSTOMERS_ERROR })
        }
    }
}

export const DynamicFilterCustomers = (filterData) => {
    return async (dispatch) => {
        dispatch({ type: constant.FILTER_CUSTOMERS_LOADING })
        try {
            const response = await axios.post(API_URL + '/customer/dynamicfilter', filterData)
            if (response.status === 200) {
                dispatch({ type: constant.FILTER_CUSTOMERS_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.FILTER_CUSTOMERS_ERROR })
        }
    }
}

















