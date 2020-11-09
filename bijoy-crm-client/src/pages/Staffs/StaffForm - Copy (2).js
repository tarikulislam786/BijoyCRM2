import React, { useState, useEffect } from "react";
import { Grid, makeStyles,MenuItem } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import Select from 'react-select'
//import Select from '@material-ui/core/Select';
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
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
// import * as employeeService from "../../services/employeeService";

const initialFValues = {
  id: 0,
  serviceId: "",
  name: "",
  email: "",
  mobile: null,
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
  }
}));

const StaffForm = (props) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState("none");
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
   /* itemsToRender = items.map((item) => {
      return (
      <option values={item._id}>{item.name}</option>
      );
    });*/
    items.map((item) => {
    options.push({value:item._id, label: item.name})
    })
  }
  // const options = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' }
  // ]
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
      //employeeService.insertEmployee(employee)
      props.createStaff(values, onSuccess);
    } else {
      // employeeService.updateEmployee(employee)
      props.updateStaff(staff._id, values, onSuccess);
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
            // value={values.name}
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
      <Grid item xs={6}>
      <Select name="serviceId" 
          className={classes.ServiceDDL} 
          // onChange={handleTypeSelect}
          displayEmpty
          options={options}
          multi
          />
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
};
export default connect(mapStateToProps, mapActionToProps)(StaffForm);
