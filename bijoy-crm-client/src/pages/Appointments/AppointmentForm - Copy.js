import React, { useState, useEffect } from "react";
import { Grid, makeStyles,MenuItem, TextField } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import Select from 'react-select'

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import * as actions from "../../actions/appointments";
import * as actionService from "../../actions/services";
import * as actionStaff from "../../actions/staffs";
import * as actionStaffService from "../../actions/staff_service";

import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
// import * as employeeService from "../../services/employeeService";

const initialFValues = {
  id: 0,
  startDateTime:"",
  endDateTime: "",
  serviceId: "",
  staffId: "",
  notes: "",
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
    width: "100%"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const AppointmentForm = (props) => {
  const [openPopup, setOpenPopup] = useState(false);
 // const [selectedOption, setSelectedOption] = useState("none");
   const [selected, setSelected] = useState();
   console.log(selected);
  const classes = useStyles();
  const {  addOrEdit, recordForEdit } = props
  const validate = () => {
    let temp = { ...errors };
    // temp.name = values.name ? "" : "This field is required.";
    temp.startDateTime = values.startDateTime ? "" : "This field is required.";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };

  var {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, props.setCurrentId, validate);

  const [services, setServices] = useState();
  const [staffs, setStaffs] = useState();
  
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
        optionsService.push({value:service._id, label: service.name})
    })
  }

  // Populate Staff DDL
  const fetchStaffURL = "http://localhost:4000/staffs/";
  const getStaffs = () => fetch(fetchStaffURL).then((res) => res.json());
  useEffect(() => {
    getStaffs().then((data) => setStaffs(data));
    // console.log(data);
  }, []);

  const optionsStaff = [];
  if (staffs) {
   
    staffs.map((staff) => {
        optionsStaff.push({value:staff._id, label: staff.name})
    })
  }
  // const options = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' }
  // ]
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      //   const { addOrEdit } = props
      addOrEdit(values, resetForm);
    }
  };
  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);
  
  return (
    <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
      <Grid container>
        {/* </Grid> */}
        <Grid item xs={7}>
          
          <TextField
        id="datetime-local"
        name="startDateTime"
        label="Start appointment time"
        type="datetime-local"
        defaultValue={new  Date()}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        />
        <TextField
        id="datetime-local"
        name="endDateTime"
        label="End appointment time"
        type="datetime-local"
        defaultValue={new  Date()}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        />
       <Controls.Input
            className={classes.searviceInput}
            name="notes"
            label="Notes"
            // value={values.name}
            // onChange={handleInputChange}
            error={errors.notes}
          />
        {/* <Controls.Select
                        name="serviceId"
                        label="Service"
                        value={values.serviceId}
                        onChange={handleInputChange}
                        // options={itemsToRender}
                        error={errors.serviceId}
                    /> */}
          <div>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
      <Grid item xs={5}>
      <Select name="serviceId" 
          className={classes.ServiceDDL} 
          value={selected}
          onChange={setSelected}
          displayEmpty
          options={optionsService}
          placeholder="Choose Service"
        />
        <Select name="staffId" 
          className={classes.ServiceDDL} 
          // onChange={handleTypeSelect}
          displayEmpty
          options={optionsStaff}
          placeholder="Choose Staff"
        />
        
      </Grid>
      </Grid>
    </Form>
  );
};

const mapStateToProps = (state) => ({
  staffList: state.staffs.list,
  serviceList: state.services.list,
  //StaffListByServiceId: state.staff_service.list,
});

const mapActionToProps = {
  createAppointment: actions.create,
  updateAppointment: actions.update,
  fetchAllServices: actionService.fetchAll,
  fetchAllStaffs: actionStaff.fetchAll,
  fetchAllStaffsByServiceId: actionStaffService.fetchAllStaffByService
};
export default connect(mapStateToProps, mapActionToProps)(AppointmentForm);
