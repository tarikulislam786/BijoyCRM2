const express = require("express");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
var router = express.Router();
const passport = require("passport");
const passportConfig = require("../passport"); // actual passport file
const JWT = require("jsonwebtoken");
var ObjectID = require("mongoose").Types.ObjectId;

var  user  = require("../models/user");
var { Service } = require("../models/service");
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: "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"
  // api_key: "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"
  }
}))
const signToken = userID => {
  return JWT.sign({
    iss : "BijoyTech",
    sub : userID
  }, "BijoyTech", {expiresIn : "1h"});
}
router.post("/register", function(req, res) {
  //var emailToken = req.query.token;
 // var isVerified = false;
  const { username, password, role } = req.body;
  user.findOne({ username }, (err, User) => {
    if (err) {
      res
      .status(500)
      .json({ message: { msgBody: "Error has occured here", msgError: true } });
    }
      
    if (User){
      res
      .status(400)
      .json({
        message: { msgBody: "Email is already taken", msgError: true },
      });
    } else {
    //  emailToken, isVerified, doesn't come from req.body, so use them right here
      var emailToken = crypto.randomBytes(64).toString("hex");
       var isVerified = false;
      const newUser = new user({username, emailToken, isVerified, password, role});
      newUser.save(err => {
        if(err) {console.log(err);
          res
          .status(500)
          .json({ message: { msgBody: "Error has occured there", msgError: true } });
        } else {
          var mtoken = newUser.emailToken;
          transporter.sendMail({
            to: newUser.username,
            from: "tarikul@bijoytech.com",
            subject: "Verify your email",
            text: `Hello, thanks for registering on our site.
            Please copy and paste the address below to verify your account.
            http://localhost:3000/verify-email?token=${mtoken}  
            `,
            html: `
            <h1>Hello,</h1>
            <p>Thanks for registering on our site.</p>
            <p>Please click the link below to verify your account.</p>
            <a href="http://localhost:3000/verify-email?token=${mtoken}">Verify your account</a>
            `
          })
          res
          .status(201)
          .json({ message: { msgBody: "Thanks for registering. Please check your email to verify your account.", msgError: false } });
        }
          
        });
    }
  });
});
// Email verification route
router.get("/verify-email", async(req, res, next) => {
  try {
    const user = await user.findOne({ emailToken: req.query.token }); 
    if(!user) { // if token not valid
      res
          .status(400)
          .json({ message: { msgBody: "Token is invalid. Please contact us for assistance.", msgError: true } });
    }
    user.emailToken = null;
    user.isVerified = true;
    await user.save();
    await req.login(user, async (err)=> {
      if(err) return next(err);
      res
          .status(201)
          .json({ message: { msgBody: "Welcome to BIJOY CRM panel.", msgError: false } });
          const redirectUrl = req.session.redirectTo || '/';
          delete req.session.redirectTo;
          res.redirect(redirectUrl);
    })
  } catch (error) {
    console.log(error);
    res
          .status(400)
          .json({ message: { msgBody: "Something went wrong. Please contact us for assistance.", msgError: true } });
    res.redirect("/");
  }
})

// use passport authentication middleware when login
router.post("/login", passport.authenticate("local", {session : false}), (req, res) => {
  if(req.isAuthenticated()) {
    const {_id, username, role} = req.user;
    const token = signToken(_id);
    res.cookie('access_token', token, {httpOnly: true, sameSite: true});
    res.status(200).json({isAuthenticated : true, user : {username, role}});
  }
})

router.get("/logout", passport.authenticate("jwt", {session : false}), (req, res) => {
  res.clearCookie("access_token");
  res.json({user: {username : "", role : ""}, success : true});
});

// admin panel
router.get("/admin", passport.authenticate("jwt", {session : false}), (req, res) => {
  if(req.user.role === "admin") {
    res.status(200).json({message : {msgBody : "You are an admin", msgError: false }});
  } else {
    res.status(403).json({message : {msgBody : "You are not an admin, go away", msgError: true }});
  }
});

// route for persistance on client. Even if the browser is closed and you are authenticated, so you can log in
// but if you dont use it, when you close browser the logged in status in react state is reset and cannot log in
router.get("/authenticated", passport.authenticate("jwt", {session : false}), (req, res) => {
  const {_id, username, role} = req.user;
  res.status(200).json({isAuthenticated : true, user : {_id, username, role}});
});
router.get("/", (req, res) => {
  user.find((err, docs) => {
    if (!err) res.send(docs);
    else
      console.log(
        "Error while retrieving all records : " +
          JSON.stringify(err, undefined, 2)
      );   
  });
});
module.exports = router;
