import React, { useState, useEffect } from "react";
import { Grid, makeStyles, MenuItem } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import Select from "react-select";

//import Select from '@material-ui/core/Select';
import MultiSelect from "react-multi-select-component";
/*import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';*/
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import * as actions from "../../actions/staffs";
import * as actionService from "../../actions/services";
import * as actionStaffService from "../../actions/staff_service";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
// import * as employeeService from "../../services/employeeService";
import Staff from "./Staff";
import { services } from "../../reducers/services";
const initialFValues = {
  id: 0,
  name: "",
  email: "",
  mobile: null,
  services: [],
  // servicesUpdated: []
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
}));

const StaffForm = (props) => {
  const [openPopup, setOpenPopup] = useState(false);
  //const [selectedOption, setSelectedOption] = useState("none");
  const [selected, setSelected] = useState([]);
  const classes = useStyles();
  const { recordForEdit } = props;
  const validate = () => {
    let temp = { ...errors };
    temp.name = values.name ? "" : "This field is required.";
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
  } = useForm(initialFValues, props.setCurrentId);

  const [items, setItems] = useState();
  // const handleTypeSelect = e => {
  //   setItems(e.name);
  // };
  // Just a data fetching function
  const fetchURL = "http://localhost:4000/services/";
  const getItems = () => fetch(fetchURL).then((res) => res.json());
  useEffect(() => {
    getItems().then((data) => setItems(data));

    // console.log(data);
  }, []);

  let itemsToRender;
  const options = [];
  if (items) {
    items.map((item) => {
      // keep checked
      // services.map((availableServices) => {
      //  if(availableServices.value == item._id){
      //   console.log("value matched")
      //  }
      // })
      options.push({ value: item._id, label: item.name });
    });
  }
  // console.log(options);
  const addOrEdit = (staff, resetForm) => {
    // window.alert('valid')
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
      //  window.alert('new record will be inserted')
      selected.forEach((item) => {
        staff.services.push(item);
      });
      //  console.log(staff.services);
      // console.log(selected);
      props.createStaff(values, staff.services, onSuccess);
      window.location.reload();
    } else {
      // update operation is taken through deleting all staff_service then insert staff_service
      //console.log(selected);return false;
      // when reassign service just empty the previous services
      if (selected.length > 0) {
        staff.services = []; // staff.services should be null before push
      } // otherwise, keep those services as it was
      selected.forEach((item) => {
        staff.services.push(item);
      });
      //  console.log(staff.services);
      // console.log(selected);
      // props.createStaff(values, staff.services, onSuccess);
      props.updateStaff(staff._id, values, staff.services, onSuccess);
      window.location.reload();
    }

    resetForm();
    //  setRecordForEdit(null)
    setOpenPopup(false);
    // setRecords(employeeService.getAllEmployees())
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      //   const { addOrEdit } = props
      /*if (props.currentId == 0 || props.currentId == null)
                props.createService(values, onSuccess)
            else
                props.updateService(props.currentId, values, onSuccess)
            */
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
        <Grid item xs={6}>
          <Controls.Input
            className={classes.searviceInput}
            name="name"
            label="Staff Name"
            value={values.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <Controls.Input
            className={classes.searviceInput}
            name="email"
            label="Email"
            value={values.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <Controls.Input
            className={classes.searviceInput}
            name="mobile"
            label="Mobile"
            value={values.mobile}
            onChange={handleInputChange}
            error={errors.mobile}
          />

          <div>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
        <Grid item xs={6}>
          {/* <Select name="serviceId" 
          className={classes.ServiceDDL} 
          displayEmpty
          options={options}
          /> */}
          <MultiSelect
            options={options}
            value={selected}
            onChange={setSelected}
            labelledBy={"Select"}
            hasSelectAll={true}
            placeholder={"Choose Service"}
          />
          {/* record.services.map((service, index) => ((index ? ', ' : '') + service.label)) */}
        </Grid>
      </Grid>
    </Form>
  );
};

const mapStateToProps = (state) => ({
  staffList: state.staffs.list,
  serviceList: state.services.list,
});

const mapActionToProps = {
  createStaff: actions.create,
  updateStaff: actions.update,
  fetchAllServices: actionService.fetchAll,
  createStaffService: actionStaffService.create,
  deleteStaffService: actionStaffService.Delete,
};
export default connect(mapStateToProps, mapActionToProps)(StaffForm);
