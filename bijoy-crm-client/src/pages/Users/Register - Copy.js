import React, { useState,useRef, useEffect } from "react";
import AuthService from "../../AuthService";
//import {Link} from "react-router-dom";
import Message from '../../components/Message';
import { useForm, Form } from '../../components/useForm';
import Controls from "../../components/controls/Controls";
import { makeStyles} from '@material-ui/core';
const initialFValues = {
    id: 0,
    username: '',
    password: '',
    role: ''
}
const useStyles = makeStyles((theme) => ({

    formElement: {
      marginBottom: "55px"
    },
    
  }));
const Register = props=>{
    const classes = useStyles();
    // username as email because passportjs allow only username to login, so I used it as email
   // const [user,setUser] = useState({username: "", email: "", password : "", role : ""});
    const [user,setUser] = useState({username: "", password : "", role : ""});
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [message,setMessage] = useState(null);
    let timerID = useRef(null); // useRef is for creating instance variable thats because we are going to use setTimeOut method
    useEffect(() => {
        return ()=>{
            clearTimeout(timerID);
        }
    }, []);

    // const onChange = e =>{
    //     setUser({...user,[e.target.name] : e.target.value});
    //     console.log(user);
    // }

    const resetForm = ()=>{
        // setUser({username : "", email: "", password : "",role : ""});
        setUser({username : "", password : "",role : ""});
    }
    const validate = () => {
        let temp = { ...errors }
        temp.username = values.username ? "" : "This field is required."
        temp.password = values.password ? "" : "This field is required."
       // temp.confirmPassword = values.confirmPassword ? "" : "This field is required."
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
        handleInputChange
    } = useForm(initialFValues,props.setCurrentId, validate) 
    const onSubmit = e =>{
        e.preventDefault();
        if(values.password != confirmPassword){
            console.log("pass "+password);
            console.log("conf "+confirmPassword);
            window.alert("password dont match");
            return false;
        }
        if (validate()) {
        AuthService.register(values).then(data=>{
            console.log(data);
            const { message } = data
            setMessage(message);
            resetForm();
            if(!message.msgError) {
                timerID = setTimeout(() => {
                    props.history.push("/login");
                }, 2000);
            }
        });
    }
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <h3>Please Register</h3>
                <div className ={classes.formElement}>
                    <label htmlFor="username" className="sr-only">Email: </label>
                    <Controls.Input type="email" 
                        name="username" 
                        // onChange={onChange} 
                        // onChange={(e) => setUsername(e.target.value)}
                        onChange={handleInputChange}
                        value={values.username}
                        className="form-control" 
                        placeholder="Enter Email"
                        error={errors.username}
                        />
                </div>
                
                {/* <label htmlFor="email" className="sr-only">Email: </label>
                <input type="email" 
                       name="email" 
                       onChange={onChange} 
                       value={user.email}
                       className="form-control" 
                       placeholder="Email"/> */}
               <div className ={classes.formElement}>
               <label htmlFor="password" className="sr-only">Password: </label>
                <Controls.Input
                       type="password" 
                       name="password" 
                    //    onChange={onChange} 
                    //    onChange={(e) => setPassword(e.target.value)}
                    onChange={handleInputChange}
                       value={values.password}
                       className="form-control" 
                       placeholder="Enter Password"
                       error={errors.password}
                       />
               </div>
               <div className ={classes.formElement}>
               <label htmlFor="password" className="sr-only">Confirm Password: </label>
                <Controls.Input
                       type="password" 
                       name="confirmPassword"
                    //    onChange={onChange} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    //    value={user.password}
                    // value = {values.confirmPassword}
                       className="form-control" 
                       placeholder="Confirm Password"
                    //    error={errors.password}
                       />
               </div>
               <div className ={classes.formElement}>
                <label htmlFor="role" className="sr-only">Role: </label>
                <Controls.Input
                       type="text" 
                       name="role" 
                    //    onChange={onChange} 
                    onChange={handleInputChange}
                    //    value={user.role}
                    value={values.role}
                       className="form-control" 
                       placeholder="Enter Role (admin/staff)"/>
                </div>
                <Controls.Button className="btn btn-lg btn-primary btn-block" 
                        type="submit" text="Submit" />
            </form>
            {message ? <Message message={message}/> : null}
        </div>
    )
}

export default Register;