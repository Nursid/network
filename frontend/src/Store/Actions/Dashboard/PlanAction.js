import axios from "axios"
import * as constant from "../../Constants/Dashboard/ServicesConstant"
import { API_URL } from "../../../config"

export const GetAllPlan = () => {
    return async (dispatch) => {
        dispatch({ type: constant.PLAN_GET_API_LOADING })
        try {
            const response = await axios.get(API_URL + "/plan/getall")
            if (response.status === 200) {
                dispatch({ type: constant.PLAN_GET_API_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.PLAN_GET_API_ERROR })
        }
    }
}

export const UpdatePlan = (id, data) => {
    return async (dispatch) => {
        dispatch({ type: constant.PLAN_UPDATE_API_LOADING })
        try {
            const response = await axios.post(API_URL + "/plan/update/" + id, data)
            if (response.status === 200) {
                dispatch({ type: constant.PLAN_UPDATE_API_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.PLAN_UPDATE_API_ERROR })
        }
    }   
}

export const DeletePlan = (id) => {
    return async (dispatch) => {
        dispatch({ type: constant.PLAN_DELETE_API_LOADING })
        try {
            const response = await axios.delete(API_URL + "/plan/delete/" + id)
            if (response.status === 200) {
                dispatch({ type: constant.PLAN_DELETE_API_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.PLAN_DELETE_API_ERROR })
        }
    }
}
