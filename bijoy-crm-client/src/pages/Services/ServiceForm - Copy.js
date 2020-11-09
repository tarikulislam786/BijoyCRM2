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
export default function ServiceForm() {
    const classes = useStyles();
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()){
          //  employeeService.insertEmployee(values)
            resetForm()
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
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
    )
}
