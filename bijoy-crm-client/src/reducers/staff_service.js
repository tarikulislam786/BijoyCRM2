import { ACTION_TYPES } from "../actions/staff_service";
const initialState = {
    list: []
}
//Staff.list
export const staff_service = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL:
            return {
                ...state,
                list: [...action.payload]
            } 
        case ACTION_TYPES.CREATE:
            return {
                ...state,
                list: [...state.list, action.payload]
            }
        /*case ACTION_TYPES.UPDATE:
            return {
                ...state,
                list: state.list.map(x => x._id == action.payload._id ? action.payload : x)
            }*/

        case ACTION_TYPES.DELETE:
            return {
                ...state,
                list:state.list.filter(x => x._id != action.payload)
            }

        default:
            return state;
    }
}