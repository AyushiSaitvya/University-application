const Validator = require("validator");
const isEmpty = require("is-empty");


module.exports = function validateLoginInput(data) {
  let errors = {};


// Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";


// Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)|| !(data.email.endsWith("@nitjsr.ac.in"))) {
    errors.email = "Email is invalid.Please enter correct college email id.";
  }

  
// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};