import React, { useEffect, useState,useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import AuthService from "../../AuthService";
import {Link, useParams} from "react-router-dom";
import Message from '../../components/Message';

const Login = props=>{
    const {mtoken} = useParams();
    const [user,setUser] = useState({username: "", password : ""});
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
        <div>
            <form onSubmit={onSubmit}>
                <h3>Please sign in</h3>
                <label htmlFor="username" className="sr-only">Email: </label>
                <input type="email" 
                       name="username" 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Email"/>
                <label htmlFor="password" className="sr-only">Password: </label>
                <input type="password" 
                       name="password" 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Password"/>
                <button className="btn btn-lg btn-primary btn-block" 
                        type="submit">Log in </button>
            </form>
            {message ? <Message message={message}/> : null}
        </div>
    )
}

export default Login;