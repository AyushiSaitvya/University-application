const Validator = require("validator");
const isEmpty = require("is-empty");


module.exports=function validateforgotPassword(data){
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : "";
  
    if (Validator.isEmpty(data.email)) {
      errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email) || !(data.email.endsWith("@nitjsr.ac.in"))) {
      errors.email = "Email is invalid.Please enter your correct college email id.";
    }
  
    return {
      errors,
      isValid: isEmpty(errors)
    };
   
  }
