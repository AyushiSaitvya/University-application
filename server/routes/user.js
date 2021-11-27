
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const sendEmail = require('../email/email.send')
const msgs = require('../email/email.msgs')
const templates = require('../email/email.templates')
const validateRegisterInput = require("../validation/register");
const validateForgotPassword = require("../validation/forgotPassword");
const validateResetPassword = require("../validation/resetPassword");
const validateLoginInput = require("../validation/login");

// Load User model
const User = require("../model/user");

router.post("/api/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {

        if (!user.confirmed) {
          sendEmail(user.email, templates.confirm(user._id))
            .then(() => res.json({ msg: msgs.resend }))
        }
  
        // The user has already confirmed this email address
        else {
          res.json({ msg: msgs.alreadyConfirmed })
        }
        // res.send({ email: "Email already exists" });
        // return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role:req.body.role
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(newUser => sendEmail(newUser.email, templates.confirm(newUser._id)))
              .then(() => res.json({ msg: msgs.confirm }))
              .catch(err => console.log(err))
              .catch(err => console.log(err));
          });
        });
      }
    });
  });

  router.post("/api/forgotPassword", (req, res) => {
    // Form validation
  const { errors, isValid } = validateForgotPassword(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {
             sendEmail(user.email, templates.resetPassword(user._id))
            .then(() => res.json({ msg: msgs.resend }))
        
      } else {
              res.json({msg:'Email does not exist'})
  
          }
    });
  });

  router.post("/api/login", (req, res) => {

    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name,
            email:user.email,
            role:user.role
          };
  // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

  router.post(`/api/email/confirm`,(req, res) => {
    const id  = req.body.id

  User.findById(id)
    .then(user => {

      // A user with that id does not exist in the DB. Perhaps some tricky 
      // user tried to go to a different url than the one provided in the 
      // confirmation email.
      if (!user) {
        res.json({ msg: msgs.couldNotFind })
      }
      
      // The user exists but has not been confirmed. We need to confirm this 
      // user and let them know their email address has been confirmed.
      else if (user && !user.confirmed) {
        User.findByIdAndUpdate(id, { confirmed: true })
          .then(() => res.json({ msg: msgs.confirmed }))
          .catch(err => console.log(err))
      }

      // The user has already confirmed this email address.
      else  {
        res.json({ msg: msgs.alreadyConfirmed })
      }

    })
    .catch(err => console.log(err))
  });

  router.post(`/api/email/resetPassword`,(req, res) => {
    const id = req.body.id
    const { errors, isValid } = validateResetPassword(req.body);
   
      if (!isValid) {
        return res.status(400).json(errors);
      }
    User.findById(id)
    .then(user => {

      // A user with that id does not exist in the DB. Perhaps some tricky 
      // user tried to go to a different url than the one provided in the 
      // confirmation email.
      if (!user) {
        res.json({ msg: msgs.couldNotFind })
      }
      
      // The user exists but has not been confirmed. We need to confirm this 
      // user and let them know their email address has been confirmed.
      else  {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
                req.body.password = hash;
                User.findByIdAndUpdate(id, { 
                  password: req.body.password 
                }).then(() => res.json({ msg: 'Password Reset done' }))
                .catch(err => console.log(err))
          });
        })
  
      }
    })
    .catch(err => console.log(err))
  });




  module.exports = router;