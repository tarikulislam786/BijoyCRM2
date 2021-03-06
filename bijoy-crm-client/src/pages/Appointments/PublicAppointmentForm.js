import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Grid, makeStyles, MenuItem, TextField } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import * as actions from "../../actions/appointments";
import * as actionService from "../../actions/services";

import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
import axios from "axios";
// import * as employeeService from "../../services/employeeService";

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

const AppointmentForm = (props) => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
 // console.log(user);
 // console.log(isAuthenticated);
  const [openPopup, setOpenPopup] = useState(false);
  // const [selectedOption, setSelectedOption] = useState("none");
  const [selectedService, setSelectedService] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const classes = useStyles();
  //const { addOrEdit } = props;

  useEffect(() => {
    if (props.currentId != 0){
        setValues({
            ...props.appointmentList.find(x => x._id == props.currentId)
        })
        setErrors({})
    }
}, [props.currentId])
  const validate = () => {
    let temp = { ...errors };
    temp.startDateTime = values.startDateTime ? "" : "This field is required.";
    temp.notes = values.notes ? "" : "This field is required.";
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
      optionsService.push({ value: service._id, label: service.name });
    });
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

  const optionsStatus = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' }
  ]
  
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
  }
  resetForm()
  //setRecordForEdit(null)
  //setOpenPopup(false)
  // setRecords(employeeService.getAllEmployees())
 // setServices(props.fetchAllServices);
  
}
  /* const addOrEdit = (staff, resetForm) => {
    
    const onSuccess = () => {
      ButterToast.raise({
        content: (
          <Cinnamon.Crisp
            title="Service Box"
            content="Submitted successfully"
            scheme={Cinnamon.Crisp.SCHEME_PURPLE}
            icon={<AssignmentTurnedIn />}
          />
        ),
      });
    };
    if (staff._id == 0 || staff._id == null) {
      props.createAppointment(values, onSuccess);
    } else {
      props.updateAppointment(staff._id, values, onSuccess);
    }
    resetForm();
    setOpenPopup(false);
  }; */

  const handleSubmit = e => {//window.alert("sub")
    e.preventDefault();
    //consul
    if (validate()) {
     // console.log("serviceId")
     // console.log(values.serviceId);
      //window.alert("sub2")
      //   const { addOrEdit } = props
     
      values.serviceId = selectedService.value;
      values.staffId = selectedStaff.value;
      values.status = "Pending";
     // window.alert(x);

      addOrEdit(values, resetForm);
    }
  };

  
  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
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
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
        <Grid item xs={5}>
          <Select
            name="serviceId"
            className={classes.ServiceDDL}
           // onChange={e => setSelectedService(e)}
           onChange={e => setSelectedService(e)}
            //onChange={e => setSelected({ selected: e.target.value })}
            value={selectedService}
              // {...values.serviceId=selectedService["value"]} // extract value from single returned object
            // value={values.serviceId}
            error={errors.serviceId}
            // onChange={e => setSelected(e.currentTarget.value)}
            // onChange={handleChange}
         //  format={'yyyy-MM-ddhh:mm:ss'}
            displayEmpty
            options={optionsService}
            placeholder="Choose Service"
          />
          <div className="gap" style={{"height":"20px"}}></div>
          <Select
            name="staffId"
            className={classes.ServiceDDL}
            // {...values.staffId=selectedStaff["value"]}
            // value={values.staffId}
            value={selectedStaff}
           // value={values.staffId}
            onChange={setSelectedStaff}
            displayEmpty
            options={optionsStaff}
            placeholder="Choose Staff"
          />
          <div className="gap" style={{"height":"20px"}}></div>
          {/* {!isAuthenticated ? unAuthenticatedSideMenu() : AuthenticatedSideMenu()} */}
          {user.role !="user" ?
            <Select
            name="status"
            className={classes.ServiceDDL}
            value={values.status}
            onChange={setSelectedStatus}
            options={optionsStatus}
            placeholder="Leave Status"
          /> : ""
          }
          
          {/* <Controls.Select
                        name="status"
                        label="Status"
                        value={values.status}
                        onChange={handleInputChange}
                        options={optionsStatus}
                        error={errors.status}
                    /> */}
        </Grid>
      </Grid>
    </Form>
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
export default connect(mapStateToProps, mapActionToProps)(AppointmentForm);
