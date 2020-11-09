require("./db");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const router = express.Router();
var ServiceRoutes = require("./controllers/ServiceController");
var CustomerRoutes = require("./controllers/CustomerController");
var StaffRoutes = require("./controllers/StaffController");
var StaffServiceRoutes = require("./controllers/StaffController");
var UserRoutes = require("./controllers/UserController");
var AppointmentRoutes = require("./controllers/AppointmentController");
var ClientPortalRoutes = require("./controllers/ClientPortalController");

var app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.json());

 app.use(cors({ origin: "http://localhost:3000" }));
//app.use(cors({ origin: "http://9ce9b90e76f4.ngrok.io" }));
// Dummy user adding
/*const User = require("./models/user");
const userInput = {
  username: "admin",
  password: "1234",
  role: "admin",
};

const user = new User(userInput);
user.save((err, document) => {
  if (err) console.log(err);
  console.log(document);
});*/

app.listen(4000, () => console.log("Server started at : 4000"));

app.use("/services", ServiceRoutes);
app.use("/customers", CustomerRoutes);
app.use("/staffs", StaffRoutes);
app.use("/staff_service", StaffServiceRoutes);
app.use("/staff_service/:id", StaffServiceRoutes);
app.use("/user", UserRoutes);
app.use("/users", UserRoutes);
app.use("/appointments", AppointmentRoutes);
app.use("/clientportals", ClientPortalRoutes);
app.use("/uploads", ClientPortalRoutes);
app.use("/uploads", express.static(path.join(__dirname, "/../uploads")));
