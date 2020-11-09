import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Grid, makeStyles, MenuItem, TextField } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import * as actions from "../../actions/clientportals";
import Dropzone from "../../dropzone/Dropzone";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
import axios from "axios";
// import * as employeeService from "../../services/employeeService";

const initialFValues = {
  id: 0,
  fileName: '',
  fileDescription: '',
  uploadedDate: '',
  fileSize: '',
  file: '',
};
const useStyles = makeStyles((theme) => ({
  searviceInput: {
    width: "100%",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  ServiceDDL: {
    width: "100%",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: 200,
  },
  title: {
    // font-size: 2rem;
    // text-align: center !important;
    // margin-top: 10%;
    // color: #4aa1f3;
    // font-weight: bold;
    fontSize: "2rem",
    textAlign: "center",
    marginTop: "10%",
    color: "#4aa1f3",
    fontWeight: "bold"
  },
  
  content: {
    // background-color: white;
    // min-height: 100vh;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: center;
    backgroundColor: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const ClientPortalForm = (props) => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
 // console.log(user);
 // console.log(isAuthenticated);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");

  const classes = useStyles();
  const { addOrEdit, recordForEdit } = props;

  useEffect(() => {
    if (props.currentId != 0){
        setValues({
            ...props.clientPortalList.find(x => x._id == props.currentId)
        })
        setErrors({})
    }
}, [props.currentId])

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  const validate = () => {
    let temp = { ...errors };
    temp.fileName = values.fileName ? "" : "This field is required.";
    temp.file = values.file ? "" : "This field is required.";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, props.setCurrentId, validate);

  const [loading, setLoading] = useState(false);
  

  const handleSubmit = e => {//window.alert("sub")
    e.preventDefault();
    //consul
    if (validate()) {
     // values.status = selectedStatus.value;
     // window.alert(x);
      addOrEdit(values, resetForm);
    }
  };

  
  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <Grid container>
        {/* </Grid> */}
        <Grid item xs={5}>
          <div>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
        <Grid item xs={7}>
          
            {/* <div className="gap" style={{"height":"20px"}}></div> */}
                {/* <div>
                    <p className={classes.title}>React Drag and Drop Image Upload</p> */}
                    <div className={classes.content}>
                       
                    </div>
                {/* </div> */}
        </Grid>
      </Grid>
    </Form>
  );
};

const mapStateToProps = (state) => ({
    clientPortalList: state.clientportals.list,
});

const mapActionToProps = {
    fetchAll: actions.fetchAll,
    createClientPortal: actions.create,
    updateClientPortal: actions.update,
    deleteClientPortal: actions.Delete
};
export default connect(mapStateToProps, mapActionToProps)(ClientPortalForm);
