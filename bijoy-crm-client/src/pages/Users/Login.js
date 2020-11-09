import React, { useEffect, useState,useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import AuthService from "../../AuthService";
import {Link, useParams} from "react-router-dom";
import Message from '../../components/Message';
import { makeStyles} from '@material-ui/core';
const useStyles = makeStyles((theme) => ({

    formElement: {
      marginBottom: "30px"
    },
    customFormControl: {
        border: "1px solid #cfd5db",
        borderRight: "none",
        borderRadius: "6px 0 0 6px",
        height: "44px",
        lineHeight: "4px",
        display: "inline-block",
        // paddingTop: "0px",
        // paddingBottom: "0px"
        // padding: "0px"
    }
    
    
  }));
const Login = props=>{
    const classes = useStyles();
    const {mtoken} = useParams();
    const [user,setUser] = useState({username: "", password : ""});
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [message,setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const onChange = e =>{
        setUser({...user,[e.target.name] : e.target.value});
        console.log(user);
    }

    const onSubmit = e =>{
        e.preventDefault();
            AuthService.login(user).then(data=>{
                console.log(data);
                const { isAuthenticated,user,message} = data;
                if(isAuthenticated){
                    const redirect = props.location.search
                    ? props.location.search.split("=")[1]
                    : "/home";
                    authContext.setUser(user);
                    authContext.setIsAuthenticated(isAuthenticated);
                    props.history.push(redirect);
                }
                else {
                    window.alert("Invalid username or password");
                    setMessage(message);
                }    
            });
    }

    return(
        <div class="container-scroller">
        <div class="page-body-wrapper full-page-wrapper">
          <div class="content-wrapper d-flex align-items-center auth auth-bg-1 theme-one">
            <div class="row w-100">
              <div class="col-lg-5 mx-auto">
                <h2 class="text-center mb-4">Login</h2>
                <div class="auto-form-wrapper">
                  <form onSubmit={onSubmit}>
                    <div class={classes.formElement}>
                      <div class="input-group">
                      <input type="email" 
                       name="username" 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Email"/>
                        <div class="input-group-append">
                          <span class="input-group-text" style={{ "padding": "0.35rem 1.375rem"}}>
                            <i class="mdi mdi-check-circle-outline"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class={classes.formElement}>
                      <div class="input-group">
                      <input type="password" 
                       name="password" 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Password"/>
                        <div class="input-group-append">
                          <span class="input-group-text" style={{ "padding": "0.35rem 1.375rem"}}>
                            <i class="mdi mdi-check-circle-outline"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="form-group">
                      {/* <button class="btn btn-primary submit-btn btn-block">Register</button> */}
                      {/* <Controls.Button className="btn btn-primary btn-block" 
                          type="submit" text="Register" /> */}
                          <button className="btn btn-primary btn-block" 
                        type="submit">Login </button>
                    </div>
                    <div class="form-group d-flex justify-content-between">
                    {/* <div class="form-check form-check-flat mt-0">
                      <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" checked /> Keep me signed in </label>
                    </div> */}
                    <a href="#" class="text-small forgot-password text-black">Forgot Password</a>
                  </div>
                  </form>
                  {message ? <Message message={message}/> : null}
                </div>
              </div>
            </div>
          </div>
          {/* <!-- content-wrapper ends --> */}
        </div>
        {/* <!-- page-body-wrapper ends --> */}
      </div>
      
    )
}

export default Login;