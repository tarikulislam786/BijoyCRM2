import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
//import Service from "../pages/Services/Service";
import * as actions from "../../actions/customers";
import useTableCustomer from "../../components/useTableCustomer";
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
import { customers } from "../../reducers/customers";
import Controls from "../../components/controls/Controls";
import AddIcon from '@material-ui/icons/Add';
import PopupCustomer from "../../components/PopupCustomer";
import CustomerForm from "./CustomerForm";
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
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "mobile", label: "Mobile" },
  { id: "action", label: "Action", disableSorting: true, align: "right" },
];
//const [servicesData, setServices] = useState([]);


const Customer = (props) => {
  const classes = useStyles();
  const[filterFn, setFilterFn] = useState({fn : items => { return items; }});
  const [cData, setCustomersData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  //const [records, setRecords] = useState(employeeService.getAllEmployees())
  const [recordForEdit, setRecordForEdit] = useState(null)
  //const {  recordForEdit } = props
  // for delete alert and notification (but not applied. we use ButterToas)
  const [notify, setNotify] = useState({isOpen : false, message : "", type: ""})
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTableCustomer(cData, headCells, filterFn);
 
  var {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
} = useForm(props.setCurrentId) 

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

  const openInPopup = record => { 
   // window.alert("Edit Modal")
    //console.log(record)
    
    setRecordForEdit(record)
    setOpenPopup(true)
  }
  const onSuccess = () => {
    ButterToast.raise({
        content: <Cinnamon.Crisp title="Service Box"
            content="Deleted successfully"
            scheme={Cinnamon.Crisp.SCHEME_PURPLE}
            icon={<AssignmentTurnedIn />}
        />
    })
 
}
  const onDelete = _id => {
    if(window.confirm('Are you sure you want to delete ? ')){
  /*setConfirmDialog({
        ...confirmDialog,
        isOpen: false
    }) */
    props.deleteCustomer(_id, onSuccess)
    window.location.reload();
    //employeeService.deleteEmployee(id);
    //setRecords(employeeService.getAllEmployees())
  /*  setNotify({
        isOpen: true,
        message: 'Deleted Successfully',
        type: 'error'
    }) */
    
    }
  
}
  return (
    <div className="appointment-service-section" style={{ marginLeft: "20px" }}>
      <div className="row m-0">
        {/* <Paper className={classes.pageContent}> */}
        <Paper className={useStyles().pageContent}>
          <Toolbar>
            <Controls.Input label ="Search Customers"  className={classes.searchInput}
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
                <TableCell className = {classes.rowStyle}>{record.name}</TableCell>
                <TableCell className = {classes.rowStyle}>{record.email}</TableCell>
                <TableCell className = {classes.rowStyle}>{record.mobile}</TableCell>
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
        <PopupCustomer title="Customer Form"
          openPopup = {openPopup}
          setOpenPopup = {setOpenPopup}
        >
           <CustomerForm 
           recordForEdit = {recordForEdit}
           />
        </PopupCustomer>
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
  customerList: state.customers.list,
});
const mapActionToProps = {
  fetchAllCustomers: actions.fetchAll,
  createCustomer: actions.create,
  updateCustomer: actions.update,
  deleteCustomer: actions.Delete
};
// props.fetchAllCustomers
//export default connect(mapStateToPropsCustomer,mapActionToPropsCustomer)(Customer);
export default connect(mapStateToProps, mapActionToProps)(Customer);
