import axios from "axios";

const baseUrl = 'http://localhost:4000/'

export default {
    services(url = baseUrl + 'services/') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
            delete: id => axios.delete(url + id)
        }
    },
    customers(url = baseUrl + 'customers/') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
            delete: id => axios.delete(url + id)
        }
    },
    staffs(url = baseUrl + 'staffs/') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
            delete: id => axios.delete(url + id)
        }
    },
    // 
    staff_service(url = baseUrl + 'staff_service/') {
        return {
           // fetchAll: () => axios.get(url),
           // fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
           // update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
           delete: StaffId => axios.delete(url + StaffId)
        }
    },
    appointments(url = baseUrl + 'appointments/') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
            delete: id => axios.delete(url + id)
        }
    },
    clientportals(url = baseUrl + 'clientportals/') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
            delete: id => axios.delete(url + id)
        }
    },
}