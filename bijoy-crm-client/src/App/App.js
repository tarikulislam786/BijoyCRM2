import React, {useContext} from "react";
import { AuthContext } from "../Context/AuthContext";
//import logo from "./logo.svg";
import "./App.css";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import Login from "../pages/Users/Login";
import Register from "../pages/Users/Register";
import FrontendHome from "../pages/FrontendHome"; 
import Home from "../pages/Home";
import Service from "../pages/Services/Service";
import Staff from "../pages/Staffs/Staff";
import Customer from "../pages/Customers/Customer";
import Calendar from "../pages/Calendars/Calendar";
import Appointment from "../pages/Appointments/Appointment";
import PublicAppointmentForm from "../pages/Appointments/PublicAppointmentForm";
import ClientPortal from "../pages/ClientPortals/ClientPortal";
import {BrowserRouter as  Router, Route, Switch} from "react-router-dom";
import PrivateRoute from "../hocs/PrivateRoute";

import { Provider } from "react-redux";
import { store } from "../actions/store";
import { Container, AppBar, Typography } from "@material-ui/core";
import ButterToast,{ POS_RIGHT,POS_TOP } from "butter-toast";

function App() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  console.log(user);
  console.log(isAuthenticated);
  // var SideMenu;
  // if (isAuthenticated) {
  //   SideMenu = <SideMenu />;
  // } else {
  //   SideMenu = "";
  // } 
  return (
    <Provider store={store}>
      <Container maxWidth="lg">
      <Router>
      <>
        <Header />
        <SideMenu />
      <Switch>
       
        <Route exact path = "/" component={FrontendHome} />
        <Route path = "/appointmentForm" roles = {["user","admin","staff"]} component={PublicAppointmentForm} />
        
        <PrivateRoute path = "/home" roles = {["user","admin","staff"]} component={Home} />
        {/* <Route path = "/services" component={Service} /> */}
        {/* <Route path = "/staffs" component={Staff} /> */}
        {/* <Route path = "/customers" component={Customer} /> */}
        {/* <Route path = "/appointments" component={Appointment} /> */}
        <PrivateRoute path = "/services"  roles = {["admin","staff"]} component={Service} />
        <PrivateRoute path = "/staffs"  roles = {["admin","staff"]} component={Staff} />
        <PrivateRoute path = "/customers"  roles = {["admin","staff"]} component={Customer} />
        <PrivateRoute path = "/calendars"  roles = {["admin","staff"]} component={Calendar} />
        <PrivateRoute path = "/appointments"  roles = {["admin","staff"]} component={Appointment} />
        <PrivateRoute path = "/clientportals"  roles = {["user","admin","staff"]} component={ClientPortal} />
        <Route path = "/login" component={Login} />
        <Route path = "/register" component={Register} />
        {/* <Route path = "/register" component={Register} /> */}
        <Route path = "/verify-email/:mtoken" component={Login} />
        
        {/* <ButterToast position={{vertical:POS_TOP,horizontal:POS_RIGHT}}/> */}
      </Switch>
      
      {/* <div>Here we go</div>; */}
      </>
      </Router>
      <ButterToast position={{vertical:POS_TOP,horizontal:POS_RIGHT}}/>

      </Container>
    </Provider>
  )
  
}

export default App;
