import React, { useEffect, useState, useContext, Fragment } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import download from 'downloadjs';
import fs from "fs"; 
import { Link } from "react-router-dom";
import * as actions from "../../actions/clientportals";
import useTableClientPortals from "../../components/useTableClientPortal";
//import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
import Select from "react-select";
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
import $ from 'jquery';
import { connect } from "react-redux";
import { clientportals } from "../../reducers/clientportals";
import Controls from "../../components/controls/Controls";
import AddIcon from '@material-ui/icons/Add';
import PopupClientPortal from "../../components/PopupClientPortal";
import PopupClientPortalFileView from "../../components/PopupClientPortalFileView";
import ClientPortalForm from "./ClientPortalForm";
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
    width: "40%"
  },
  ServiceDDL: {
    marginLeft: theme.spacing(15),
    width: "25%",
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
  { id: "username", label: "User" },
  { id: "fileName", label: "File Name" },
  { id: "uploadedDate", label: "Date" },
  { id: "fileSize", label: "File Size" },
  { id: "action", label: "Action", disableSorting: true, align: "right" },
];

const API_URL = 'http://localhost:3000';
const path = require("path");
const ClientPortal = (props) => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState("");
  const [uData, setUsersData] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const[filterFn, setFilterFn] = useState({fn : items => { return items; }});
  const [cpData, setClientPortals] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
   const [openPopupFileView, setOpenPopupFileView] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [recordForView, setRecordForView] = useState(null)
  const [errorMsg, setErrorMsg] = useState('');
  //const {  recordForEdit } = props
  // for delete alert and notification (but not applied. we use ButterToas)
  const [notify, setNotify] = useState({isOpen : false, message : "", type: ""})
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
 // const [servicesData, setServices] = useState([]); // this is for showing service name in table instead of id
