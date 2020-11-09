import React,  {Component} from 'react';
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda } from '@syncfusion/ej2-react-schedule';
//import Appointment from '../../../../../../../bijoycrm - Copy/src/pages/Appointment';

import { connect } from "react-redux";
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
  
const Calendar = (props) => {
    const classes = useStyles();
    return (
        <div className="appointment-service-section" style={{ marginLeft: "20px" }}>
            <div className="row m-0">
              <Paper className={useStyles().pageContent}>
                  <ScheduleComponent currentView="Week">
                      <Inject services = {[Day, Week, WorkWeek, Month, Agenda]} />
                  </ScheduleComponent>
              </Paper>
			      </div>
        </div>
        );
}
/*const mapStateToProps = (state) => ({
    appointmentList: state.appointments.list,
  });
  const mapActionToProps = {
    fetchAllAppointments: actions.fetchAll,
    createAppointment: actions.create,
    updateAppointment: actions.update,
    deleteAppointment: actions.Delete
  }; */
  // props.fetchAllCustomers
  //export default connect(mapStateToProps,mapActionToProps)(Customer);
  export default connect()(Calendar);