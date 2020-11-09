import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as actions from "../../actions/appointments";
import useTableAppointments from "../../components/useTableAppointment";
//import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
import {
  Paper,
  makeStyles,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Table,
  Toolbar, InputAdornment
} from "@material-ui/core";
import {Search} from '@material-ui/icons';
import { connect } from "react-redux";
import { appointments } from "../../reducers/appointments";
import Controls from "../../components/controls/Controls";
import AddIcon from '@material-ui/icons/Add';
import Popup from "../../components/Popup";
import AppointmentForm from "./AppointmentForm";
import { useForm, Form } from '../../components/useForm';
import EditOutLinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
//export default function Service() {
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%"
  },
  newButton: {
    position: "absolute",
    right: "10px"
  },
  rowStyle: {
    height: "10px", padding: "0px 0px 0px 5px"
  },
  lastTableCell: {
    textAlign: "right",
    height: "10px", padding: "0px 0px 0px 5px",
  }
}));
const headCells = [
  { id: "startDateTime", label: "Start DateTime" },
  { id: "serviceId", label: "Service" },
  { id: "staffId", label: "Staff" },
  { id: "status", label: "Status" },
  { id: "action", label: "Action", disableSorting: true, align: "right" },
];



const Appointment = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const[filterFn, setFilterFn] = useState({fn : items => { return items; }});
  const [aData, setAppointments] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null)
  //const {  recordForEdit } = props
  // for delete alert and notification (but not applied. we use ButterToas)
  const [notify, setNotify] = useState({isOpen : false, message : "", type: ""})
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const [servicesData, setServices] = useState([]); // this is for showing service name in table instead of id
  const [staffsData, setStaffs] = useState([]); // this is for showing staff name in table instead of id
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTableAppointments(aData, headCells, filterFn);

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if(target.value == "")
          return items;
        else 
          return items.filter(x => x.name.toLowerCase().includes(target.value))  
      }
    })
  }
  const addOrEdit = (appointment, resetForm) => {
          const onSuccess = () => {
            ButterToast.raise({
                content: <Cinnamon.Crisp title="Appointment Box"
                    content="Submitted successfully"
                    scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                    icon={<AssignmentTurnedIn />}
                />
            })
        }
        if (appointment._id == 0 || appointment._id == null) {
          //  window.alert('new record will be inserted')
           //employeeService.insertEmployee(employee)
          props.createAppointment(appointment, onSuccess)
          window.location.reload();
        }
           
        else {
            // employeeService.updateEmployee(employee)
            props.updateAppointment(appointment._id, appointment, onSuccess)
            window.location.reload();
        }
            
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        // setRecords(employeeService.getAllEmployees())
       // setServices(props.fetchAllServices);
        
  }
  // this useEffect is for showing service name in table instead of id
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/services");
      setServices(res.data);
      //console.log(res.data)
      setLoading(false);
    };
    fetchServices();
    // props.fetchAllServices();
  }, []);

  // this useEffect is for showing staff name in table instead of id
  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/staffs");
      setStaffs(res.data);
      //console.log(res.data)
      setLoading(false);
    };
    fetchStaffs();
    // props.fetchAllServices();
  }, []);
  const openInPopup = record => { 
   // window.alert("Edit Modal")
    console.log(record)
    
    setRecordForEdit(record)
    setOpenPopup(true)
  }
  const onSuccess = () => {
    ButterToast.raise({
        content: <Cinnamon.Crisp title="Appointment Box"
            content="Deleted successfully"
            scheme={Cinnamon.Crisp.SCHEME_PURPLE}
            icon={<AssignmentTurnedIn />}
        />
    })
 
}
  const onDelete = _id => {
    if(window.confirm('Are you sure you want to delete ? ')){
      props.deleteAppointment(_id, onSuccess)
      window.location.reload();
    }
}
  return (
    <div className="appointment-service-section" style={{ marginLeft: "20px" }}>
      <div className="row m-0">
        {/* <Paper className={classes.pageContent}> */}
        <Paper className={useStyles().pageContent}>
          <Toolbar>
            <Controls.Input label ="Search Appointment"  className={classes.searchInput}
            InputProps ={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>)
            }} 
            onChange={handleSearch}
            />
            <Controls.Button
            className={classes.newButton}
            text = "Add New"
            variant = "outlined"
            startIcon = {<AddIcon />}
             onClick = {() => {setOpenPopup(true);setRecordForEdit(null);}}
            />
          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {/* {props.serviceList.map((record, index) => {
             return(
               record.name
             )
           })}  */}
              {/* {props.serviceList.map((record, index) => ( */}
              {recordsAfterPagingAndSorting().map((record, index) => (
                <TableRow key={record.id} className = {classes.rowStyle}>
                <TableCell className = {classes.rowStyle}>{record.startDateTime}</TableCell>
                <TableCell className = {classes.rowStyle}>
                {servicesData.map((servicename, index) => ((servicename._id ===record.serviceId ? servicename.name : '') ))
                  // {record.serviceId}
                }
                  </TableCell>
                
                <TableCell className = {classes.rowStyle}>
                {
                staffsData.map((staffname, index) => ((staffname._id ===record.staffId ? staffname.name : '') ))
                }
                  {/* {record.staffId} */}
                  </TableCell>
                <TableCell className = {classes.rowStyle}>{record.status}</TableCell>
                <TableCell className = {classes.lastTableCell}>
                    <Controls.ActionButton color = "primary">
                      <EditOutLinedIcon style={{ fontSize: 15 }} 
                      onClick={() => {openInPopup(record)}} />
                    </Controls.ActionButton>
                    <Controls.ActionButton 
                    color = "secondary"
                    onClick={() => {
                      onDelete(record._id)
                    }}
                    >
                      <CloseIcon style={{ fontSize: 15 }} />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TblPagination />
          </TblContainer>
        </Paper>
        <Popup title="Appointment Form"
          openPopup = {openPopup}
          setOpenPopup = {setOpenPopup}
        >
           <AppointmentForm 
           recordForEdit = {recordForEdit}
           addOrEdit={addOrEdit}
           />
        </Popup>
        {/* <Notification 
        notify = {notify}
        setNotify = {setNotify}
        /> */}
        <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  appointmentList: state.appointments.list,
});
const mapActionToProps = {
  fetchAll: actions.fetchAll,
  createAppointment: actions.create,
  updateAppointment: actions.update,
  deleteAppointment: actions.Delete
};
// props.fetchAllServices
export default connect(mapStateToProps,mapActionToProps)(Appointment);
