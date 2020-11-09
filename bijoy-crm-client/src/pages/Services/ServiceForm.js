import React, { useState, useEffect } from 'react'
import { Grid, makeStyles} from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import { connect } from "react-redux";
import * as actions from "../../actions/services";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
// import * as employeeService from "../../services/employeeService";

const initialFValues = {
    id: 0,
    name: ''
}
const useStyles = makeStyles((theme) => ({

    searviceInput: {
      width: "100%"
    },
    
  }));

const ServiceForm = (props) => {
    
    const [openPopup, setOpenPopup] = useState(false);
    //const [records, setRecords] = useState(employeeService.getAllEmployees())
  //  const [recordForEdit, setRecordForEdit] = useState(null);
    const classes = useStyles();
    const {  addOrEdit, recordForEdit } = props
    useEffect(() => {
        if (props.currentId != 0){
            setValues({
                ...props.serviceList.find(x => x._id == props.currentId)
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
    // const validate = (fieldValues = values) => {
    //     let temp = { ...errors }
    //     if ('name' in fieldValues)
    //         temp.name = fieldValues.name ? "" : "This field is required."
    //     setErrors({
    //         ...temp
    //     })
    //     if (fieldValues == values)
    //         return Object.values(temp).every(x => x == "")
    // }
    const validate = () => {
        let temp = { ...errors }
        temp.name = values.name ? "" : "This field is required."
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues,props.setCurrentId, validate) 
    /* const addOrEdit = (service, resetForm) => {
        const onSuccess = () => {
          ButterToast.raise({
              content: <Cinnamon.Crisp title="Service Box"
                  content="Submitted successfully"
                  scheme={Cinnamon.Crisp.SCHEME_PURPLE}
                  icon={<AssignmentTurnedIn />}
              />
          })
      }
            if (service._id == 0 || service._id == null) {
              props.createService(values, onSuccess)
            }
            else {
                props.updateService(service._id, values, onSuccess)
            }
            resetForm()
      }*/

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
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
        <Form onSubmit={handleSubmit} autoComplete="off">
             <Grid container>
                 <Grid item xs={8}>
                     <Controls.Input
                         className ={classes.searviceInput}
                         name="name"
                         label="Service Name"
                         value={values.name}
                         onChange={handleInputChange}
                         error={errors.name}
                     />
                     <div>
                         <Controls.Button
                             type="submit"
                             text="Submit" />
                         <Controls.Button
                             text="Reset"
                             color="default"
                             onClick={resetForm} />
                     </div>
                 </Grid>
             </Grid>
         </Form>
    );
}


 const mapStateToProps = (state) => ({
    serviceList: state.services.list,
  });

const mapActionToProps = {
    createService: actions.create,
    updateService: actions.update
} 
export default connect(mapStateToProps,mapActionToProps)(ServiceForm);