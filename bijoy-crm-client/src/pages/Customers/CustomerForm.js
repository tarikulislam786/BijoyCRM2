import React, { useState, useEffect } from 'react'
import { Grid, makeStyles} from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import { connect } from "react-redux";
import * as actions from "../../actions/customers";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
// import * as employeeService from "../../services/employeeService";

const initialFValues = {
    id: 0,
    name: '',
    email : '',
    mobile : '',
    phone : null,
    address : '',
    city : '',
    state : '',
    zip : null,
    ssn : null
}
const useStyles = makeStyles((theme) => ({

    searviceInput: {
      width: "100%",
    },
    
  }));

const CustomerForm = (props) => {
    const [openPopup, setOpenPopup] = useState(false);
   
    //const [records, setRecords] = useState(employeeService.getAllEmployees())
  //  const [recordForEdit, setRecordForEdit] = useState(null);
    const classes = useStyles();
    const {  recordForEdit } = props
    useEffect(() => {
        if (props.currentId != 0){
            setValues({
                ...props.customerList.find(x => x._id == props.currentId)
            })
            setErrors({})
        }
    }, [props.currentId])

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit]) 
    const validate = () => {
        let temp = { ...errors }
        temp.name = values.name ? "" : "This field is required."
        temp.ssn = values.ssn ? "" : "This field is required."
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }

    var {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues,props.setCurrentId) 
    const addOrEdit = (customer, resetForm) => {
       // window.alert('valid')
        const onSuccess = () => {
          ButterToast.raise({
              content: <Cinnamon.Crisp title="Customer Box"
                  content="Submitted successfully"
                  scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                  icon={<AssignmentTurnedIn />}
              />
          })
       
      }
            if (customer._id == 0 || customer._id == null) {
              //  window.alert('new record will be inserted')
               //employeeService.insertEmployee(employee)
              props.createCustomer(values, onSuccess)
              window.location.reload();
            }
               
            else {
                // employeeService.updateEmployee(employee)
                props.updateCustomer(customer._id, values, onSuccess)
                window.location.reload();
            }
                
            resetForm()
          //  setRecordForEdit(null)
            setOpenPopup(false)
           // setRecords(employeeService.getAllEmployees())
      }

    const handleSubmit = e => {
       
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
    }

    

    /*const handleSubmit = e => {
        e.preventDefault()
        const onSuccess = () => {
            ButterToast.raise({
                content: <Cinnamon.Crisp title="Service Box"
                    content="Submitted successfully"
                    scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                    icon={<AssignmentTurnedIn />}
                />
            })
         
        }
        if (validate()) {
            if (props.currentId == 0 || props.currentId == null)
                props.createService(values, onSuccess)
            else
                props.updateService(props.currentId, values, onSuccess)
        }
    }*/

    return (
        <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input
                    className={classes.searviceInput}
                    name="name"
                    label="Customer Name"
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
                    <Controls.Input
                    className={classes.searviceInput}
                    name="phone"
                    label="Phone"
                    value={values.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    />
                    <Controls.Input
                    className={classes.searviceInput}
                    name="address"
                    label="Address"
                    value={values.address}
                    onChange={handleInputChange}
                    error={errors.address}
                    />
                    <div>
                    <Controls.Button type="submit" text="Submit" />
                    <Controls.Button text="Reset" color="default" onClick={resetForm} />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Controls.Input
                        className={classes.searviceInput}
                        name="city"
                        label="City"
                        value={values.city}
                        onChange={handleInputChange}
                        error={errors.city}
                    />
                    <Controls.Input
                        className={classes.searviceInput}
                        name="state"
                        label="State"
                        value={values.state}
                        onChange={handleInputChange}
                        error={errors.state}
                    />
                    <Controls.Input
                        className={classes.searviceInput}
                        name="zip"
                        label="Zip"
                        value={values.zip}
                        onChange={handleInputChange}
                        error={errors.zip}
                    />
                    <Controls.Input
                        className={classes.searviceInput}
                        name="ssn"
                        label="SSN"
                        value={values.ssn}
                        onChange={handleInputChange}
                        error={errors.ssn}
                    />
                </Grid>
    
            </Grid>
         </Form>
    );
}


 const mapStateToProps = (state) => ({
    customerList: state.customers.list,
  });

const mapActionToProps = {
    createCustomer: actions.create,
    updateCustomer: actions.update
} 
export default connect(mapStateToProps,mapActionToProps)(CustomerForm);