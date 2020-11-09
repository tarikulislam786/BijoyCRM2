import React, { Component,useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import AuthService from "../AuthService";
import {Link} from "react-router-dom";
export default function SideMenu() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  // console.log(user);
   // console.log(isAuthenticated);
   
   const unAuthenticatedSideMenu = () => {
    return (
      <>
      </>
    )
   }
   const AuthenticatedSideMenu = () => {
    return (
      <>
          <ul className="appointment-main-side-menu-inner">
          <li className="menu-item">
            <Link
              to="/"
              className="link"
              data-toggle="tooltip"
              data-placement="right"
              title="Home"
            >
              <span className="icon">
                <i className="fas fa-home"></i>
              </span>
            </Link>
          </li>
          <li
            className="menu-item"
            data-toggle="tooltip"
            data-placement="right"
            title="Calendars"
          >
            <Link to="/calendars" className="link">
              <span className="icon">
                <i className="far fa-calendar-alt"></i>
              </span>
            </Link>
          </li>
          <li
            className="menu-item"
            data-toggle="tooltip"
            data-placement="right"
            title="Appointment"
          >
            <Link to="/appointments" className="link">
              <span className="icon">
                <i className="fas fa-calendar-times"></i>
              </span>
            </Link>
          </li>
          <li
            className="menu-item"
            data-toggle="tooltip"
            data-placement="right"
            title="Customers"
          >
            <Link to="/customers" className="link">
              <span className="icon">
                <i className="fas fa-users"></i>
              </span>
            </Link>
          </li>
          <li
            className="menu-item"
            data-toggle="tooltip"
            data-placement="right"
            title="Staffs"
          >
            <Link to="/staffs" className="link">
              <span className="icon">
                <i className="fas fa-user-tie"></i>
              </span>
            </Link>
          </li>
          <li
            className="menu-item"
            data-toggle="tooltip"
            data-placement="right"
            title="Services"
          >
            <Link to="/services" className="link active">
              <span className="icon">
                <i className="fas fa-briefcase"></i>
              </span>
            </Link>
          </li>
          <li
            className="menu-item"
            data-toggle="tooltip"
            data-placement="right"
            title="Client Portal"
          >
            <Link to="/clientportals" className="link">
              <span className="icon">
              <i className="fas fa-file-download"></i>
              </span>
            </Link>
          </li>
          <li
            className="menu-item"
            data-toggle="tooltip"
            data-placement="right"
            title="Settings"
          >
            <Link to="/settings" className="link">
              <span className="icon">
                <i className="fas fa-cog"></i>
              </span>
            </Link>
          </li>
        </ul>
      
      </>
    )
  }


  return (
    <section className="margin-top-80">
      <div className="appointment-main-side-menu-wrapper">
      {!isAuthenticated ? unAuthenticatedSideMenu() : AuthenticatedSideMenu()}
      </div>
    </section>
  );
}
// export default SideMenu;