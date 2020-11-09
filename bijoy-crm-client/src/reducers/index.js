import { combineReducers } from "redux";
import { services } from "./services";
import { customers } from "./customers";
import { staffs } from "./staffs";
import { appointments } from "./appointments";
import { clientportals } from "./clientportals";
export const reducers = combineReducers({
    services,
    staffs,
    customers,
    appointments,
    clientportals
})