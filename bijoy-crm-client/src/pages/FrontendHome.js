import React, { Component,useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, makeStyles, MenuItem, TextField, Paper } from "@material-ui/core";
import Controls from "../components/controls/Controls";
import { useForm, Form } from "../components/useForm";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import * as actions from "../actions/appointments";
import * as actionService from "../actions/services";

import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
import axios from "axios";
import Cookie from "js-cookie";
const initialFValues = {
    id: 0,
    startDateTime: '',
    endDateTime: '',
    serviceId: '',
    staffId: '',
    notes: '',
    status: ''
  };
  const useStyles = makeStyles((theme) => ({
    searviceInput: {
      width: "100%",
    },
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
      },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      width: 200,
      height: 230,
      backgroundColor: theme.palette.background.paper,
      overflow: "auto",
    },
    ServiceDDL: {
      width: "100%",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: 200,
    },
  }));

  const FrontendHome = (props) => {
    const [openPopup, setOpenPopup] = useState(false);
    // const [selectedOption, setSelectedOption] = useState("none");
    const [selectedService, setSelectedService] = useState("");
    const [selectedStaff, setSelectedStaff] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [startDateTime, setStartDateTime] = useState("");
    const classes = useStyles();
    const { addOrEdit, recordForEdit } = props;
  
    useEffect(() => {
      if (props.currentId != 0){
          setValues({
              ...props.appointmentList.find(x => x._id == props.currentId)
          })
          setErrors({})
      }
  }, [props.currentId])
  
    useEffect(() => {
      if (recordForEdit != null)
        setValues({
          ...recordForEdit,
        });
    }, [recordForEdit]);
  
    const validate = () => {
      let temp = { ...errors };
      temp.startDateTime = values.startDateTime ? "" : "This field is required.";
     // temp.serviceId = values.serviceId ? "" : "This field is required.";
     // temp.staffId = values.staffId ? "" : "This field is required.";
     // temp.serviceId = values.serviceId ? "" : "This field is required.";
      setErrors({
        ...temp,
      });
      return Object.values(temp).every((x) => x == "");
    };
  
    const {
      values,
      setValues,
      errors,
      setErrors,
      handleInputChange,
      resetForm,
    } = useForm(initialFValues, props.setCurrentId, validate);
    console.log("selected Service")
     console.log(selectedService);
  
   
    const [services, setServices] = useState();
    const [staffs, setStaffs] = useState();
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(false);
    // Populate Service DDL
    const fetchServiceURL = "http://localhost:4000/services/";
    const getServices = () => fetch(fetchServiceURL).then((res) => res.json());
    useEffect(() => {
      getServices().then((data) => setServices(data));
      // console.log(data);
    }, []);
  
    const optionsService = [];
    
    if (services) {
      services.map((service) => {
        optionsService.push({ value: service._id, label: service.name, selected:selectedService == service.value});
      });
    }
  
    // test
    if(recordForEdit && recordForEdit.serviceId != null){
     // console.log(recordForEdit);
     //setSelectedService({value:recordForEdit.serviceId});
    // window.alert("has service");
    }else{
     // window.alert("has no service");
      console.log(addOrEdit);
    }
    
    // Populate Staff DDL depending on servicer chosen
  
    // Cascaded dropdown data fill according the service choose above (when choose service staff will automatically be populated)
    useEffect(() => {
      const fetchStaffs = async () => {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/staff_service");
        setStaffData(res.data);
        setLoading(false);
      };
      fetchStaffs();
    }, []);
  
    const optionsStaff = [];
    //console.log("staff data");
    //console.log(staffData);
    // here comes the nested foreach/mapping for the data comes into play the cascading from many to many relation collection
    staffData.map((staff,index) => {
        let services = staffData[index].services;
        services.map((s, i) => {
        if(s.value == selectedService.value){//window.alert("service found")
          optionsStaff.push({ value: staff._id, label: staff.name });
        } 
      })
     });
  
     const AppointmentHandler = e => {
        e.preventDefault();
        if(selectedService == ""){
            window.alert("Choose Service");return false;
        }
        if(selectedStaff == ""){
            window.alert("Select Staff");return false;
        }
        if (validate()) {
          var date = new Date();
          date.setTime(date.getTime() + (5 * 60 * 1000)); // 5 mins expiration
          var AppointmentData = new Object();
          // AppointmentData.Push({
          //   "startDateTime": values.startDateTime,
          //   "endDateTime" : values.endDateTime,
          //   "serviceId" : values.serviceId,
          //   "staffId" : values.staffId,
          //   "notes" : values.notes
          // })
         /*  AppointmentData = {
            'startDateTime': values.startDateTime,
            'endDateTime' : values.endDateTime,
            'serviceId' : values.serviceId,
            'staffId' : values.staffId,
            'notes' : values.notes
          }; 
          setStartDateTime(AppointmentData.startDateTime);
          console.log(AppointmentData.startDateTime)
         // const AppointmentDataObject = JSON.stringify(AppointmentData);
          
          const unquotedAppointmentDataObject = JSON.stringify(AppointmentData);
          //AppointmentDataObject.push("startDateTime")
          Cookie.set("AppointmentData", unquotedAppointmentDataObject, { expires: date }) */// expires after 1 minute
          props.history.push("/login?redirect=appointmentForm");
        }
      };
     
    return (
        <div className="appointment-service-section" style={{ marginLeft: "20px" }}>
            <div className="row m-0">
                <Paper className={useStyles().pageContent}>
                    <Form autoComplete="off">
                        <Grid container>
                        {/* </Grid> */}
                        <Grid item xs={7}>
                            <TextField
                            id="start-datetime-local"
                            name="startDateTime"
                            label="Start appointment time"
                            type="datetime-local"
                            // defaultValue={new Date()}
                            value={values.startDateTime}
                            onChange={handleInputChange}
                            error={errors.startDateTime}
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                            <TextField
                            id="end-datetime-local"
                            name="endDateTime"
                            label="End appointment time"
                            type="datetime-local"
                            // defaultValue={new Date()}
                            value={values.endDateTime}
                            onChange={handleInputChange}
                            className={classes.textField}
                            error={errors.endDateTime}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                            <Controls.Input
                            className={classes.searviceInput}
                            name="notes"
                            label="Notes"
                            value={values.notes}
                            onChange={handleInputChange}
                            error={errors.notes}
                            />
                            <div>
                            <Controls.Button type="submit" text="Place Appointment" onClick={AppointmentHandler} />
                            <Controls.Button text="Reset" color="default" onClick={resetForm} />
                            </div>
                        </Grid>
                        <Grid item xs={5}>
                            <Select
                            name="serviceId"
                            id = "serviceId"
                            className={classes.ServiceDDL}
                            
                            // onChange={e => setSelectedService(e)}
                            onChange={e => setSelectedService(e)}
                            //onChange={e => setSelected({ selected: e.target.value })}
                            value={selectedService}
                            //     {...values.serviceId=selectedService["value"]} // extract value from single returned object
                            // value={values.serviceId}
                            // error={errors.serviceId}
                            // onChange={e => setSelected(e.currentTarget.value)}
                            // onChange={handleChange}
                        //  format={'yyyy-MM-ddhh:mm:ss'}
                            displayEmpty
                            options={optionsService}
                            //defaultValue={[optionsService[2]]}
                            placeholder="Choose Service"
                            />
                            <div className="gap" style={{"height":"20px"}}></div>
                            <Select
                            name="staffId"
                            className={classes.ServiceDDL}
                            // {...values.staffId=selectedStaff["value"]}
                            // value={values.staffId}
                            value={selectedStaff}
                            // error={errors.staffId}
                            // value={values.staffId}
                            onChange={setSelectedStaff}
                            displayEmpty
                            options={optionsStaff}
                            placeholder="Choose Staff"
                            />
                        </Grid>
                        </Grid>
                    </Form>
                </Paper>
            </div>
        </div>
    );
  };
  
  const mapStateToProps = (state) => ({
    staffList: state.staffs.list,
    serviceList: state.services.list,
    appointmentList: state.appointments.list
  });
  
  const mapActionToProps = {
    createAppointment: actions.create,
    updateAppointment: actions.update,
    fetchAllServices: actionService.fetchAll,
  };
  export default connect(mapStateToProps, mapActionToProps)(FrontendHome);
