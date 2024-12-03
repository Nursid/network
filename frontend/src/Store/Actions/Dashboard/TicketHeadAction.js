import axios from "axios"
import * as constant from "../../Constants/Dashboard/ServicesConstant"
import { API_URL } from "../../../config"

export const GetAllTicketHead = () => {
    return async (dispatch) => {
        dispatch({ type: constant.TICKET_HEAD_GET_API_LOADING })
        try {
            const response = await axios.get(API_URL + "/api/ticket-head/getall")
            if (response.status === 200) {
                dispatch({ type: constant.TICKET_HEAD_GET_API_SUCCESS, payload: response.data })
            }
        } catch (error) {
            dispatch({ type: constant.TICKET_HEAD_GET_API_ERROR })
        }
    }
}