//  const [staffsData, setStaffs] = useState([]); // this is for showing staff name in table instead of id
var downloadUrl = "/download/";
const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTableClientPortals(cpData, headCells, filterFn);
  const [users, setUsers] = useState();
  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if(target.value == "")
          return items;
        else 
          return items.filter(x => x.fileName.toLowerCase().includes(target.value))  
      }
    })
  }

  // Extracting teh username that is showed in table
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/users");
      setUsersData(res.data);
      setLoading(false);
    };
    fetchUsers();
    // props.fetchAllServices();
  }, []); //DidMount stop the never ending loop
  //console.log(uData);
  // Populate User DDL
  const fetchUserURL = "http://localhost:4000/users/";
  const getUsers = () => fetch(fetchUserURL).then((res) => res.json());
  useEffect(() => {
   getUsers().then((data) => setUsers(data));
    // console.log(data);
  }, []);

  const optionsUser = [];
  if (users) {
   users.map((user) => {
     if(user.role == "user")
      optionsUser.push({ value: user._id, label: user.username });
    });
  }
  
  
  const addOrEdit = (clientportal, resetForm) => {
          const onSuccess = () => {
            ButterToast.raise({
                content: <Cinnamon.Crisp title="Client Portal Box"
                    content="Submitted successfully"
                    scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                    icon={<AssignmentTurnedIn />}
                />
            })
        }
        if (clientportal._id == 0 || clientportal._id == null) {
          //  window.alert('new record will be inserted')
           //employeeService.insertEmployee(employee)
          props.createClientPortal(clientportal, onSuccess)
        }
           
        else {
            // employeeService.updateEmployee(employee)
            props.updateClientPortal(clientportal._id, clientportal, onSuccess)
        }
            
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        // setRecords(employeeService.getAllEmployees())
       // setServices(props.fetchAllServices);
        
  }
  
  const openInPopup = record => { 
   // window.alert("Edit Modal")
   // console.log(record)
  //  setRecordForView(record);
    setRecordForEdit(record)
    setOpenPopup(true)
  }
  
  // let imagesPreview = function(record, placeToInsertImagePreview) {
  //   if (record) { window.alert("have recod")
  //    // let filesAmount = input.files.length;  //alert("file amount"+filesAmount) bad
  //    // for (let i = 0; i < filesAmount; i++) { bad
  //       let reader = new FileReader();
  //       reader.onload = function(event) {
  //        //  $($.parseHTML("<img style='width:100%'>")) bad
  //        //    .attr("src", event.target.result) abd
  //        //    .appendTo(placeToInsertImagePreview); bad
  //        $($.parseHTML("<img style='width:100%'>"))
  //           .attr("src", event.target.result)
  //           .appendTo(placeToInsertImagePreview);
  //       };
  //       // reader.readAsDataURL(input.files[i]); bad
  //       reader.readAsDataURL(record.fileName);
  //    // }
  //   }
  //  };
  const openInPopupFileView = record => {window.alert("have recod")
    setOpenPopupFileView(true);
    setRecordForView(record);
    console.log(record);
    //let reader = new FileReader();
      //  reader.onload = function(event) {
         //  $($.parseHTML("<img style='width:100%'>")) bad
         //    .attr("src", event.target.result) abd
         //    .appendTo(placeToInsertImagePreview); bad
        //  $($.parseHTML("<img style='width:100%'>"))
        //     .attr("src", record.fileName)
        //     .appendTo($("div#fileViewArea"));
        //     reader.readAsDataURL(event.target.files[0]);
       // };
        // reader.readAsDataURL(input.files[i]); bad
      //  $("div#fileViewArea").append('<img src="img/door-right.png">');
      window.alert($("#fileViewArea").text())
        $("div#fileViewArea").load("This is a message");
    // $("div#fileViewArea").empty();
    //  imagesPreview(this, "div#fileViewArea");
    
     

  }
  const FileView = record => {//window.alert("have recod")
  //setOpenPopupFileView(true);
  //setRecordForView(record);
  console.log(record);
    var filepath = "http://localhost:3000/"+record.fileName;
      $("div.previewFile").html($("<img>").attr("src", filepath));
  }
  const onSuccess = () => {
    ButterToast.raise({
        content: <Cinnamon.Crisp title="Client Portal Box"
            content="Deleted successfully"
            scheme={Cinnamon.Crisp.SCHEME_PURPLE}
            icon={<AssignmentTurnedIn />}
        />
    })
 
}
  const onDelete = _id => {//window.alert(_id)
    if(window.confirm('Are you sure you want to delete ? ')){
      props.deleteClientPortal(_id, onSuccess)
      // var path = "../uploads\Employee-id-145-CRC-300x200.png"
      // removeTmp(path)
    }    
}
// const removeTmp = (path) => {
//   fs.unlinkSync(path, err => {
//     if(err)
//       throw err;
//   })
// }
const downloadFile = record => {
  try {
    axios({
      url: record.fileName,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', record.fileName);
      document.body.appendChild(link);
      link.click();
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      setErrorMsg('Error while downloading file. Try again later');
    }
  }
};
  return (
    <div className="appointment-service-section" style={{ marginLeft: "20px" }}>
      <div className="row m-0">
        {/* <Paper className={classes.pageContent}> */}
        <Paper className={useStyles().pageContent}>
          <Toolbar>
            <Controls.Input label ="Search File"  className={classes.searchInput}
            InputProps ={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>)
            }} 
            onChange={handleSearch}
            />
            {
            user.role !="user" ?
              <Select
                    name="userId"
                    className={classes.ServiceDDL}
                  onChange={e => setSelectedUser(e)}
                    value={selectedUser}
                    // error={errors.userId}
                    required
                    displayEmpty
                    options={optionsUser}
                    isSearchable required
                    placeholder="Load Docs By User"
                  />: ""
          
            }
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
              {
                // (selectedUser.value == '')?'selected not user' : console.log(selectedUser.value)+
                recordsAfterPagingAndSorting().map((record, index) => (
                  //  var totalSizeKB = totalsize / Math.pow(1024,1)
                  /*
                  if(selectedUser) {
              if(selectedUser.value != ""){
                console.log(selectedUser.label)
              }
            }
                  */
                
                  (record.userId == user._id || user.role == "admin" || user.role == "staff")?
                  <TableRow key={record.id} className = {classes.rowStyle}>
                  <TableCell className = {classes.rowStyle}>{
                  // (record.userId == user._id) ? user.username:''
                  uData.map((data, index) => {
                   // var username = '';
                   return (data._id == record.userId) ? data.username : ''
                  //  return (data._id == record.userId) ? username = data.username : ''
                  })
                  }</TableCell>
                  <TableCell className = {classes.rowStyle}>{
                  record.fileName.substring(11)
                  }</TableCell>
                  <TableCell className = {classes.rowStyle}>{
                    new Date(record.uploadedDate).toISOString().substring(0, 10)
                  
                  }</TableCell>
                  <TableCell className = {classes.rowStyle}>{
                  
                  Math.floor(record.fileSize / Math.pow(1024,1))+" kb"
                  }</TableCell>
                  
                  <TableCell className = {classes.lastTableCell}>
                      {/* <Controls.ActionButton color = "primary">
                        <EditOutLinedIcon style={{ fontSize: 15 }} 
                        onClick={() => {openInPopup(record)}} />
                      </Controls.ActionButton> */}
                      <Controls.ActionButton>
                      {/* <i class="fa fa-eye" onClick={() => {openInPopupFileView(record)}} aria-hidden="true"></i> */}
                      <i className="fa fa-eye" onClick={() => {FileView(record)}} aria-hidden="true"></i>
                      </Controls.ActionButton>
                      
                      <Controls.ActionButton
                      >
                        <i className="fa fa-arrow-down" aria-hidden="true" onClick={() =>
                        downloadFile(record)
                      }></i>
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
                  </TableRow> : ''
                ))
              }
            </TableBody>
            <TblPagination />
          </TblContainer>
          <Paper>
          <div className="previewFile" style={{"text-align":"center"}}></div>
        </Paper>
        </Paper>
        
        
        <PopupClientPortal title="Client Portal Form"
          openPopup = {openPopup}
          setOpenPopup = {setOpenPopup}
        >
           <ClientPortalForm 
           recordForEdit = {recordForEdit}
           addOrEdit={addOrEdit}
           />
        </PopupClientPortal>
        <PopupClientPortalFileView title="File View"
          openPopupFileView = {openPopupFileView}
          setOpenPopupFileView = {setOpenPopupFileView}
        >
          <div id="fileViewArea">
            
          </div>
           
        </PopupClientPortalFileView>
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
  clientPortalList: state.clientportals.list,
});
const mapActionToProps = {
  fetchAll: actions.fetchAll,
  createClientPortal: actions.create,
  updateClientPortal: actions.update,
  deleteClientPortal: actions.Delete
};
// props.fetchAllServices
export default connect(mapStateToProps,mapActionToProps)(ClientPortal);
