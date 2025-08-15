import * as constant from '../../Constants/customersConstant';

const initialState = {
    // All reminders
    allReminders: {
        isLoading: false,
        data: [],
        isError: false
    },
    // Reminders by customer ID
    remindersByCustomer: {
        isLoading: false,
        data: [],
        isError: false
    },
    // Set reminder
    setReminder: {
        isLoading: false,
        data: null,
        isError: false
    }
}

const ReminderReducer = (state = initialState, action) => {
    switch (action.type) {
        // Get All Reminders
        case constant.GET_ALL_REMINDER_LOADING:
            return {
                ...state,
                allReminders: {
                    ...state.allReminders,
                    isLoading: true,
                    isError: false
                }
            }
        case constant.GET_ALL_REMINDER_SUCCESS:
            return {
                ...state,
                allReminders: {
                    ...state.allReminders,
                    data: action.payload,
                    isLoading: false,
                    isError: false
                }
            }
        case constant.GET_ALL_REMINDER_ERROR:
            return {
                ...state,
                allReminders: {
                    ...state.allReminders,
                    isError: true,
                    isLoading: false
                }
            }

        // Get Reminders by Customer ID
        case constant.GET_REMINDER_BY_ID_LOADING:
            return {
                ...state,
                remindersByCustomer: {
                    ...state.remindersByCustomer,
                    isLoading: true,
                    isError: false
                }
            }
        case constant.GET_REMINDER_BY_ID_SUCCESS:
            return {
                ...state,
                remindersByCustomer: {
                    ...state.remindersByCustomer,
                    data: action.payload,
                    isLoading: false,
                    isError: false
                }
            }
        case constant.GET_REMINDER_BY_ID_ERROR:
            return {
                ...state,
                remindersByCustomer: {
                    ...state.remindersByCustomer,
                    isError: true,
                    isLoading: false
                }
            }

        // Set Reminder
        case constant.SET_REMINDER_LOADING:
            return {
                ...state,
                setReminder: {
                    ...state.setReminder,
                    isLoading: true,
                    isError: false
                }
            }
        case constant.SET_REMINDER_SUCCESS:
            return {
                ...state,
                setReminder: {
                    ...state.setReminder,
                    data: action.payload,
                    isLoading: false,
                    isError: false
                }
            }
        case constant.SET_REMINDER_ERROR:
            return {
                ...state,
                setReminder: {
                    ...state.setReminder,
                    isError: true,
                    isLoading: false
                }
            }

        default:
            return state;
    }
}

export default ReminderReducer
