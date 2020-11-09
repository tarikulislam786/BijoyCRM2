import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Grid, makeStyles, MenuItem, TextField } from "@material-ui/core";
import { useForm, Form } from "../../components/useForm";
import BaseSelect from "react-select";
import $ from 'jquery';
import { connect } from "react-redux";
import * as actions from "../../actions/clientportals";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";
import axios from "axios";
import FixRequiredSelect from "../../../src/components/controls/FixRequiredSelect";
const initialFValues = {
  id: 0,
  fileName: '',
  userId: '',
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
  const [selectedUser, setSelectedUser] = useState("");
  const [fileName, setFileName] = useState(""); // for uploading single image
 // const [fileName, setFileName] = useState([]); // for uploading some images
 const [renamefileName, setRenameFileName] = useState(""); // for uploading single image
  const [uploading, setUploading] = useState(false);
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
  } = useForm(initialFValues, props.setCurrentId);
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);

  // Populate User DDL
  const fetchUserURL = "http://localhost:4000/users/";
  const getUsers = () => fetch(fetchUserURL).then((res) => res.json());
  useEffect(() => {
   getUsers().then((data) => setUsers(data));
    // console.log(data);
  }, []);

  const optionsUser = [];
  if (users) {
   users.map((user) => {
     if(user.role == "user")
      optionsUser.push({ value: user._id, label: user.username });
    });
  }
  const Select = props => (
    <FixRequiredSelect
      {...props}
      SelectComponent={BaseSelect}
      options={props.optionsUser || optionsUser}
    />
  );
  var files = [];
  var file = {};
  const handleUploadFileHandler = (e) => {
   files = e.target.files;
   file = e.target.files[0];
  //  if(file)
  //   file.name = values.fileDescription;
   console.log(file);
    // showing image instant
var changed = false;
// window.alert("change image");
let imagesPreview = function(input, placeToInsertImagePreview) {
if(!changed){
 if (input.files) {
   let filesAmount = input.files.length;  //alert("file amount"+filesAmount)
   for (let i = 0; i < filesAmount; i++) {
     let reader = new FileReader();
     reader.onload = function(event) {
       $($.parseHTML("<img style='width:100%'>"))
         .attr("src", event.target.result)
         .appendTo(placeToInsertImagePreview);
     };
     reader.readAsDataURL(input.files[i]);
   }
   changed = true;
 }
}

};
$("#input-files").on("change", function() {//alert("change?")
$("div.preview-images").empty();
 imagesPreview(this, "div.preview-images");
});
  }
  const onSuccess = () => {
    ButterToast.raise({
        content: <Cinnamon.Crisp title="Client Portal Box"
            content="Uploaded successfully"
            scheme={Cinnamon.Crisp.SCHEME_PURPLE}
            icon={<AssignmentTurnedIn />}
        />
    })
}
 const handleSubmit = e => {//window.alert("sub")
   e.preventDefault();
   const bodyFormData = new FormData();

 //  values.userId = selectedUser.value;
    console.log("userId:"+selectedUser.value);
   bodyFormData.append("fileName",file);
   if(user.role == "user") {
    bodyFormData.append("userId",user._id);
   } else {
    bodyFormData.append("userId",selectedUser.value);
   }
   
  //  bodyFormData.append("fileDescription",values.fileDescription);
  // bodyFormData.append("uploadedDate",file.uploadedDate);
   setUploading(true);

   axios.post("/uploads", bodyFormData, {
     headers:{
       "Content-Type": "multipart/form-data"
     }
   }).then(response => {//console.log(response);
    // setRenameFileName(values.renameFileName); // for single upload
     setFileName(response.data);
  // setFileName([... response.data]); // for multiple upload
     setUploading(false);
   }).catch(err => {
     console.log(err);
     setUploading(false);
   })
   onSuccess();
    //consul
  // if (validate()) {
    // values.status = selectedStatus.value;
    // window.alert(x);
     addOrEdit(values, resetForm); // this not using for add or edit, only for modal closing
   // }
  };

  
  return (
    <Form onSubmit={handleSubmit} autoComplete="off" enctype="multipart/form-data">
    <Grid container>
    <Grid item xs={5}> 
    {user.role !="user" ?
      <div className="form-group">
      User <i className="text-danger">required</i>
     
      <Select
            name="userId"
            className={classes.ServiceDDL}
           onChange={e => setSelectedUser(e)}
            value={selectedUser}
            error={errors.userId}
            required
            displayEmpty
            options={optionsUser}
            isSearchable required
            placeholder="Choose User"
          />
          
        
        </div>: ""
        }
        <div className="custom-file mb-3" style={{"width":"50%", "float":"right"}}>
                
                <input type = "file" required onClick={handleUploadFileHandler} onChange = {handleUploadFileHandler} className="custom-file-input" id="input-files"></input>
                <label for="file" className="custom-file-label" style={{"zIndex":"0"}}>Choose File</label>  
                {/* <input
                  type="text"
                  name="renameFileName"
                  value={values.renameFileName}
                  onChange={handleInputChange}
                  id="renameFileName"
                  
                ></input> */}
                {uploading && <div>Uploading ...</div>}
        </div>
            <input type="submit" value="Submit" className="btn btn-primary btn-block"/>
      </Grid>
      
      <Grid item xs={1}></Grid>
      <Grid item xs={3}>
        <div className="preview-images" style={{"margin":"0px auto", "width":"300px"}}></div>
      </Grid>  
      <Grid item xs={3}></Grid>
    </Grid>
   
  </Form>

  );
};

const mapStateToProps = (state) => ({
    clientPortalList: state.clientportals.list,
});

const mapActionToProps = {
    fetchAll: actions.fetchAll,
   // createClientPortal: actions.create,
    updateClientPortal: actions.update,
    deleteClientPortal: actions.Delete
};
export default connect(mapStateToProps, mapActionToProps)(ClientPortalForm);


