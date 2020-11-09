import React, { Component,useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import AuthService from "../AuthService";
import {Link} from "react-router-dom";
export default function Header() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
 // console.log(user);
  // console.log(isAuthenticated);
  const onClickLogoutHandler = () => {
    AuthService.logout().then(data => {
      if(data.success) {
        setUser(data.user);
        setIsAuthenticated(false);
      }
    })
  }
  const unAuthenticatedNavBar = () => {
    return (
      <>
      <li className="item-main single">
        <Link className="link" to="/">
            Home
        </Link>
      </li>
      <li className="item-main single">
        <Link className="link" to="/login">
            Login
        </Link>
      </li>
      <li className="item-main single">
        <Link className="link" to="/register">
            Register
        </Link>
      </li>
      
      </>
    )
  }
  const AuthenticatedNavBar = () => {
    return (
      <>
          <li className="item-main has-submenu">
              <Link className="link" to="/">
                Appointment Booking
              </Link>
              <ul className="item-submenu">
                <li className="submenu-item">
                  <Link className="link" to="">
                    ABC
                  </Link>
                </li>
                <li className="submenu-item">
                  <Link className="link" to="">
                    DEF
                  </Link>
                </li>
              </ul>
          </li>
      </>
    )
  }
  const AuthenticatedRightBoxMenu = () => {
    return (
      <>
          <ul className="header-box-item-wrapper right">
            <li className="item-main has-submenu">
              <img src="assets/img/user1.png" />
              <ul className="item-submenu">
                <li className="submenu-item">
                  <Link className="link" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="submenu-item">
                  <Link className="link" to="/setting">
                    Setting
                  </Link>
                </li>
                <li className="submenu-item">
                  <Link className="link" to="/" onClick={onClickLogoutHandler}>
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
      </>
    )
  }
  const unAuthenticatedRightBoxMenu = () => {
    return (
      <>
      </>
    )
  }
  
  return (
    <main className="main-body">
      {/* <!-- Header Start --> */}
      <header className="header-main">
        <div className="left-box">
          <ul className="header-box-item-wrapper left">
            {!isAuthenticated ? unAuthenticatedNavBar() : AuthenticatedNavBar()}
          </ul>
          {/* <!-- breadcrumb End--> */}
        </div>
        
        <div className="right-box">
        {!isAuthenticated ? unAuthenticatedRightBoxMenu() : AuthenticatedRightBoxMenu()}
        </div>
      </header>
      {/* <!-- Header End --> */}
    </main>
  );
}
//export default Header;