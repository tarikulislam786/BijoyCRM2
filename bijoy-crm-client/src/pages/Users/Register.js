import React, { useState, useRef, useEffect } from "react";
import AuthService from "../../AuthService";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import { useForm, Form } from "../../components/useForm";
import Controls from "../../components/controls/Controls";
import { makeStyles } from "@material-ui/core";
const initialFValues = {
  id: 0,
  username: "",
  password: "",
  role: "",
};
const useStyles = makeStyles((theme) => ({
  formElement: {
    marginBottom: "30px",
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
  },
}));
const Register = (props) => {
  const classes = useStyles();
  // username as email because passportjs allow only username to login, so I used it as email
  // const [user,setUser] = useState({username: "", email: "", password : "", role : ""});
  const [user, setUser] = useState({ username: "", password: "", role: "" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  let timerID = useRef(null); // useRef is for creating instance variable thats because we are going to use setTimeOut method
  useEffect(() => {
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  // const onChange = e =>{
  //     setUser({...user,[e.target.name] : e.target.value});
  //     console.log(user);
  // }

  const resetForm = () => {
    // setUser({username : "", email: "", password : "",role : ""});
    setUser({ username: "", password: "", role: "" });
  };
  const validate = () => {
    let temp = { ...errors };
    temp.username = values.username ? "" : "This field is required.";
    temp.password = values.password ? "" : "This field is required.";
    // temp.confirmPassword = values.confirmPassword ? "" : "This field is required."
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    initialFValues,
    props.setCurrentId,
    validate
  );
  const onSubmit = (e) => {
    e.preventDefault();
    if (values.password != confirmPassword) {
      console.log("pass " + password);
      console.log("conf " + confirmPassword);
      window.alert("password dont match");
      return false;
    }
    // by default user registration, below in form role field is hiiden, we can assign two more role stff and admin
    if (values.role == "") {
      values.role = "user";
    }
    if (validate()) {
      AuthService.register(values).then((data) => {
        console.log(data);
        const { message } = data;
        setMessage(message);
        resetForm();
        if (!message.msgError) {
          timerID = setTimeout(() => {
            props.history.push("/login");
          }, 2000);
        }
      });
    }
  };

  return (
    <div class="container-scroller">
      <div class="page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth register-bg-1 theme-one">
          <div class="row w-100">
            <div class="col-lg-5 mx-auto">
              <h2 class="text-center mb-4">Register</h2>
              <div class="auto-form-wrapper">
                <form onSubmit={onSubmit}>
                  <div class={classes.formElement}>
                    <div class="input-group">
                      <Controls.Input
                        type="email"
                        name="username"
                        // onChange={onChange}
                        // onChange={(e) => setUsername(e.target.value)}
                        onChange={handleInputChange}
                        value={values.username}
                        className="form-control"
                        // className = {classes.customFormControl}
                        placeholder="Email"
                        error={errors.username}
                      />
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="mdi mdi-check-circle-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class={classes.formElement}>
                    <div class="input-group">
                      <Controls.Input
                        type="password"
                        name="password"
                        //    onChange={onChange}
                        //    onChange={(e) => setPassword(e.target.value)}
                        onChange={handleInputChange}
                        value={values.password}
                        className="form-control"
                        placeholder="Password"
                        error={errors.password}
                      />
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="mdi mdi-check-circle-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class={classes.formElement}>
                    <div class="input-group">
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
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="mdi mdi-check-circle-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <div class="form-group d-flex justify-content-center">
                    <div class="form-check form-check-flat mt-0">
                      <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" checked /> I agree to the terms </label>
                    </div>
                  </div> */}
                  <div
                    className={classes.formElement}
                    style={{ display: "none" }}
                  >
                    <div class="input-group">
                      <Controls.Input
                        type="text"
                        name="role"
                        onChange={handleInputChange}
                        value={values.role}
                        //  value="user"
                        className="form-control"
                        placeholder="Enter Role (admin/staff)"
                      />
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="mdi mdi-check-circle-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    {/* <button class="btn btn-primary submit-btn btn-block">Register</button> */}
                    <Controls.Button
                      className="btn btn-primary btn-block"
                      type="submit"
                      text="Register"
                    />
                  </div>
                  <div class="text-block text-center my-3">
                    <span class="text-small font-weight-semibold">
                      Already have and account ?
                    </span>
                    {/* <a href="login.html" class="text-black text-small">Login</a> */}
                    <Link to="/login" className="link active">
                      Login
                    </Link>
                  </div>
                </form>
                {message ? <Message message={message} /> : null}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- content-wrapper ends --> */}
      </div>
      {/* <!-- page-body-wrapper ends --> */}
    </div>
  );
};

export default Register;
