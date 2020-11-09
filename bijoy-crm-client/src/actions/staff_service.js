
import api from "./api.js";
export const ACTION_TYPES = {
    CREATE: 'CREATE',
  //  UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    FETCH_ALL: 'FETCH_ALL'
}

export const fetchAll = () => dispatch => {
    api.staff_service().fetchAll()
    .then(res => {
      //  console.log(res);
        dispatch({
            type: ACTION_TYPES.FETCH_ALL,
            payload: res.data
        })
    })
    .catch(err => console.log(err))
} 
export const create = (data, onSuccess) => dispatch => {
    api.staff_service().create(data)
        .then(res =>{
            dispatch({
                type: ACTION_TYPES.CREATE,
                payload: res.data
            })
            onSuccess()
        })
        .catch(err => console.log(err))
}

/* export const update = (id,data, onSuccess) => dispatch => {
    api.staffs().update(id,data)
        .then(res =>{
            dispatch({
                type: ACTION_TYPES.UPDATE,
                payload: res.data
            })
            onSuccess()
        })
        .catch(err => console.log(err))
} */

 export const Delete = (StaffId, onSuccess) => dispatch => {
    api.staff_service().delete(StaffId)
        .then(res =>{
            dispatch({
                type: ACTION_TYPES.DELETE,
                payload: StaffId
            })
            onSuccess()
        })
        .catch(err => console.log(err))
} 